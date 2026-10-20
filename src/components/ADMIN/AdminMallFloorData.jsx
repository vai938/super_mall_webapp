import { useEffect, useRef, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getAllShops } from "../../services/mallStore";
import { CATEGORY_LABELS } from "../../services/dummyData";
import { DownloadTableExcel } from "react-export-table-to-excel";
import {
  Layers,
  Download,
  Store,
  Tag,
  Eye,
  PlusCircle,
  Building2,
} from "lucide-react";

const AdminMallFloorData = () => {
  const [selectedFloor, setSelectedFloor] = useState("1");
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const data = await getAllShops();
      setAllShops(data);
    } catch (err) {
      console.error("Fetch shops error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const floorShops = useMemo(() => {
    return allShops.filter((item) => String(item.shopFloor) === String(selectedFloor));
  }, [allShops, selectedFloor]);

  const floorStats = useMemo(() => {
    const totalPromos = floorShops.reduce((acc, s) => acc + (s.shopOffer?.length || 0), 0);
    const categories = new Set(floorShops.map((s) => s.shopType)).size;
    return { totalPromos, categories };
  }, [floorShops]);

  return (
    <AdminLayout
      title="Floor-wise Store Directory"
      subtitle="Analyze retail density, tenant rosters, and occupancy floor by floor"
      onDataReset={fetchShops}
    >
      <div className="space-y-6">
        {/* Floor Selection Pills */}
        <div className="glass-card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/80 block mb-1">
                Select Floor Level
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((fl) => {
                  const count = allShops.filter((s) => Number(s.shopFloor) === fl).length;
                  const isSelected = String(fl) === String(selectedFloor);
                  return (
                    <button
                      key={fl}
                      onClick={() => setSelectedFloor(String(fl))}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/40 shadow-lg shadow-purple-900/40"
                          : "bg-white/10 text-purple-200/80 hover:bg-white/15 hover:text-white border border-white/10"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Floor {fl}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DownloadTableExcel
                filename={`supermall_floor_${selectedFloor}_stores`}
                sheet={`Floor ${selectedFloor}`}
                currentTableRef={tableRef.current}
              >
                <button
                  disabled={floorShops.length === 0}
                  className="glass-button-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Floor Data</span>
                </button>
              </DownloadTableExcel>

              <NavLink
                to={`/admin/create_shop?floor=${selectedFloor}`}
                className="glass-button text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Store to {selectedFloor}F</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Floor Quick Overview KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold font-mono">
              {selectedFloor}F
            </div>
            <div>
              <p className="text-xs text-purple-200/70">Floor {selectedFloor} Stores</p>
              <h4 className="text-xl font-bold text-white font-mono">{floorShops.length} Registered</h4>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200/70">Distinct Categories</p>
              <h4 className="text-xl font-bold text-white font-mono">{floorStats.categories} Sectors</h4>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200/70">Active Deals on Floor</p>
              <h4 className="text-xl font-bold text-white font-mono">{floorStats.totalPromos} Live Offers</h4>
            </div>
          </div>
        </div>

        {/* Table of stores on this floor */}
        <div className="glass-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-300" />
              <span>Stores on Floor Level {selectedFloor}</span>
            </h3>
            <span className="text-xs text-purple-200/60 font-mono">
              {floorShops.length} units occupied
            </span>
          </div>

          {floorShops.length > 0 ? (
            <div className="overflow-x-auto">
              <table ref={tableRef} className="w-full text-left text-sm">
                <thead className="border-b border-white/15 text-xs font-semibold text-purple-200/70 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Unit #</th>
                    <th className="py-3 px-3">Store Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Store Owner</th>
                    <th className="py-3 px-3">Promotions</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {floorShops.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-purple-300">
                        #{item.shopNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {item.shopName}
                      </td>
                      <td className="py-3 px-3 text-xs text-purple-200">
                        {CATEGORY_LABELS[item.shopType] || item.shopType}
                      </td>
                      <td className="py-3 px-3 text-xs text-purple-100/80">
                        {item.shopOwnerName}
                      </td>
                      <td className="py-3 px-3">
                        {item.shopOffer?.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Tag className="w-3 h-3" />
                            {item.shopOffer.length} Live
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">None</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <NavLink
                          to={`/admin/view/${item.id}`}
                          className="glass-button text-xs py-1.5 px-3 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Unit</span>
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-purple-200/60 space-y-3">
              <Layers className="w-8 h-8 mx-auto text-purple-300/40" />
              <p className="text-sm">
                {loading ? "Loading floor units..." : `No shops currently assigned to Floor ${selectedFloor}.`}
              </p>
              {!loading && (
                <NavLink
                  to={`/admin/create_shop?floor=${selectedFloor}`}
                  className="glass-button text-xs py-2 px-4 inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Onboard First Store on Floor {selectedFloor}</span>
                </NavLink>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMallFloorData;
