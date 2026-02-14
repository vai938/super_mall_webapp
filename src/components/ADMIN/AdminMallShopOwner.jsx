import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";
import AdminNavigation from "./AdminNavigation";
import { NavLink } from "react-router-dom";
import { DownloadTableExcel } from "react-export-table-to-excel";

const AdminMallShopOwner = () => {
  const [floor, setFloor] = useState("");
  const [allShops, setAllShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const tableRef = useRef(null);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "shops"));
      const shops = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAllShops(shops);
    } catch (err) {
      console.error("Error fetching shops:", err);
      alert("Failed to load shop data");
    }
  };

  const handleSubmit = () => {
    if (!floor) {
      alert("Please select a floor");
      return;
    }

    const result = allShops.filter(
      (item) => Number(item.shopFloor) === Number(floor)
    );

    setFilteredShops(result);
    setShowTable(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white">
      <div className="grid grid-cols-11 min-h-screen">
        {/* Sidebar */}
        <div className="col-span-2 bg-white/10 backdrop-blur-xl border-r border-white/20">
          <AdminNavigation />
        </div>

        {/* Content */}
        <div className="col-span-9 p-8">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Floor-wise Shop Owners
            </h2>

            {/* Filter */}
            <div className="flex items-end gap-4 mb-6">
              <div>
                <label className="block mb-1 text-white/70">
                  Select Floor
                </label>
                <select
                  className="glass-input"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                >
                  <option value="">Choose floor</option>
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                  <option value="4">Floor 4</option>
                  <option value="5">Floor 5</option>
                </select>
              </div>

              <button
                className="glass-button h-[42px]"
                onClick={handleSubmit}
              >
                Show
              </button>
            </div>

            {/* Table */}
            {showTable && (
              <div className="relative overflow-x-auto">
                {filteredShops.length > 0 && (
                  <div className="flex justify-end mb-4">
                    <DownloadTableExcel
                      filename={`shop_owners_floor_${floor}`}
                      currentTableRef={tableRef.current}
                    >
                      <button className="glass-button">
                        Export Excel
                      </button>
                    </DownloadTableExcel>
                  </div>
                )}

                <table
                  ref={tableRef}
                  className="w-full text-sm text-left"
                >
                  <thead className="border-b border-white/20 text-white/70">
                    <tr>
                      <th className="py-3 px-4">S No.</th>
                      <th className="py-3 px-4">Shop Name</th>
                      <th className="py-3 px-4">Owner</th>
                      <th className="py-3 px-4">Shop No.</th>
                      <th className="py-3 px-4">Floor</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredShops.length > 0 ? (
                      filteredShops.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-white/10 hover:bg-white/10 transition"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{item.shopName}</td>
                          <td className="py-3 px-4 font-semibold">
                            {item.shopOwnerName}
                          </td>
                          <td className="py-3 px-4">{item.shopNumber}</td>
                          <td className="py-3 px-4">{item.shopFloor}</td>
                          <td className="py-3 px-4">{item.shopType}</td>
                          <td className="py-3 px-4">
                            <NavLink
                              to={`/admin/view/${item.id}`}
                              className="glass-button text-sm"
                            >
                              View
                            </NavLink>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-white/60"
                        >
                          No shop owners available on this floor
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMallShopOwner;
