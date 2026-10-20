// src/App.jsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AdminLogin from "./components/ADMIN/AdminLogin";
import AdminDashboard from "./components/ADMIN/AdminDashboard";
import AdminError from "./components/ADMIN/AdminError";
import AdminCreateShop from "./components/ADMIN/AdminCreateShop";
import AdminListAllShop from "./components/ADMIN/AdminListAllShop";
import AdminViewShopID from "./components/ADMIN/AdminViewShopID";
import AdminShopOffer from "./components/ADMIN/AdminShopOffer";
import AdminMallFloorData from "./components/ADMIN/AdminMallFloorData";
import AdminMallCategory from "./components/ADMIN/AdminMallCategory";
import AdminMallShopOwner from "./components/ADMIN/AdminMallShopOwner";

const App = () => {
  return (
    <Router>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="pt-16 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin_login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create_shop" element={<AdminCreateShop />} />
          <Route path="/admin/edit/:id" element={<AdminCreateShop isEdit={true} />} />
          <Route path="/admin_error" element={<AdminError />} />
          <Route path="/admin/list_of_all_shop" element={<AdminListAllShop />} />
          <Route path="/admin/view/:id" element={<AdminViewShopID />} />
          <Route path="/admin/view/offer/:id" element={<AdminShopOffer />} />
          <Route path="/admin/view/floor" element={<AdminMallFloorData />} />
          <Route path="/admin/view/category" element={<AdminMallCategory />} />
          <Route path="/admin/view/shop_owner" element={<AdminMallShopOwner />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
