import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { signUp } = useAuth();
  return <AuthForm mode="register" onSubmit={({ name, email, password }) => signUp(name, email, password)} />;
}
