import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [admin, setAdmin] = useState([]);
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const snapshot = await getDocs(collection(db, "admin"));
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAdmin(data);
      } catch (err) {
        console.error("Firestore error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleAdminSubmit = () => {
    const err = {};
    if (!adminID) err.adminID = "Admin ID is required";
    if (!password) err.password = "Password is required";

    if (Object.keys(err).length) {
      setError(err);
      return;
    }

    const { adminUserID, adminPassword } = admin[0] || {};
    if (adminUserID === adminID && adminPassword === password) {
      nav("/admin");
    } else {
      nav("/admin_error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white text-center mb-6 tracking-wide">
          Admin Login
        </h2>

        {/* Admin ID */}
        <div className="mb-4">
          <label className="block text-sm text-white/80 mb-1">
            Admin ID
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50
                       border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter admin ID"
            value={adminID}
            onChange={(e) => setAdminID(e.target.value)}
          />
          {error.adminID && (
            <p className="text-red-300 text-xs mt-1">{error.adminID}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-white/80 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50
                       border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && (
            <p className="text-red-300 text-xs mt-1">{error.password}</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleAdminSubmit}
          className="w-full py-2 rounded-lg font-semibold text-white
                     bg-gradient-to-r from-purple-500 to-indigo-500
                     hover:from-purple-600 hover:to-indigo-600
                     transition-all duration-200 shadow-lg"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
