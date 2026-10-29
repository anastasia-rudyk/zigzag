import { EmptyState } from '../components/Feedback.jsx';

export default function NotFoundPage() {
  return (
    <div className="page max-w-xl">
      <EmptyState
        title="Такої сторінки немає"
        text="Можливо, посилання застаріло. Поверніться до каталогу й продовжуйте планувати подорож."
        action="До каталогу"
        to="/catalog"
      />
    </div>
  );
}
