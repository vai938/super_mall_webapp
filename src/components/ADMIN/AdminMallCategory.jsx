import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";
import AdminNavigation from "./AdminNavigation";
import { DownloadTableExcel } from "react-export-table-to-excel";

const AdminMallCategory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState("");
  const [initial, setInitial] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const tableRef = useRef(null);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "shops"));
      const shops = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setData(shops);
    } catch (err) {
      console.error("Error fetching shops:", err);
      alert("Failed to load shop data");
    }
  };

  const handleFilter = () => {
    if (!category) {
      alert("Please select a category");
      return;
    }

    const result = data.filter((item) => item.shopType === category);
    setFilteredData(result);
    setInitial(0);
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
              Category-wise Shops
            </h2>

            {/* Filter */}
            <div className="flex items-end gap-4 mb-6">
              <div>
                <label className="block mb-1 text-white/70">
                  Select Category
                </label>
                <select
                  className="glass-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Choose category</option>
                  <option value="tech">Technology</option>
                  <option value="veg">Vegetable</option>
                  <option value="fruit">Fruit</option>
                  <option value="cyber">Cyber Cafe</option>
                  <option value="chicken">Chicken Shop</option>
                </select>
              </div>

              <button
                className="glass-button h-[42px]"
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>

            {/* Table */}
            {showTable && (
              <div className="relative overflow-x-auto">
                {filteredData.length > 0 && (
                  <div className="flex justify-end mb-4">
                    <DownloadTableExcel
                      filename="shops_by_category"
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
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData
                        .slice(initial, initial + 5)
                        .map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-b border-white/10 hover:bg-white/10 transition"
                          >
                            <td className="py-3 px-4">
                              {initial + index + 1}
                            </td>
                            <td className="py-3 px-4">{item.shopName}</td>
                            <td className="py-3 px-4">
                              {item.shopOwnerName}
                            </td>
                            <td className="py-3 px-4">{item.shopNumber}</td>
                            <td className="py-3 px-4">{item.shopFloor}</td>
                            <td className="py-3 px-4">{item.shopType}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-white/60"
                        >
                          No shops found in this category
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-end gap-3 mt-6">
                  {initial > 0 && (
                    <button
                      className="glass-button text-sm"
                      onClick={() => setInitial(initial - 5)}
                    >
                      Previous
                    </button>
                  )}
                  {initial + 5 < filteredData.length && (
                    <button
                      className="glass-button text-sm"
                      onClick={() => setInitial(initial + 5)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMallCategory;
