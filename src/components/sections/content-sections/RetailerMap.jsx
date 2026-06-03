"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiSearch,
  FiTag,
  FiX,
} from "react-icons/fi";

const GOOGLE_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAP_SITE_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MAP_STYLES = [
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e7efe4" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6c7280" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d4e8ef" }],
  },
];

function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);

    if (existing) {
      if (existing.dataset.loaded) {
        resolve();
      } else {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function stripTags(value = "") {
  return String(value).replace(/<[^>]*>/g, "").trim();
}

function decodeEntities(value = "") {
  return stripTags(value)
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&aring;/gi, "a")
    .replace(/&auml;/gi, "a")
    .replace(/&ouml;/gi, "o")
    .replace(/&ndash;/g, "-");
}

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function parseCoordinate(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeUrl(value) {
  const url = typeof value === "object" ? value?.url : value;
  if (typeof url !== "string") return "";

  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
}

function normalizeWorkingDays(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value && typeof value === "object") return Object.values(value).filter(Boolean).join(", ");
  return stripTags(value);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJsString(value = "") {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function getPhoneHref(phone = "") {
  const cleaned = String(phone).replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

function getEmailHref(email = "") {
  const cleaned = String(email).trim();
  return cleaned ? `mailto:${cleaned}` : "";
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function calcDistanceMiles(lat1, lng1, lat2, lng2) {
  const radiusMiles = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return radiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizeStores(raw = []) {
  return raw
    .map((store) => {
      const acf = store?.acf || {};
      const mapLocation = pickFirst(acf.location, acf.map_location, acf.store_location);
      const lat = parseCoordinate(
        pickFirst(
          acf.location_lat,
          acf.lat,
          acf.latitude,
          acf.store_lat,
          acf.store_latitude,
          mapLocation?.lat
        )
      );
      const lng = parseCoordinate(
        pickFirst(
          acf.location_lng,
          acf.lng,
          acf.longitude,
          acf.store_lng,
          acf.store_longitude,
          mapLocation?.lng
        )
      );

      return {
        id: store?.id || `${lat}-${lng}`,
        name: decodeEntities(
          pickFirst(
            acf.store_name,
            acf.location_name,
            acf.name,
            store?.title?.rendered,
            store?.title
          )
        ),
        address: stripTags(
          pickFirst(
            acf.location_address,
            acf.store_address,
            acf.address,
            mapLocation?.address
          )
        ),
        phone: stripTags(pickFirst(acf.location_phone, acf.store_phone, acf.phone)),
        email: stripTags(pickFirst(acf.location_email, acf.store_email, acf.email)),
        region: stripTags(pickFirst(acf.location_region, acf.store_region, acf.region)),
        website: normalizeUrl(
          pickFirst(acf.website_link, acf.store_website, acf.website, acf.url)
        ),
        workingHours: stripTags(
          pickFirst(acf.working_hours, acf.location_working_hours, acf.hours)
        ),
        workingDays: normalizeWorkingDays(acf.working_days),
        tag: stripTags(pickFirst(acf.tag, acf.location_tag, acf.store_tag)),
        lat,
        lng,
        distance: null,
      };
    })
    .filter((store) => store.lat !== null && store.lng !== null);
}

function getMapCenter(stores) {
  if (!stores.length) return { lat: 59.3293, lng: 18.0686 };

  return {
    lat: stores.reduce((sum, store) => sum + store.lat, 0) / stores.length,
    lng: stores.reduce((sum, store) => sum + store.lng, 0) / stores.length,
  };
}

function getMarkerIcon() {
  const svg = `
    <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <filter id="shadow" x="0" y="0" width="44" height="56" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.25"/>
      </filter>
      <g filter="url(#shadow)">
        <path d="M22 4C12.1 4 4 11.9 4 21.6C4 34.8 22 52 22 52C22 52 40 34.8 40 21.6C40 11.9 31.9 4 22 4Z" fill="#445641"/>
        <circle cx="22" cy="21.5" r="9.5" fill="#EAAF0F"/>
        <circle cx="22" cy="21.5" r="4.5" fill="#ffffff"/>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildInfoWindowContent(store) {
  const dist =
    store.distance != null ? `${store.distance.toFixed(2)} Miles` : "";
  const website = store.website ? escapeHtml(store.website) : "";
  const phoneHref = getPhoneHref(store.phone);
  const emailHref = getEmailHref(store.email);

  return `
    <div style="font-family:system-ui,sans-serif;max-width:280px;padding:8px 4px 4px">
      <div style="display:inline-flex;margin-bottom:8px;border-radius:999px;background:#445641;color:#fff;padding:4px 9px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">${escapeHtml(
        store.region || store.tag || "Retailer"
      )}</div>
      <strong style="color:#111;font-size:17px;line-height:1.2;display:block;margin-bottom:8px">${escapeHtml(
        store.name
      )}</strong>
      ${
        store.address
          ? `<p style="margin:0 0 6px;font-size:13px;line-height:1.4;color:#444">${escapeHtml(
              store.address
            )}</p>`
          : ""
      }
      ${
        dist
          ? `<p style="color:#00709E;font-size:12px;margin:4px 0;font-weight:700">${escapeHtml(
              dist
            )}</p>`
          : ""
      }
      ${
        store.phone
          ? `<p style="font-size:12px;margin:4px 0"><span style="display:inline-block;width:16px;color:#445641;font-weight:700">T</span><a href="${escapeHtml(
              phoneHref
            )}" style="color:#00709E;text-decoration:none">${escapeHtml(
              store.phone
            )}</a></p>`
          : ""
      }
      ${
        store.email
          ? `<p style="font-size:12px;margin:3px 0"><span style="display:inline-block;width:16px;color:#445641;font-weight:700">@</span><a href="${escapeHtml(
              emailHref
            )}" style="color:#00709E;text-decoration:none">${escapeHtml(
              store.email
            )}</a></p>`
          : ""
      }
      ${
        store.workingHours
          ? `<p style="color:#444;font-size:12px;margin:4px 0"><span style="display:inline-block;width:16px;color:#445641;font-weight:700">H</span>${escapeHtml(
              store.workingHours
            )}</p>`
          : ""
      }
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button onclick="window.__rm&&window.__rm.directions('${escapeJsString(
          store.id
        )}')" style="background:#445641;color:#fff;border:none;padding:8px 12px;border-radius:4px;font-size:12px;font-weight:700;cursor:pointer">Directions</button>
        <button onclick="window.__rm&&window.__rm.zoom(${store.lat},${
    store.lng
  })" style="background:#00709E;color:#fff;border:none;padding:8px 12px;border-radius:4px;font-size:12px;font-weight:700;cursor:pointer">Zoom</button>
        ${
          website
            ? `<button onclick="window.open('${website}','_blank','noopener,noreferrer')" style="background:#EAAF0F;color:#111;border:none;padding:8px 12px;border-radius:4px;font-size:12px;font-weight:700;cursor:pointer">Homepage</button>`
            : ""
        }
      </div>
    </div>
  `;
}

export default function RetailerMap({ stores: rawStores = [] }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const clustererRef = useRef(null);
  const circleRef = useRef(null);
  const dirRendererRef = useRef(null);
  const dirServiceRef = useRef(null);
  const geocoderRef = useRef(null);
  const infoWinRef = useRef(null);
  const searchInputRef = useRef(null);
  const fromInputRef = useRef(null);

  const baseStores = useMemo(() => normalizeStores(rawStores), [rawStores]);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState("");
  const [stores, setStores] = useState(baseStores);
  const [directionsModal, setDirectionsModal] = useState(null);
  const [fromAddress, setFromAddress] = useState("");
  const [unitSystem, setUnitSystem] = useState("miles");
  const [directionSteps, setDirectionSteps] = useState([]);
  const [directionSummary, setDirectionSummary] = useState(null);

  useEffect(() => {
    setStores(baseStores);
  }, [baseStores]);

  const applySearchedLocation = useCallback((userLat, userLng, markerObjects = markersRef.current) => {
    const updated = baseStores
      .map((store) => ({
        ...store,
        distance: calcDistanceMiles(userLat, userLng, store.lat, store.lng),
      }))
      .sort((a, b) => a.distance - b.distance);

    setStores(updated);

    markerObjects.forEach((markerObject) => {
      const match = updated.find((store) => store.id === markerObject.store.id);
      if (match) markerObject.store.distance = match.distance;
    });

    mapRef.current?.setCenter({ lat: userLat, lng: userLng });
    mapRef.current?.setZoom(8);

    circleRef.current?.setMap(null);
    circleRef.current = new window.google.maps.Circle({
      map: mapRef.current,
      center: { lat: userLat, lng: userLng },
      radius: 100000,
      fillColor: "#ffff00",
      fillOpacity: 0.15,
      strokeColor: "#cccc00",
      strokeOpacity: 0.6,
      strokeWeight: 1,
    });
  }, [baseStores]);

  useEffect(() => {
    async function load() {
      if (!GOOGLE_API_KEY) {
        setMapsError("Missing Google Maps browser API key.");
        return;
      }

      try {
        const params = new URLSearchParams({
          key: GOOGLE_API_KEY,
          libraries: "places,geometry",
        });

        await loadScript(
          `https://maps.googleapis.com/maps/api/js?${params.toString()}`,
          "gm-script"
        );
        loadScript(
          "https://unpkg.com/@googlemaps/markerclusterer/dist/index.umd.js",
          "gm-clusterer"
        ).catch(() => {});
        setMapsLoaded(true);
      } catch {
        setMapsError("Failed to load Google Maps. Please check your API key.");
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !mapDivRef.current || !window.google?.maps) return;

    markersRef.current.forEach(({ marker }) => marker.setMap(null));
    markersRef.current = [];
    clustererRef.current?.clearMarkers?.();
    circleRef.current?.setMap(null);
    dirRendererRef.current?.setMap(null);

    const map = new window.google.maps.Map(mapDivRef.current, {
      center: getMapCenter(baseStores),
      zoom: baseStores.length > 1 ? 6 : 12,
      styles: MAP_STYLES,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    mapRef.current = map;

    dirServiceRef.current = new window.google.maps.DirectionsService();
    geocoderRef.current = new window.google.maps.Geocoder();
    dirRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
    });
    dirRendererRef.current.setMap(map);

    const infoWin = new window.google.maps.InfoWindow();
    infoWinRef.current = infoWin;

    const markerObjects = baseStores.map((store) => {
      const marker = new window.google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map,
        title: store.name,
        icon: {
          url: getMarkerIcon(),
          scaledSize: new window.google.maps.Size(44, 56),
          anchor: new window.google.maps.Point(22, 52),
        },
      });

      marker.addListener("click", () => {
        infoWin.setContent(buildInfoWindowContent(store));
        infoWin.open(map, marker);
      });

      return { marker, store };
    });

    markersRef.current = markerObjects;

    setTimeout(() => {
      const ClustererClass =
        window?.markerClusterer?.MarkerClusterer ||
        window?.MarkerClusterer ||
        window?.["@googlemaps/markerclusterer"]?.MarkerClusterer;

      if (!ClustererClass || markerObjects.length < 2) return;

      try {
        clustererRef.current = new ClustererClass({
          map,
          markers: markerObjects.map(({ marker }) => marker),
        });
      } catch {}
    }, 1000);

    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInputRef.current
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const userLat = place.geometry.location.lat();
        const userLng = place.geometry.location.lng();
        applySearchedLocation(userLat, userLng, markerObjects);
      });
    }

    window.__rm = {
      directions: (id) => {
        const store = baseStores.find((item) => String(item.id) === String(id));
        if (!store) return;
        setDirectionsModal(store);
        setFromAddress("");
        infoWin.close();
      },
      zoom: (lat, lng) => {
        map.setCenter({ lat, lng });
        map.setZoom(15);
        infoWin.close();
      },
    };

    return () => {
      delete window.__rm;
      markersRef.current.forEach(({ marker }) => marker.setMap(null));
      markersRef.current = [];
      clustererRef.current?.clearMarkers?.();
      dirRendererRef.current?.setMap(null);
    };
  }, [applySearchedLocation, baseStores, mapsLoaded]);

  function handleSearchLocation() {
    const query = searchInputRef.current?.value?.trim();
    if (!query || !geocoderRef.current) return;

    geocoderRef.current.geocode({ address: query }, (results, status) => {
      const location = results?.[0]?.geometry?.location;
      if (status !== "OK" || !location) return;

      applySearchedLocation(location.lat(), location.lng());
    });
  }

  useEffect(() => {
    if (!directionsModal || !window.google?.maps?.places) return;

    const timer = setTimeout(() => {
      if (!fromInputRef.current) return;
      const autocomplete = new window.google.maps.places.Autocomplete(
        fromInputRef.current
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) setFromAddress(place.formatted_address);
      });
    }, 80);

    return () => clearTimeout(timer);
  }, [directionsModal]);

  function handleGetDirections() {
    if (!directionsModal || !fromAddress || !dirServiceRef.current) return;

    dirServiceRef.current.route(
      {
        origin: fromAddress,
        destination: { lat: directionsModal.lat, lng: directionsModal.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem:
          unitSystem === "km"
            ? window.google.maps.UnitSystem.METRIC
            : window.google.maps.UnitSystem.IMPERIAL,
      },
      (result, status) => {
        if (status !== "OK") return;

        dirRendererRef.current.setDirections(result);
        const leg = result.routes[0].legs[0];
        setDirectionSummary({
          from: leg.start_address,
          to: leg.end_address,
          distance: leg.distance.text,
          duration: leg.duration.text,
        });
        setDirectionSteps(
          leg.steps.map((step, index) => ({
            id: `${index}-${step.distance.text}`,
            index: index + 1,
            html: step.instructions || step.html_instructions || "",
            distance: step.distance.text,
          }))
        );
        setDirectionsModal(null);
      }
    );
  }

  function handleReset() {
    setDirectionSteps([]);
    setDirectionSummary(null);
    setStores(baseStores);
    circleRef.current?.setMap(null);
    circleRef.current = null;
    dirRendererRef.current?.setDirections({ routes: [] });

    if (mapRef.current) {
      mapRef.current.setCenter(getMapCenter(baseStores));
      mapRef.current.setZoom(baseStores.length > 1 ? 6 : 12);
    }

    if (searchInputRef.current) searchInputRef.current.value = "";
  }

  function handleListClick(store) {
    if (!mapRef.current) return;

    mapRef.current.setCenter({ lat: store.lat, lng: store.lng });
    mapRef.current.setZoom(13);

    const found = markersRef.current.find(
      (markerObject) => markerObject.store.id === store.id
    );
    if (found && window.google) {
      window.google.maps.event.trigger(found.marker, "click");
    }
  }

  return (
    <>
      <div className="web-width px-6 pb-20">
      <div className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <div className="flex min-h-[720px] flex-col lg:h-[680px] lg:min-h-0 lg:flex-row">
          <div className="flex max-h-[430px] shrink-0 flex-col overflow-hidden border-b border-black/10 bg-[#F7F7F4] lg:max-h-none lg:w-[390px] lg:border-b-0 lg:border-r">
        <div className="border-b border-black/10 bg-white p-5">
          <p className="mb-3 flex items-center gap-2 text-[13px] font-medium uppercase leading-[20px] tracking-[0.56px] text-[#1A1A1A] [font-family:var(--font-body)]">
            <span className="h-[14px] w-[2px] bg-[var(--color-yellow)]" />
            Search location
          </p>
          <div className="flex gap-2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Enter a location"
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearchLocation();
              }}
              className="h-12 min-w-0 flex-1 rounded-[4px] border border-black/15 bg-white px-4 text-[15px] text-[#1A1A1A] outline-none transition-colors placeholder:text-[#6f7280] focus:border-[var(--color-accent)]"
            />
            <button
              aria-label="Search"
              onClick={handleSearchLocation}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-[image:var(--mpp-gradient)] text-white transition-opacity hover:opacity-90"
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!directionSummary && (
          <div className="shrink-0 bg-[#445641] px-5 py-4">
            <p className="text-[15px] font-medium leading-[22px] text-white [font-family:var(--font-heading)]">
              {stores.length} retailers found
            </p>
          </div>
        )}

        {directionSummary ? (
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="border-b border-black/10 bg-[#F7F7F4] p-5">
              <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.56px] text-[var(--color-accent)]">
                Route
              </p>
              <p className="text-[14px] leading-[20px] text-[#5A5D66]">
                {directionSummary.from}
              </p>
              {directionSummary.to && (
                <p className="mt-1 text-[14px] leading-[20px] text-[#5A5D66]">
                  to {directionSummary.to}
                </p>
              )}
              <p className="mt-4 text-[20px] font-medium leading-[26px] tracking-[-0.4px] text-black [font-family:var(--font-heading)]">
                {directionSummary.distance} - Approximately{" "}
                {directionSummary.duration}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 inline-flex items-center gap-2 rounded-[4px] border border-black/15 bg-white px-4 py-2 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] [font-family:var(--font-heading)]"
              >
                Back to retailers
              </button>
            </div>

            <ol className="divide-y divide-black/10">
              {directionSteps.map((step) => (
                <li
                  key={step.id}
                  className="grid grid-cols-[28px_1fr_auto] items-start gap-3 px-5 py-4 text-[14px] leading-[20px]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#445641] text-[12px] font-semibold text-white">
                    {step.index}
                  </span>
                  <span
                    className="min-w-0 text-[#1A1A1A] [&_b]:font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: step.html || "Continue on the route",
                    }}
                  />
                  <span className="shrink-0 font-semibold text-[var(--color-accent)]">
                    {step.distance}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="flex-1 divide-y divide-black/10 overflow-y-auto bg-white">
            {stores.length ? (
              stores.map((store) => (
                <div
                  key={store.id}
                  className="cursor-pointer p-5 transition-colors hover:bg-[#F7F7F4] active:bg-[#EFEFE9]"
                  onClick={() => handleListClick(store)}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h4 className="text-[20px] font-medium leading-[26px] tracking-[-0.4px] text-black [font-family:var(--font-heading)]">
                    {store.name || "Store"}
                    </h4>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#445641] text-white">
                      <FiMapPin className="h-4 w-4" />
                    </span>
                  </div>

                  {store.address && (
                    <div className="mb-2 flex items-start gap-2 text-[13px] leading-[19px] text-[#5A5D66]">
                      <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                      <span>{store.address}</span>
                    </div>
                  )}

                  {store.phone && (
                    <div className="mb-2 flex items-center gap-2 text-[13px] leading-[19px] text-[#5A5D66]">
                      <FiPhone className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                      <span>{store.phone}</span>
                    </div>
                  )}

                  {(store.region || store.tag) && (
                    <div className="mb-2 flex items-center gap-2 text-[13px] leading-[19px] text-[#5A5D66]">
                      <FiTag className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                      <span>{store.region || store.tag}</span>
                    </div>
                  )}

                  {(store.workingDays || store.workingHours) && (
                    <div className="mb-4 flex items-start gap-2 text-[13px] leading-[19px] text-[#5A5D66]">
                      <FiClock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                      {[store.workingDays, store.workingHours].filter(Boolean).join(" / ")}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setDirectionsModal(store);
                        setFromAddress("");
                      }}
                      className="inline-flex items-center gap-2 rounded-[4px] bg-[#445641] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 [font-family:var(--font-heading)]"
                    >
                      <FiNavigation className="h-3.5 w-3.5" />
                      Directions
                    </button>

                    {store.website && (
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-[4px] border border-black/15 bg-white px-4 py-2 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] [font-family:var(--font-heading)]"
                      >
                        <FiExternalLink className="h-3.5 w-3.5" />
                        Homepage
                      </a>
                    )}

                    {store.distance != null && (
                      <span className="ml-auto shrink-0 text-xs font-medium text-gray-400">
                        {store.distance.toFixed(2)} Miles
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-[15px] leading-[22px] text-[#5A5D66]">
                No store locations are available yet.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative min-h-[460px] flex-1 bg-[#EFF2F0]">
        {(mapsError || !baseStores.length) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#EFF2F0] px-4 text-center text-[15px] leading-[22px] text-[#5A5D66]">
            {mapsError || "Add latitude and longitude values to show stores on the map."}
          </div>
        )}
        <div ref={mapDivRef} className="h-full min-h-[460px] w-full lg:min-h-0" />

        <button
          onClick={handleReset}
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-[4px] border border-black/10 bg-white px-4 py-3 text-[13px] font-medium text-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] [font-family:var(--font-heading)]"
        >
          <FiArrowUpRight className="h-4 w-4" />
          Reset Map
        </button>
      </div>
        </div>
      </div>
      </div>

      {directionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[460px] rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                Get Directions
              </h3>
              <button
                onClick={() => setDirectionsModal(null)}
                className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  From:
                </label>
                <input
                  ref={fromInputRef}
                  type="text"
                  value={fromAddress}
                  onChange={(event) => setFromAddress(event.target.value)}
                  placeholder="Enter your starting location"
                  className="h-10 w-full rounded border border-gray-300 px-3 text-sm outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  To:
                </label>
                <input
                  type="text"
                  readOnly
                  value={directionsModal.name}
                  className="h-10 w-full rounded border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    value="km"
                    checked={unitSystem === "km"}
                    onChange={() => setUnitSystem("km")}
                    className="accent-[var(--color-accent)]"
                  />
                  Kilometers
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    value="miles"
                    checked={unitSystem === "miles"}
                    onChange={() => setUnitSystem("miles")}
                    className="accent-[var(--color-accent)]"
                  />
                  Miles
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGetDirections}
                disabled={!fromAddress.trim()}
                className="rounded bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
