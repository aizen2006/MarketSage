import { AuthForm } from "../../components/AuthForm";
import { AuthProvider } from "../../context/AuthContext";

export default function SignUpPage() {
  return (
    <AuthProvider>
      <AuthForm mode="signup" />
    </AuthProvider>
  );
}

