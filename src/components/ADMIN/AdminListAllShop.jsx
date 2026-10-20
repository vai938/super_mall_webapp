import { useEffect, useRef, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getAllShops, deleteShop } from "../../services/mallStore";
import { CATEGORY_LABELS } from "../../services/dummyData";
import { DownloadTableExcel } from "react-export-table-to-excel";
import {
  Search,
  Download,
  PlusCircle,
  Eye,
  Trash2,
  Tag,
  Edit2,
} from "lucide-react";

const AdminListAllShop = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const shops = await getAllShops();
      setData(shops);
    } catch (err) {
      console.error("Error fetching shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleDeleteShop = async (shopId, shopName) => {
    if (window.confirm(`Are you sure you want to delete store "${shopName}"?`)) {
      try {
        await deleteShop(shopId);
        setData((prev) => prev.filter((s) => s.id !== shopId));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete shop.");
      }
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((shop) => {
      const matchesSearch =
        !searchQuery ||
        shop.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.shopOwnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(shop.shopNumber).includes(searchQuery);

      const matchesCategory = !categoryFilter || shop.shopType === categoryFilter;
      const matchesFloor = !floorFilter || String(shop.shopFloor) === String(floorFilter);

      return matchesSearch && matchesCategory && matchesFloor;
    });
  }, [data, searchQuery, categoryFilter, floorFilter]);

  return (
    <AdminLayout
      title="All Stores Directory"
      subtitle="Complete database roster of all mall retail shops, tenants, and units"
      onDataReset={fetchShops}
    >
      <div className="space-y-6">
        {/* Controls Toolbar: Search & Filters */}
        <div className="glass-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/60" />
              <input
                type="text"
                placeholder="Search shop, owner, #..."
                className="glass-input pl-9 text-xs sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <select
              className="glass-input text-xs sm:text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => {
                if (val === "all") return null;
                return (
                  <option key={val} value={val}>
                    {label}
                  </option>
                );
              })}
            </select>

            {/* Floor filter */}
            <select
              className="glass-input text-xs sm:text-sm"
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
            >
              <option value="">All Floors (1 - 5)</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
              <option value="5">Floor 5</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <DownloadTableExcel
              filename="supermall_stores_roster"
              sheet="Stores"
              currentTableRef={tableRef.current}
            >
              <button className="glass-button-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
            </DownloadTableExcel>

            <NavLink to="/admin/create_shop" className="glass-button text-xs py-2 px-3.5 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Shop</span>
            </NavLink>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-purple-200/70 px-1">
          <span>
            Showing <strong className="text-white font-mono">{filteredData.length}</strong> of{" "}
            <strong className="text-white font-mono">{data.length}</strong> registered stores
          </span>
          {(searchQuery || categoryFilter || floorFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                setFloorFilter("");
              }}
              className="text-purple-300 hover:text-white underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block glass-card p-5 overflow-x-auto">
          <table ref={tableRef} className="w-full text-left text-sm">
            <thead className="border-b border-white/15 text-xs font-semibold text-purple-200/70 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Shop #</th>
                <th className="py-3 px-3">Store Name</th>
                <th className="py-3 px-3">Owner / Contact</th>
                <th className="py-3 px-3">Floor</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Offers</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 text-xs text-white/50 font-mono">{index + 1}</td>
                  <td className="py-3 px-3 font-mono font-bold text-purple-300">
                    #{item.shopNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {item.shopName}
                  </td>
                  <td className="py-3 px-3 text-xs text-purple-100/90">
                    <div>{item.shopOwnerName}</div>
                    {item.contactPhone && (
                      <div className="text-[11px] text-purple-300/70">{item.contactPhone}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-xs">
                      Floor {item.shopFloor}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs">
                    <span className="text-purple-200">
                      {CATEGORY_LABELS[item.shopType] || item.shopType}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {item.shopOffer?.length > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Tag className="w-3 h-3" />
                        {item.shopOffer.length} Live
                      </span>
                    ) : (
                      <span className="text-xs text-white/40">None</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <NavLink
                        to={`/admin/view/${item.id}`}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </NavLink>
                      <NavLink
                        to={`/admin/edit/${item.id}`}
                        className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white border border-indigo-400/30 transition-colors"
                        title="Update / Edit Store"
                      >
                        <Edit2 className="w-4 h-4" />
                      </NavLink>
                      <NavLink
                        to={`/admin/view/offer/${item.id}`}
                        className="px-2 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-xs font-medium text-purple-200 hover:text-white border border-purple-400/30"
                        title="Manage Offers"
                      >
                        Offers
                      </NavLink>
                      <button
                        onClick={() => handleDeleteShop(item.id, item.shopName)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white border border-rose-500/30 transition-colors"
                        title="Delete Store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && !loading && (
            <div className="py-12 text-center text-purple-200/60 text-sm">
              No shops match your criteria.
            </div>
          )}
        </div>

        {/* Mobile Cards View (Visible on phones) */}
        <div className="sm:hidden space-y-3">
          {filteredData.map((item) => (
            <div key={item.id} className="glass-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    Unit #{item.shopNumber}
                  </span>
                  <h4 className="font-semibold text-white text-base">
                    {item.shopName}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/15 text-xs font-mono font-semibold">
                  Floor {item.shopFloor}
                </span>
              </div>

              <div className="text-xs text-purple-200/80 space-y-1">
                <p><strong>Owner:</strong> {item.shopOwnerName}</p>
                <p><strong>Category:</strong> {CATEGORY_LABELS[item.shopType] || item.shopType}</p>
                {item.contactPhone && <p><strong>Contact:</strong> {item.contactPhone}</p>}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  {item.shopOffer?.length > 0 ? (
                    <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.shopOffer.length} Offers
                    </span>
                  ) : (
                    <span className="text-xs text-white/40">No active offers</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <NavLink
                    to={`/admin/view/${item.id}`}
                    className="p-1.5 rounded-lg bg-white/10 text-white"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </NavLink>
                  <NavLink
                    to={`/admin/edit/${item.id}`}
                    className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-200 border border-indigo-400/30"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </NavLink>
                  <NavLink
                    to={`/admin/view/offer/${item.id}`}
                    className="px-2.5 py-1 rounded-lg bg-purple-600/30 text-xs font-medium text-purple-200 border border-purple-400/30"
                  >
                    Offers
                  </NavLink>
                  <button
                    onClick={() => handleDeleteShop(item.id, item.shopName)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && !loading && (
            <div className="glass-card p-8 text-center text-purple-200/60 text-sm">
              No shops match your criteria.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminListAllShop;
