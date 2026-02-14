import { useNavigate } from "react-router-dom";

const AdminError = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      <div className="glass-card max-w-md w-full p-8 text-center text-white">
        <h1 className="text-2xl font-semibold mb-2">
          Admin Login Failed
        </h1>

        <p className="text-white/70 mb-6">
          Invalid Admin ID or Password.  
          Please try again.
        </p>

        <button
          onClick={() => nav("/admin_login")}
          className="glass-button w-full"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AdminError;
