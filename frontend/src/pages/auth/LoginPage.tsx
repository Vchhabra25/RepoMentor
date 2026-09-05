import { useNavigate } from "react-router-dom";
import { Compass, Chrome, UserRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, loginAsGuest, isConfigured } = useAuth();

  async function handleGoogle() {
    await loginWithGoogle();
    navigate("/dashboard");
  }

  async function handleGuest() {
    await loginAsGuest();
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-base grid-bg flex items-center justify-center px-6">
      <Card padding="lg" className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-signal-gradient flex items-center justify-center mb-4">
            <Compass size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-display font-semibold text-ink">Sign in to RepoMentor</h1>
          <p className="text-sm text-ink-muted mt-1.5">
            Pick up where you left off with your repositories.
          </p>
        </div>

        {!isConfigured && (
          <p className="text-xs text-accent-amber bg-accent-amber/10 border border-accent-amber/20 rounded-lg px-3 py-2 mb-4 text-center">
            Firebase isn't configured yet — add your credentials to .env to enable sign-in.
          </p>
        )}

        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            icon={<Chrome size={17} />}
            onClick={handleGoogle}
            disabled={!isConfigured}
          >
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            icon={<UserRound size={17} />}
            onClick={handleGuest}
            disabled={!isConfigured}
          >
            Continue as guest
          </Button>
        </div>

        <p className="text-xs text-ink-faint text-center mt-8">
          By continuing you agree to RepoMentor AI's Terms and Privacy Policy.
        </p>
      </Card>
    </div>
  );
}
