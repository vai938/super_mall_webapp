// src/App.jsx

import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";

import AdminLogin from "./components/ADMIN/AdminLogin";
import AdminDashboard from "./components/ADMIN/AdminDashboard";
import Home from "./components/Home";
import AdminError from "./components/ADMIN/AdminError";
import AdminCreateShop from "./components/ADMIN/AdminCreateShop";
import AdminListAllShop from "./components/ADMIN/AdminListAllShop";
import AdminViewShopID from "./components/ADMIN/AdminViewShopID";
import AdminShopOffer from "./components/ADMIN/AdminShopOffer";
import AdminMallFloorData from "./components/ADMIN/AdminMallFloorData";
import AdminMallCategory from "./components/ADMIN/AdminMallCategory";
import AdminMallShopOwner from "./components/ADMIN/AdminMallShopOwner";

const topNavClass = ({ isActive }) =>
  `
  px-4 py-2 rounded-xl
  text-white/80
  hover:text-white
  hover:bg-white/20
  transition-all duration-200
  ${isActive ? "bg-white/30 text-white font-semibold" : ""}
  `;

const App = () => {
  return (
    <Router>
      {/* FIXED Glass Navbar */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="glass-card flex items-center justify-between px-6 py-3">
            <div className="text-white font-semibold text-lg">
              Mall Admin System
            </div>

            <div className="flex gap-2">
              <NavLink to="/" className={topNavClass}>
                Home
              </NavLink>
              <NavLink to="/admin_login" className={topNavClass}>
                Admin Login
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT — padding MUST match navbar height */}
      <main className="pt-28 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin_login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/create_shop" element={<AdminCreateShop />} />
          <Route path="/admin_error" element={<AdminError />} />
          <Route path="/admin/list_of_all_shop" element={<AdminListAllShop />} />
          <Route path="/admin/view/:id" element={<AdminViewShopID />} />
          <Route path="/admin/view/offer/:id" element={<AdminShopOffer />} />
          <Route path="/admin/view/floor" element={<AdminMallFloorData />} />
          <Route path="/admin/view/category" element={<AdminMallCategory />} />
          <Route
            path="/admin/view/shop_owner"
            element={<AdminMallShopOwner />}
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
