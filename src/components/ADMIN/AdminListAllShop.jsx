import { useEffect, useRef, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";
import { NavLink } from "react-router-dom";
import AdminNavigation from "./AdminNavigation";
import { DownloadTableExcel } from "react-export-table-to-excel";

const AdminListAllShop = () => {
  const [data, setData] = useState([]);
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
      alert("Failed to load shops");
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;

    try {
      await deleteDoc(doc(db, "shops", shopId));
      alert("Shop deleted successfully");
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete shop");
    }
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">All Shops</h2>

              <DownloadTableExcel
                filename="shops"
                currentTableRef={tableRef.current}
              >
                <button className="glass-button">
                  Export Excel
                </button>
              </DownloadTableExcel>
            </div>

            <div className="overflow-x-auto">
              <table
                ref={tableRef}
                className="w-full text-sm text-left"
              >
                <thead className="text-white/70 border-b border-white/20">
                  <tr>
                    <th className="py-3 px-4">S No.</th>
                    <th className="py-3 px-4">Shop Name</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Shop No.</th>
                    <th className="py-3 px-4">Floor</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/10 hover:bg-white/10 transition"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{item.shopName}</td>
                      <td className="py-3 px-4">{item.shopOwnerName}</td>
                      <td className="py-3 px-4">{item.shopNumber}</td>
                      <td className="py-3 px-4">{item.shopFloor}</td>
                      <td className="py-3 px-4">{item.shopType}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <NavLink
                          to={`/admin/view/${item.id}`}
                          className="glass-button text-sm"
                        >
                          View
                        </NavLink>
                        <button
                          onClick={() => handleDeleteShop(item.id)}
                          className="glass-button-danger text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data.length === 0 && (
                <div className="text-center py-6 text-white/60">
                  No shops found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListAllShop;
