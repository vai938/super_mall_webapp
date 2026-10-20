import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getShopById, updateShop } from "../../services/mallStore";
import {
  PlusCircle,
  Trash2,
  ArrowLeft,
  Save,
  CheckCircle2,
  Percent,
} from "lucide-react";

const emptyOffer = () => ({
  offerName: "",
  offerDiscription: "",
  offerReleaseDate: new Date().toISOString().split("T")[0],
  offerDiscount: "",
  offerExpier: "",
  offerOriginalPrice: "",
  offerDiscountPrice: "",
});

const AdminShopOffer = () => {
  const { id: shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [inputFields, setInputFields] = useState([emptyOffer()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchShopOffers = async () => {
      setLoading(true);
      try {
        const data = await getShopById(shopId);
        if (data) {
          setShop(data);
          if (data.shopOffer && data.shopOffer.length > 0) {
            setInputFields(data.shopOffer);
          }
        } else {
          alert("Store not found");
          navigate("/admin/list_of_all_shop");
        }
      } catch (err) {
        console.error("Error fetching shop offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopOffers();
  }, [shopId, navigate]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updated = [...inputFields];
    updated[index][name] = value;

    // Auto calculate discount percentage if original and discount price are provided
    if (name === "offerOriginalPrice" || name === "offerDiscountPrice") {
      const orig = Number(name === "offerOriginalPrice" ? value : updated[index].offerOriginalPrice);
      const disc = Number(name === "offerDiscountPrice" ? value : updated[index].offerDiscountPrice);
      if (orig > 0 && disc > 0 && orig > disc) {
        const pct = Math.round(((orig - disc) / orig) * 100);
        updated[index].offerDiscount = `${pct}%`;
      }
    }

    setInputFields(updated);
  };

  const handleAddField = () => {
    setInputFields([...inputFields, emptyOffer()]);
  };

  const handleRemoveField = (index) => {
    if (inputFields.length === 1) {
      setInputFields([emptyOffer()]);
      return;
    }
    const updated = inputFields.filter((_, i) => i !== index);
    setInputFields(updated);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    // Filter out completely blank offer rows
    const cleanedOffers = inputFields.filter(
      (o) => o.offerName.trim() || o.offerDiscountPrice || o.offerDiscription.trim()
    );

    try {
      await updateShop(shop.id, {
        shopOffer: cleanedOffers,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        navigate(`/admin/view/${shop.id}`);
      }, 900);
    } catch (err) {
      console.error("Error updating offers:", err);
      alert("Failed to update offers. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !shop) {
    return (
      <AdminLayout title="Loading Offer Editor...">
        <div className="py-20 text-center text-purple-200/70">
          Loading store promotional data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Manage Offers: ${shop.shopName}`}
      subtitle={`Unit #${shop.shopNumber} · Floor ${shop.shopFloor}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back and Toolbar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/admin/view/${shop.id}`)}
            className="glass-button-secondary text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store Details</span>
          </button>

          <button
            onClick={handleAddField}
            className="glass-button-secondary text-xs py-2 px-3.5 flex items-center gap-2 text-purple-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-300" />
            <span>Add Another Offer</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="glass-card p-4 bg-emerald-500/20 border-emerald-500/40 text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="font-semibold text-sm">
              Promotions successfully saved! Returning to store profile...
            </span>
          </div>
        )}

        {/* Offer Cards Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {inputFields.map((offer, index) => (
            <div key={index} className="glass-card p-5 sm:p-6 space-y-4 relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center font-mono">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-white text-sm">
                    {offer.offerName || `Promotional Offer #${index + 1}`}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="text-rose-300 hover:text-white p-1 rounded-lg hover:bg-rose-500/20 text-xs flex items-center gap-1 transition-colors"
                  title="Remove this offer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Offer Name */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-purple-200/90 mb-1">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    name="offerName"
                    placeholder="e.g. Festive Diwali Mega Discount 25%"
                    className="glass-input text-xs sm:text-sm"
                    value={offer.offerName}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>

                {/* Discount Tag */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200/90 mb-1">
                    Discount Badge
                  </label>
                  <div className="relative">
                    <Percent className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/60" />
                    <input
                      type="text"
                      name="offerDiscount"
                      placeholder="e.g. 25% OFF, BOGO"
                      className="glass-input pl-8 text-xs sm:text-sm"
                      value={offer.offerDiscount}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-3">
                  <label className="block text-xs font-semibold text-purple-200/90 mb-1">
                    Offer Description / Terms
                  </label>
                  <textarea
                    rows={2}
                    name="offerDiscription"
                    placeholder="Provide details on included items, applicable conditions, or minimum purchase..."
                    className="glass-input text-xs sm:text-sm resize-none"
                    value={offer.offerDiscription}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200/90 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="offerOriginalPrice"
                    placeholder="e.g. 2999"
                    className="glass-input text-xs sm:text-sm"
                    value={offer.offerOriginalPrice}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>

                {/* Discounted Price */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200/90 mb-1">
                    Discounted / Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="offerDiscountPrice"
                    placeholder="e.g. 1999"
                    className="glass-input text-xs sm:text-sm"
                    value={offer.offerDiscountPrice}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200/90 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="offerExpier"
                    className="glass-input text-xs sm:text-sm"
                    value={offer.offerExpier}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Action Row */}
          <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleAddField}
              className="glass-button-secondary w-full sm:w-auto text-xs py-2.5 px-4 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-purple-300" />
              <span>Add Another Offer</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="glass-button w-full sm:w-auto text-xs py-2.5 px-6 flex items-center justify-center gap-2 font-bold"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Promotions..." : "Save All Promotions"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminShopOffer;
