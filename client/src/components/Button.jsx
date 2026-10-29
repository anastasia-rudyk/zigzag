import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-route text-white hover:bg-route-dark disabled:bg-route/40',
  light: 'bg-white text-night hover:bg-route-light disabled:opacity-50',
  secondary: 'bg-fir text-white hover:bg-fir-dark disabled:bg-fir/40',
  glass: 'border border-white/20 bg-white/10 text-ink backdrop-blur hover:bg-white/20 disabled:opacity-50',
  ghost: 'text-ink hover:bg-white/10 disabled:opacity-50',
  danger: 'border border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 disabled:opacity-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/** Кнопка або посилання з єдиним стилем для всього застосунку */
export default function Button({ variant = 'primary', size = 'md', to, className = '', children, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors
    disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}
