import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, User, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { loginAdmin, quickDemoLogin, isAuthenticated, seedAdminCredentials } from "../../services/authStore";

const AdminLogin = () => {
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  useEffect(() => {
    // If already authenticated, jump to admin
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
    // Seed default admin in Firestore if needed
    seedAdminCredentials();
  }, [navigate, from]);

  const handleAdminSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoginErrorMsg("");

    const err = {};
    if (!adminID.trim()) err.adminID = "Admin ID is required";
    if (!password) err.password = "Password is required";

    if (Object.keys(err).length) {
      setError(err);
      return;
    }
    setError({});
    setLoading(true);

    try {
      const res = await loginAdmin(adminID.trim(), password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setLoginErrorMsg(res.error || "Invalid Admin ID or Password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginErrorMsg("Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoLogin();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Mall Administration
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/70">
              Authorized mall management and store operations portal
            </p>
          </div>

          {/* Error Banner */}
          {loginErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center flex items-center justify-center gap-2">
              <span>{loginErrorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {/* Admin ID */}
            <div>
              <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                Admin Username / ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  className="glass-input pl-10"
                  placeholder="e.g. admin"
                  value={adminID}
                  onChange={(e) => setAdminID(e.target.value)}
                  autoComplete="username"
                />
              </div>
              {error.adminID && (
                <p className="text-rose-300 text-xs mt-1 font-medium">{error.adminID}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="glass-input pl-10 pr-10"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error.password && (
                <p className="text-rose-300 text-xs mt-1 font-medium">{error.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full py-3 text-sm mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="glass-button-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/35 border-purple-400/30 text-purple-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>One-Click Demo Admin Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Credentials Note */}
            <div className="glass-inner p-3 text-center text-xs text-purple-200/70">
              <span className="font-semibold text-white">Default Credentials:</span>{" "}
              ID <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">admin</code> |
              Password <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
