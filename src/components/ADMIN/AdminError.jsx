import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";
import { quickDemoLogin } from "../../services/authStore";

const AdminError = () => {
  const navigate = useNavigate();

  const handleDemo = () => {
    quickDemoLogin();
    navigate("/admin");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 text-center text-white space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Authentication Unsuccessful
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed">
            The administrator credentials provided do not match registered administrative records.
          </p>
        </div>

        <div className="glass-inner p-3.5 text-xs text-purple-200/80">
          <p className="font-semibold text-white mb-1">Default Credentials:</p>
          <p>ID: <span className="font-mono text-white">admin</span> | Password: <span className="font-mono text-white">admin123</span></p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => navigate("/admin_login")}
            className="glass-button w-full py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleDemo}
            className="glass-button-secondary w-full py-2 text-xs flex items-center justify-center gap-2 text-purple-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>One-Click Demo Admin Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminError;
