import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconsole";

const Home = () => {
  const [category, setCategory] = useState("");
  const [allShops, setAllShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [showOffers, setShowOffers] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryFilter = () => {
    if (!category) {
      alert("Please select a category");
      return;
    }

    setFilteredShops(allShops.filter((s) => s.shopType === category));
    setShowOffers(false);
  };

  const handleOfferProduct = () => {
    setShowOffers(true);
    setFilteredShops([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="glass-card p-6">
          <h1 className="text-3xl font-semibold">Mall Shop Explorer</h1>
          <p className="text-white/70 mt-1">
            Browse shops by category or explore ongoing offers
          </p>
        </div>

        {/* Filter Bar */}
        <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
          <select
            className="glass-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="tech">Technology</option>
            <option value="veg">Vegetable</option>
            <option value="fruit">Fruit</option>
            <option value="cyber">Cyber Cafe</option>
            <option value="chicken">Chicken Shop</option>
          </select>

          <button className="glass-button" onClick={handleCategoryFilter}>
            Filter Shops
          </button>

          <button
            className="glass-button-secondary"
            onClick={handleOfferProduct}
          >
            View All Offers
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 glass-card p-4 overflow-x-auto">

            {/* CATEGORY TABLE */}
            {filteredShops.length > 0 && (
              <table className="w-full text-sm">
                <thead className="text-white/70 border-b border-white/20">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Shop</th>
                    <th className="px-4 py-2">Owner</th>
                    <th className="px-4 py-2">No.</th>
                    <th className="px-4 py-2">Floor</th>
                    <th className="px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map((shop, index) => (
                    <tr
                      key={shop.id}
                      className="border-b border-white/10 hover:bg-white/10"
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">
                        {shop.shopName}
                      </td>
                      <td className="px-4 py-2">{shop.shopOwnerName}</td>
                      <td className="px-4 py-2">{shop.shopNumber}</td>
                      <td className="px-4 py-2">{shop.shopFloor}</td>
                      <td className="px-4 py-2">{shop.shopType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* OFFERS VIEW */}
            {showOffers && (
              <div className="space-y-4">
                {allShops.map((shop) => (
                  <div key={shop.id} className="glass-inner p-4">
                    <h3 className="text-lg font-semibold">
                      {shop.shopName}
                    </h3>
                    <p className="text-white/70">
                      Shop No: {shop.shopNumber}
                    </p>

                    {shop.shopOffer?.length > 0 ? (
                      <div className="mt-3 grid gap-3">
                        {shop.shopOffer.map((offer, idx) => (
                          <div key={idx} className="glass-sub-card">
                            <div className="font-medium">
                              {offer.offerName}
                            </div>
                            <div className="text-sm text-white/70">
                              {offer.offerDiscription}
                            </div>
                            <div className="text-sm">
                              Discount: {offer.offerDiscount}
                            </div>
                            <div className="text-sm">
                              ₹{offer.offerDiscountPrice}{" "}
                              <span className="line-through text-white/50">
                                ₹{offer.offerOriginalPrice}
                              </span>
                            </div>
                            <div className="text-xs text-white/60">
                              Valid till {offer.offerExpier}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-white/50 mt-2">
                        No offers available
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!filteredShops.length && !showOffers && (
              <div className="text-center text-white/60 py-10">
                Select a category or view offers
              </div>
            )}
          </div>

          {/* SIDE PANEL */}
          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <button
              className="glass-button w-full"
              onClick={handleOfferProduct}
            >
              Explore All Offers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
