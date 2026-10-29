import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-route text-white hover:bg-route-dark disabled:bg-route/50',
  secondary: 'bg-fir text-white hover:bg-fir-dark disabled:bg-fir/50',
  outline: 'border border-line bg-white text-ink hover:border-fir hover:text-fir-dark disabled:opacity-50',
  ghost: 'text-ink hover:bg-white disabled:opacity-50',
  danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50 disabled:opacity-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/** Кнопка або посилання з єдиним стилем для всього застосунку */
export default function Button({ variant = 'primary', size = 'md', to, className = '', children, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors
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
