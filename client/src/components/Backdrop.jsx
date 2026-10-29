import { useEffect, useState } from 'react';
import { useBackdropUrl } from '../context/BackdropContext.jsx';

/**
 * Фіксований фон усього застосунку: розмите фото поточної локації з темним
 * затемненням. Нове фото плавно проявляється поверх попереднього.
 */
export default function Backdrop() {
  const url = useBackdropUrl();
  const [layers, setLayers] = useState([]); // два останні фото для плавного переходу

  useEffect(() => {
    if (!url) return;
    setLayers((prev) => (prev.at(-1) === url ? prev : [...prev.slice(-1), url]));
  }, [url]);

  return (
    <div className="backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Базовий градієнт: ніч у Карпатах — видно, поки фото не завантажилось або його немає */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1E3A30_0%,_#0D1A16_55%,_#081210_100%)]" />
      {url &&
        layers.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className="backdrop-fade absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
          />
        ))}
      <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/40 to-night/90" />
    </div>
  );
}
