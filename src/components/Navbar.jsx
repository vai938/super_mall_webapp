import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, LogIn, LogOut, Menu, X, Tag, Store, Layers, GitCompare } from "lucide-react";
import { isAuthenticated, getCurrentAdmin, logoutAdmin } from "../services/authStore";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setAdminUser(getCurrentAdmin());
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutAdmin();
    setIsLoggedIn(false);
    setAdminUser(null);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
      isActive
        ? "bg-white/20 text-white font-semibold"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-purple-950/90 backdrop-blur-md border-b border-white/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Identity: VISTA SQUARE */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/Screenshot 2024-10-31 091121.png"
              alt="Vista Square Dove Logo"
              className="w-9 h-9 object-contain brightness-200 contrast-125"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white uppercase font-sans">
                  VISTA SQUARE
                </span>
                <span className="text-[10px] tracking-wide font-medium px-2 py-0.5 rounded bg-white/15 text-purple-200">
                  Super Mall
                </span>
              </div>
              <p className="text-[10px] text-purple-200/70 tracking-tight hidden sm:block">
                Your One-Stop Shopping Destination
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>
              <Store className="w-3.5 h-3.5" />
              <span>Mall Directory</span>
            </NavLink>
            <NavLink to="/#offers" className={navLinkClass}>
              <Tag className="w-3.5 h-3.5" />
              <span>Deals & Offers</span>
            </NavLink>
            <NavLink to="/#compare" className={navLinkClass}>
              <GitCompare className="w-3.5 h-3.5" />
              <span>Product Comparison</span>
            </NavLink>
            <NavLink to="/#floors" className={navLinkClass}>
              <Layers className="w-3.5 h-3.5" />
              <span>Floor Guide</span>
            </NavLink>
            {isLoggedIn && (
              <NavLink to="/admin" className={navLinkClass}>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Admin Panel</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Zone */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="text-xs px-2.5 py-1 rounded bg-white/10 text-purple-200 border border-white/10">
                  <span>{adminUser?.name || "Admin"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 text-xs font-semibold border border-rose-500/30 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/admin_login"
                className="mall-btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </NavLink>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-purple-950/98 border-b border-white/15 px-4 pt-3 pb-5 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
          >
            Mall Directory
          </NavLink>
          <NavLink
            to="/#offers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
          >
            Deals & Offers
          </NavLink>
          <NavLink
            to="/#compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
          >
            Product Comparison
          </NavLink>
          <NavLink
            to="/#floors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
          >
            Floor Guide
          </NavLink>
          {isLoggedIn ? (
            <>
              <div className="pt-2 border-t border-white/10 text-xs uppercase font-semibold text-purple-300">
                Administration
              </div>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
              >
                Admin Dashboard
              </NavLink>
              <NavLink
                to="/admin/create_shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
              >
                Create Shop
              </NavLink>
              <NavLink
                to="/admin/list_of_all_shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
              >
                View All Shops
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/20 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-white/10">
              <NavLink
                to="/admin_login"
                onClick={() => setMobileMenuOpen(false)}
                className="mall-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
