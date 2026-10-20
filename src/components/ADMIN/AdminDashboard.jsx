import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getAllShops } from "../../services/mallStore";
import { CATEGORY_LABELS } from "../../services/dummyData";
import {
  Store,
  Tag,
  Layers,
  TrendingUp,
  PlusCircle,
  Eye,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const AdminDashboard = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const data = await getAllShops();
      setShops(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Floor-wise distribution
  const floorData = useMemo(() => {
    const floors = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    shops.forEach((shop) => {
      const floor = Number(shop.shopFloor);
      if (floors[floor]) {
        floors[floor].push(shop);
      }
    });
    return floors;
  }, [shops]);

  // Total active offers
  const totalOffers = useMemo(() => {
    return shops.reduce((acc, shop) => acc + (shop.shopOffer?.length || 0), 0);
  }, [shops]);

  // Category counts
  const categoryStats = useMemo(() => {
    const counts = {};
    shops.forEach((s) => {
      const cat = s.shopType || "other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [shops]);

  const topCategory = categoryStats[0]
    ? `${CATEGORY_LABELS[categoryStats[0][0]] || categoryStats[0][0]} (${categoryStats[0][1]})`
    : "None";

  const occupiedFloorsCount = Object.values(floorData).filter((f) => f.length > 0).length;

  return (
    <AdminLayout
      title="Mall Management Dashboard"
      subtitle="Real-time multi-floor retail occupancy, store registry, and promotional analytics"
      onDataReset={fetchShops}
    >
      <div className="space-y-6">
        {/* KPI Metric Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Stores */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-200/80 uppercase tracking-wider">
                Total Stores
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                {loading ? "..." : shops.length}
              </h3>
              <span className="text-xs text-emerald-400 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> Active
              </span>
            </div>
            <p className="text-xs text-purple-200/60 mt-1">Across 5 mall floors</p>
          </div>

          {/* Card 2: Active Offers */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-200/80 uppercase tracking-wider">
                Active Promotions
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                {loading ? "..." : totalOffers}
              </h3>
              <span className="text-xs text-amber-300 font-medium">Live Deals</span>
            </div>
            <p className="text-xs text-purple-200/60 mt-1">Discounts up to 50%</p>
          </div>

          {/* Card 3: Floor Occupancy */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-200/80 uppercase tracking-wider">
                Floor Occupancy
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                {occupiedFloorsCount} / 5
              </h3>
              <span className="text-xs text-emerald-400 font-medium">
                {Math.round((occupiedFloorsCount / 5) * 100)}%
              </span>
            </div>
            <p className="text-xs text-purple-200/60 mt-1">
              {5 - occupiedFloorsCount} vacant floors
            </p>
          </div>

          {/* Card 4: Top Category */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-200/80 uppercase tracking-wider">
                Leading Sector
              </span>
              <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h4 className="text-lg font-bold tracking-tight text-white truncate">
                {loading ? "..." : topCategory}
              </h4>
              <p className="text-xs text-purple-200/60 mt-1">Highest store concentration</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Quick Administrative Actions:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <NavLink to="/admin/create_shop" className="glass-button text-xs py-2 px-3.5">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Store</span>
            </NavLink>
            <NavLink to="/admin/list_of_all_shop" className="glass-button-secondary text-xs py-2 px-3.5">
              <Store className="w-4 h-4" />
              <span>View All Stores</span>
            </NavLink>
            <NavLink to="/" className="glass-button-secondary text-xs py-2 px-3.5">
              <Eye className="w-4 h-4" />
              <span>Preview Customer Mall View</span>
            </NavLink>
          </div>
        </div>

        {/* Floor-by-Floor Visual Distribution Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-300" />
              <span>Floor-by-Floor Retail Occupancy</span>
            </h3>
            <NavLink
              to="/admin/view/floor"
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Full Floor Breakdown</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((floorNum) => {
              const floorShops = floorData[floorNum] || [];
              const isOccupied = floorShops.length > 0;

              return (
                <div
                  key={floorNum}
                  className="glass-card p-5 flex flex-col justify-between border-t-2 border-t-purple-400/50"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold text-xs flex items-center justify-center font-mono">
                          {floorNum}F
                        </span>
                        <h4 className="font-semibold text-white text-sm">
                          Floor {floorNum}
                        </h4>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isOccupied
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                        }`}
                      >
                        {isOccupied ? `${floorShops.length} Stores` : "Empty Floor"}
                      </span>
                    </div>

                    {isOccupied ? (
                      <div className="space-y-2 mt-3">
                        {floorShops.map((shop) => (
                          <div
                            key={shop.id}
                            className="glass-inner p-2.5 flex items-center justify-between text-xs"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <span className="font-medium text-white truncate block">
                                #{shop.shopNumber} {shop.shopName}
                              </span>
                              <span className="text-[11px] text-purple-200/60 block truncate">
                                {shop.shopOwnerName} · {CATEGORY_LABELS[shop.shopType] || shop.shopType}
                              </span>
                            </div>
                            <NavLink
                              to={`/admin/view/${shop.id}`}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white shrink-0"
                              title="View Store"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </NavLink>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-purple-200/50">
                        No stores assigned to Floor {floorNum} yet.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                    <NavLink
                      to={`/admin/create_shop?floor=${floorNum}`}
                      className="text-xs text-purple-300 hover:text-white font-medium flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add store to Floor {floorNum}</span>
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Stores Table Overview */}
        <div className="glass-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-300" />
                <span>Store Directory Roster</span>
              </h3>
              <p className="text-xs text-purple-200/60">
                Latest stores onboarded into the Super Mall directory
              </p>
            </div>
            <NavLink to="/admin/list_of_all_shop" className="glass-button-secondary text-xs py-1.5 px-3">
              View All ({shops.length})
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/15 text-xs font-semibold text-purple-200/70 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Shop #</th>
                  <th className="py-3 px-3">Store Name</th>
                  <th className="py-3 px-3">Floor</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Owner</th>
                  <th className="py-3 px-3">Promotions</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {shops.slice(0, 6).map((shop) => (
                  <tr key={shop.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono text-purple-300 font-semibold">
                      #{shop.shopNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {shop.shopName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono">
                        Floor {shop.shopFloor}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-purple-200/90">
                      {CATEGORY_LABELS[shop.shopType] || shop.shopType}
                    </td>
                    <td className="py-3 px-3 text-xs text-purple-200/80">
                      {shop.shopOwnerName}
                    </td>
                    <td className="py-3 px-3">
                      {shop.shopOffer?.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Tag className="w-3 h-3" />
                          {shop.shopOffer.length} Offers
                        </span>
                      ) : (
                        <span className="text-xs text-white/40">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <NavLink
                          to={`/admin/view/${shop.id}`}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          title="View Store"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </NavLink>
                        <NavLink
                          to={`/admin/view/offer/${shop.id}`}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-xs font-medium text-purple-200 hover:text-white border border-purple-400/30 transition-colors"
                        >
                          Offers
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
