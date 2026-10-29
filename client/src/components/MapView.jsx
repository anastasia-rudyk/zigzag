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
    else if (points.length > 1) map.fitBounds(points, { padding: [32, 32] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

/**
 * Інтерактивна карта. Використовується в каталозі, на сторінці локації,
 * у конструкторі маршруту та на сторінці збереженої подорожі.
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
    <div style={{ height }} className="overflow-hidden rounded-xl border border-line">
      <MapContainer center={UKRAINE_CENTER} zoom={6} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fit && <FitBounds points={allPoints} />}

        {line && line.length > 1 && (
          <>
            <Polyline positions={line} pathOptions={{ color: '#ffffff', weight: 7, opacity: 0.9 }} />
            <Polyline positions={line} pathOptions={{ color: '#E8590C', weight: 4 }} />
          </>
        )}

        {start && (
          <CircleMarker
            center={[start.lat, start.lng]}
            radius={10}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#1B2A2F', fillOpacity: 1 }}
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
              radius={isSel ? 9 : 7}
              pathOptions={{
                color: '#ffffff',
                weight: 2,
                fillColor: isSel ? '#E8590C' : toneOf(loc.categoryId).band,
                fillOpacity: isSel ? 1 : 0.75,
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
