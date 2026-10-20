import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Store,
  Layers,
  FolderTree,
  Users,
  RotateCcw,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { logoutAdmin, getCurrentAdmin } from "../../services/authStore";
import { resetToSampleData } from "../../services/mallStore";

const AdminNavigation = ({ onDataReset }) => {
  const [resetting, setResetting] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const adminUser = getCurrentAdmin();

  const handleResetData = async () => {
    if (window.confirm("Do you want to re-seed the mall database with complete sample stores and offers?")) {
      setResetting(true);
      await resetToSampleData();
      setResetting(false);
      alert("Sample stores and offers successfully re-seeded!");
      if (onDataReset) onDataReset();
      else window.location.reload();
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
    { to: "/admin/create_shop", label: "Create New Shop", icon: PlusCircle },
    { to: "/admin/list_of_all_shop", label: "View All Shops", icon: Store },
    { to: "/admin/view/floor", label: "View Floor-wise Shops", icon: Layers },
    { to: "/admin/view/category", label: "View Category Shops", icon: FolderTree },
    { to: "/admin/view/shop_owner", label: "View Shop Owners", icon: Users },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? "bg-purple-700 text-white font-semibold shadow-sm"
        : "text-purple-100/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Mobile Toggle */}
      <div className="lg:hidden p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <img
            src="/Screenshot 2024-10-31 091121.png"
            alt="Vista Square Dove"
            className="w-6 h-6 object-contain brightness-200"
          />
          <span className="text-sm font-bold text-white">Vista Square Admin</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-lg bg-white/10 text-white"
        >
          {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Content Container */}
      <div className={`p-4 space-y-5 ${mobileNavOpen ? "block" : "hidden lg:block"}`}>
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 p-2 border-b border-white/10 pb-4">
          <img
            src="/Screenshot 2024-10-31 091121.png"
            alt="Vista Square Dove"
            className="w-10 h-10 object-contain brightness-200"
          />
          <div>
            <h4 className="font-extrabold text-sm tracking-wider text-white uppercase font-sans">
              VISTA SQUARE
            </h4>
            <p className="text-[10px] text-purple-200/70 tracking-tight">
              Mall Administration Console
            </p>
          </div>
        </div>

        {/* Admin profile snippet */}
        <div className="mall-inner p-3 flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-lg bg-purple-700 flex items-center justify-center font-bold text-white">
            {adminUser?.name ? adminUser.name[0] : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">{adminUser?.name || "Administrator"}</p>
            <p className="text-[11px] text-purple-300/80 truncate">{adminUser?.role || "Mall Manager"}</p>
          </div>
        </div>

        {/* Links list */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-300/60 px-3 pb-1">
            Mall Administration
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={linkClass}
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0 text-purple-300" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </div>

        {/* Quick Customer view link */}
        <div className="pt-2 border-t border-white/10">
          <NavLink
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-purple-200/80 hover:text-white hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Mall Explorer</span>
            </span>
            <ChevronRight className="w-3 h-3 opacity-40" />
          </NavLink>
        </div>

        {/* Database Tools */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-300/60 px-3">
            Database Operations
          </p>
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-purple-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-purple-300 ${resetting ? "animate-spin" : ""}`} />
            <span>{resetting ? "Seeding..." : "Reset / Seed Dummy Data"}</span>
          </button>
        </div>
      </div>

      {/* Footer Exit Action */}
      <div className={`p-4 border-t border-white/10 ${mobileNavOpen ? "block" : "hidden lg:block"}`}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;
