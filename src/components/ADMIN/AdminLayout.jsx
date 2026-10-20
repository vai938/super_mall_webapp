import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminNavigation from "./AdminNavigation";
import { isAuthenticated } from "../../services/authStore";
import { ChevronRight } from "lucide-react";

const PAGE_TITLES = {
  "/admin": { title: "Mall Overview & Analytics", section: "Dashboard" },
  "/admin/create_shop": { title: "Create New Store", section: "Store Management" },
  "/admin/list_of_all_shop": { title: "All Stores Directory", section: "Store Management" },
  "/admin/view/floor": { title: "Floor-wise Store Breakdown", section: "Analytics" },
  "/admin/view/category": { title: "Category Distribution", section: "Analytics" },
  "/admin/view/shop_owner": { title: "Store Owners Registry", section: "Directory" },
};

const AdminLayout = ({ children, title, subtitle, onDataReset }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin_login", { replace: true, state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: title || "Store Administration",
    section: "Admin",
  };

  return (
    <div className="min-h-screen text-white flex flex-col lg:flex-row">
      {/* Sidebar container */}
      <aside className="w-full lg:w-72 shrink-0 bg-slate-950/70 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/10 lg:min-h-screen lg:sticky lg:top-16 z-30">
        <AdminNavigation onDataReset={onDataReset} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Top contextual breadcrumbs & header */}
        <div className="mb-6 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-purple-300/70 mb-1">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span>{pageInfo.section}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium">{title || pageInfo.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title || pageInfo.title}
            </h1>
            {subtitle && <p className="text-sm text-purple-200/70 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
        </div>

        {/* Dynamic page content */}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
