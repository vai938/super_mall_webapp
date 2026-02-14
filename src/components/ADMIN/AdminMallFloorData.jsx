import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";
import AdminNavigation from "./AdminNavigation";
import { DownloadTableExcel } from "react-export-table-to-excel";

const AdminMallFloorData = () => {
  const [floorNumber, setFloorNumber] = useState("");
  const [allShops, setAllShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [message, setMessage] = useState(false);
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

  const handleShowFloor = () => {
    if (!floorNumber) {
      alert("Please enter a floor number");
      return;
    }

    const floorWiseData = allShops.filter(
      (item) => Number(item.shopFloor) === Number(floorNumber)
    );

    setFilteredShops(floorWiseData);
    setShowTable(floorWiseData.length > 0);
    setMessage(floorWiseData.length === 0);
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
              Floor-wise Shop Data
            </h2>

            {/* Filter */}
            <div className="flex items-end gap-4 mb-6">
              <div>
                <label className="block mb-1 text-white/70">
                  Floor Number
                </label>
                <input
                  type="number"
                  className="glass-input"
                  placeholder="Enter floor number"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                />
              </div>

              <button
                className="glass-button h-[42px]"
                onClick={handleShowFloor}
              >
                Show
              </button>
            </div>

            {/* Table */}
            {showTable && (
              <div className="relative overflow-x-auto">
                <div className="flex justify-end mb-4">
                  <DownloadTableExcel
                    filename={`shops_floor_${floorNumber}`}
                    currentTableRef={tableRef.current}
                  >
                    <button className="glass-button">
                      Export Excel
                    </button>
                  </DownloadTableExcel>
                </div>

                <table
                  ref={tableRef}
                  className="w-full text-sm text-left"
                >
                  <thead className="border-b border-white/20 text-white/70">
                    <tr>
                      <th className="py-3 px-4">Shop Name</th>
                      <th className="py-3 px-4">Owner</th>
                      <th className="py-3 px-4">Shop No.</th>
                      <th className="py-3 px-4">Floor</th>
                      <th className="py-3 px-4">Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredShops.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="py-3 px-4">{item.shopName}</td>
                        <td className="py-3 px-4">{item.shopOwnerName}</td>
                        <td className="py-3 px-4">{item.shopNumber}</td>
                        <td className="py-3 px-4">{item.shopFloor}</td>
                        <td className="py-3 px-4">{item.shopType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty Message */}
            {message && (
              <div className="mt-6 text-red-300 font-medium">
                No shop exists on floor {floorNumber}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMallFloorData;
