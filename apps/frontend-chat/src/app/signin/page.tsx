import { AuthForm } from "../../components/AuthForm";
import { AuthProvider } from "../../context/AuthContext";

export default function SignInPage() {
  return (
    <AuthProvider>
      <AuthForm mode="signin" />
    </AuthProvider>
  );
}

