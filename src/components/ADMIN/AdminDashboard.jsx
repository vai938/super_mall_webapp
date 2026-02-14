import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";
import AdminNavigation from "./AdminNavigation";

/* Reusable glass card */
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/10 backdrop-blur-xl border border-white/20 
                shadow-xl rounded-2xl p-6 ${className}`}
  >
    {children}
  </div>
);

const AdminDashboard = () => {
  const [shops, setShops] = useState([]);

  /* Fetch shops from Firestore */
  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "shops"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShops(data);
    } catch (err) {
      console.error("Failed to fetch shops:", err);
      alert("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* Floor-wise derived data */
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white">
      <div className="grid grid-cols-11 min-h-screen">
        {/* Sidebar */}
        <div className="col-span-2 bg-white/10 backdrop-blur-xl border-r border-white/20">
          <AdminNavigation />
        </div>

        {/* Dashboard Content */}
        <div className="col-span-9 p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-white/60">
              Mall overview and floor-wise shop distribution
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <GlassCard>
              <p className="text-white/60">Total Shops</p>
              <h2 className="text-4xl font-bold mt-2">{shops.length}</h2>
            </GlassCard>

            <GlassCard>
              <p className="text-white/60">Floors</p>
              <h2 className="text-4xl font-bold mt-2">5</h2>
            </GlassCard>

            <GlassCard>
              <p className="text-white/60">Occupied Floors</p>
              <h2 className="text-4xl font-bold mt-2">
                {Object.values(floorData).filter(f => f.length > 0).length}
              </h2>
            </GlassCard>

            <GlassCard>
              <p className="text-white/60">Empty Floors</p>
              <h2 className="text-4xl font-bold mt-2">
                {5 - Object.values(floorData).filter(f => f.length > 0).length}
              </h2>
            </GlassCard>
          </div>

          {/* Floor-wise Shops */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(floorData).map(([floor, items]) => (
              <GlassCard key={floor}>
                <h3 className="text-lg font-semibold mb-3">
                  Floor {floor}
                </h3>

                {items.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {items.map((shop) => (
                      <span
                        key={shop.id}
                        className="px-3 py-1 rounded-xl bg-white/20 text-sm"
                      >
                        Shop {shop.shopNumber}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50">No shops on this floor</p>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
