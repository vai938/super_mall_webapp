import { useEffect, useRef, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getAllShops } from "../../services/mallStore";
import { CATEGORY_LABELS } from "../../services/dummyData";
import { DownloadTableExcel } from "react-export-table-to-excel";
import {
  Users,
  Search,
  Download,
  Eye,
} from "lucide-react";

const AdminMallShopOwner = () => {
  const [data, setData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const shops = await getAllShops();
      setData(shops);
    } catch (err) {
      console.error("Owner fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredOwners = useMemo(() => {
    return data.filter((item) => {
      const matchesFloor =
        selectedFloor === "all" || String(item.shopFloor) === String(selectedFloor);
      const matchesSearch =
        !ownerSearch ||
        item.shopOwnerName?.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        item.shopName?.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        item.contactPhone?.includes(ownerSearch);
      return matchesFloor && matchesSearch;
    });
  }, [data, selectedFloor, ownerSearch]);

  return (
    <AdminLayout
      title="Store Owners & Tenant Registry"
      subtitle="Directory of business owners, contact lines, and leased mall retail spaces"
      onDataReset={fetchShops}
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="glass-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/60" />
              <input
                type="text"
                placeholder="Search owner name, phone, or store..."
                className="glass-input pl-9 text-xs sm:text-sm"
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
              />
            </div>

            {/* Floor filter */}
            <select
              className="glass-input text-xs sm:text-sm"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="all">All Floors (1 - 5)</option>
              <option value="1">Floor 1 Owners</option>
              <option value="2">Floor 2 Owners</option>
              <option value="3">Floor 3 Owners</option>
              <option value="4">Floor 4 Owners</option>
              <option value="5">Floor 5 Owners</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <DownloadTableExcel
              filename="supermall_tenants_registry"
              sheet="Tenants"
              currentTableRef={tableRef.current}
            >
              <button className="glass-button-secondary text-xs py-2 px-3.5 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Export Tenant List</span>
              </button>
            </DownloadTableExcel>
          </div>
        </div>

        {/* Tenant Table / Cards */}
        <div className="glass-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-300" />
                <span>Registered Tenant Registry</span>
              </h3>
              <p className="text-xs text-purple-200/60">
                {filteredOwners.length} store owners listed
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-left text-sm">
              <thead className="border-b border-white/15 text-xs font-semibold text-purple-200/70 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Owner / Tenant</th>
                  <th className="py-3 px-3">Store Name</th>
                  <th className="py-3 px-3">Unit #</th>
                  <th className="py-3 px-3">Floor</th>
                  <th className="py-3 px-3">Sector</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredOwners.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-white/50">{index + 1}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      {item.shopOwnerName}
                    </td>
                    <td className="py-3 px-3 font-medium text-purple-100">
                      {item.shopName}
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-300">
                      #{item.shopNumber}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-white/10">
                        Floor {item.shopFloor}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-purple-200">
                      {CATEGORY_LABELS[item.shopType] || item.shopType}
                    </td>
                    <td className="py-3 px-3 text-xs font-mono text-purple-200/90">
                      {item.contactPhone || "+91 98000 00000"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <NavLink
                        to={`/admin/view/${item.id}`}
                        className="glass-button text-xs py-1.5 px-3 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOwners.length === 0 && !loading && (
            <div className="py-12 text-center text-purple-200/60 text-sm">
              No store owners found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMallShopOwner;
