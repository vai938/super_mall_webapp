import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";

const AdminViewShopID = () => {
  const { id: shopId } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);

  const fetchShop = async () => {
    try {
      const shopRef = doc(db, "shops", shopId);
      const snapshot = await getDoc(shopRef);

      if (snapshot.exists()) {
        setData(snapshot.data());
      } else {
        alert("Shop not found");
        nav("/admin/list_of_all_shop");
      }
    } catch (err) {
      console.error("Error fetching shop:", err);
      alert("Failed to load shop data");
    }
  };

  const handleDeleteOffer = async (offerIndex) => {
    if (!data?.shopOffer) return;

    const updatedOffers = data.shopOffer.filter(
      (_, index) => index !== offerIndex
    );

    try {
      const shopRef = doc(db, "shops", shopId);
      await updateDoc(shopRef, { shopOffer: updatedOffers });
      setData({ ...data, shopOffer: updatedOffers });
      alert("Offer removed successfully");
    } catch (err) {
      console.error("Error deleting offer:", err);
      alert("Failed to delete offer");
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white p-8">
        Loading shop details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white p-8">
      <div className="max-w-6xl mx-auto glass-card p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Shop Details</h2>
          <button
            className="glass-button text-sm"
            onClick={() => nav("/admin/list_of_all_shop")}
          >
            Back
          </button>
        </div>

        {/* Shop Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 glass-card p-4 mb-8">
          <div><strong>Shop Name:</strong> {data.shopName}</div>
          <div><strong>Owner:</strong> {data.shopOwnerName}</div>
          <div><strong>Floor:</strong> {data.shopFloor}</div>
          <div><strong>Shop Number:</strong> {data.shopNumber}</div>
          <div><strong>Type:</strong> {data.shopType}</div>
        </div>

        {/* Offers */}
        <h3 className="text-xl font-semibold mb-4">Offers</h3>

        {data.shopOffer && data.shopOffer.length > 0 ? (
          <div className="grid gap-4">
            {data.shopOffer.map((item, index) => (
              <div
                key={index}
                className="glass-card p-4 grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <div><strong>Offer Name:</strong> {item.offerName}</div>
                <div><strong>Description:</strong> {item.offerDiscription}</div>
                <div><strong>Original Price:</strong> {item.offerOriginalPrice}</div>
                <div><strong>Discount:</strong> {item.offerDiscount}</div>
                <div><strong>Discount Price:</strong> {item.offerDiscountPrice}</div>
                <div><strong>Release Date:</strong> {item.offerReleaseDate}</div>
                <div><strong>Expire Date:</strong> {item.offerExpier}</div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    className="glass-button-danger text-sm"
                    onClick={() => handleDeleteOffer(index)}
                  >
                    Delete Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/60">No offer provided yet</div>
        )}

        {/* Action */}
        <div className="mt-8 flex justify-end">
          <NavLink
            to={`/admin/view/offer/${shopId}`}
            className="glass-button"
          >
            Add / Edit Offers
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminViewShopID;
