import { useEffect, useRef, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getAllShops } from "../../services/mallStore";
import { CATEGORY_LABELS } from "../../services/dummyData";
import { DownloadTableExcel } from "react-export-table-to-excel";
import {
  Download,
  Tag,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminMallCategory = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const pageSize = 6;

  const fetchShops = async () => {
    setLoading(true);
    try {
      const shops = await getAllShops();
      setData(shops);
    } catch (err) {
      console.error("Category fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: data.length };
    Object.keys(CATEGORY_LABELS).forEach((k) => {
      if (k !== "all") {
        counts[k] = data.filter((s) => s.shopType === k).length;
      }
    });
    return counts;
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedCategory === "all") return data;
    return data.filter((item) => item.shopType === selectedCategory);
  }, [data, selectedCategory]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleCategoryChange = (catKey) => {
    setSelectedCategory(catKey);
    setCurrentPage(1);
  };

  return (
    <AdminLayout
      title="Category Retail Analytics"
      subtitle="Examine sector breakdown, store concentrations, and category distribution"
      onDataReset={fetchShops}
    >
      <div className="space-y-6">
        {/* Category Pills Strip */}
        <div className="glass-card p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/80">
              Browse Retail Sectors
            </span>
            <DownloadTableExcel
              filename={`supermall_category_${selectedCategory}`}
              sheet="CategoryStores"
              currentTableRef={tableRef.current}
            >
              <button
                disabled={filteredData.length === 0}
                className="glass-button-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Category Excel</span>
              </button>
            </DownloadTableExcel>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const count = categoryCounts[key] || 0;
              const isSelected = selectedCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/40 shadow-md shadow-purple-900/30"
                      : "bg-white/10 text-purple-200/80 hover:bg-white/15 hover:text-white border border-white/10"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Table */}
        <div className="glass-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-white text-base">
                {CATEGORY_LABELS[selectedCategory] || "Selected Category"}
              </h3>
              <p className="text-xs text-purple-200/60">
                {filteredData.length} total stores registered in this sector
              </p>
            </div>
            <span className="text-xs text-purple-300/80 font-mono">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-left text-sm">
              <thead className="border-b border-white/15 text-xs font-semibold text-purple-200/70 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Unit #</th>
                  <th className="py-3 px-3">Store Name</th>
                  <th className="py-3 px-3">Floor</th>
                  <th className="py-3 px-3">Owner Name</th>
                  <th className="py-3 px-3">Active Offers</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-purple-300">
                      #{item.shopNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {item.shopName}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-xs">
                        Floor {item.shopFloor}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-purple-100/90">
                      {item.shopOwnerName}
                    </td>
                    <td className="py-3 px-3">
                      {item.shopOffer?.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Tag className="w-3 h-3" />
                          {item.shopOffer.length} Offers
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
                        <span>View</span>
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && !loading && (
            <div className="py-12 text-center text-purple-200/60 text-sm">
              No stores found in this category.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-purple-200/60">
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="glass-button-secondary text-xs p-2 disabled:opacity-40"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="glass-button-secondary text-xs p-2 disabled:opacity-40"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMallCategory;
