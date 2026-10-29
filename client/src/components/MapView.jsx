import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap } from 'react-leaflet';
import { toneOf } from './CategoryBadge.jsx';

const UKRAINE_CENTER = [48.9, 31.2];

/** Підганяє масштаб карти під усі точки */
function FitBounds({ points }) {
  const map = useMap();
  const key = points.map((p) => `${p[0]},${p[1]}`).join('|');
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 10);
    else if (points.length > 1) map.fitBounds(points, { padding: [36, 36] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

/**
 * Інтерактивна карта з темною підкладкою. Використовується в каталозі, на сторінці
 * локації, у конструкторі маршруту та на сторінці збереженої подорожі.
 *
 * locations   — маркери локацій
 * selectedIds — виділені маркери (обрані для подорожі)
 * order       — id локацій у порядку маршруту (нумерація маркерів)
 * start       — стартова точка { name, lat, lng }
 * line        — масив [lat, lng] для лінії маршруту
 * fitPoints   — точки, під які підганяється масштаб (за замовчуванням усі маркери)
 */
export default function MapView({
  locations = [],
  selectedIds = [],
  order = [],
  start,
  line,
  onMarkerClick,
  height = 420,
  fit = true,
  fitPoints,
}) {
  const allPoints = fitPoints || [
    ...(start ? [[start.lat, start.lng]] : []),
    ...locations.map((l) => [l.lat, l.lng]),
  ];

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-white/15 shadow-glass">
      <MapContainer center={UKRAINE_CENTER} zoom={6} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        {fit && <FitBounds points={allPoints} />}

        {line && line.length > 1 && (
          <>
            <Polyline positions={line} pathOptions={{ color: '#FF7A2F', weight: 10, opacity: 0.25 }} />
            <Polyline positions={line} pathOptions={{ color: '#FF7A2F', weight: 4 }} />
          </>
        )}

        {start && (
          <CircleMarker
            center={[start.lat, start.lng]}
            radius={10}
            pathOptions={{ color: '#0D1A16', weight: 3, fillColor: '#FFFFFF', fillOpacity: 1 }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              Старт: {start.name}
            </Tooltip>
          </CircleMarker>
        )}

        {locations.map((loc) => {
          const isSel = selectedIds.includes(loc._id);
          const pos = order.indexOf(loc._id);
          return (
            <CircleMarker
              key={loc._id}
              center={[loc.lat, loc.lng]}
              radius={isSel ? 9 : 6}
              pathOptions={{
                color: isSel ? '#FFFFFF' : '#0D1A16',
                weight: 2,
                fillColor: isSel ? '#FF7A2F' : toneOf(loc.categoryId).color,
                fillOpacity: isSel ? 1 : 0.85,
              }}
              eventHandlers={onMarkerClick ? { click: () => onMarkerClick(loc) } : undefined}
            >
              <Tooltip direction="top" offset={[0, -6]} permanent={pos >= 0}>
                {pos >= 0 ? `${pos + 1}. ` : ''}
                {loc.name}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
