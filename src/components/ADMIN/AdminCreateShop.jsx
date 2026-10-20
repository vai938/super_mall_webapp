import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { createShop, updateShop, getShopById } from "../../services/mallStore";
import { CATEGORY_LABELS } from "../../services/dummyData";
import { Store, PlusCircle, ArrowLeft, CheckCircle2, Save } from "lucide-react";

const AdminCreateShop = ({ isEdit = false }) => {
  const { id: editId } = useParams();
  const [searchParams] = useSearchParams();
  const initialFloor = searchParams.get("floor") || "";

  const [inputField, setInputField] = useState({
    shopNumber: "",
    shopName: "",
    shopFloor: initialFloor,
    shopOwnerName: "",
    ownerOccupation: "",
    shopType: "",
    contactPhone: "",
    email: "",
    instagramId: "",
    description: "",
  });

  const [error, setError] = useState({});
  const [loadingShop, setLoadingShop] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && editId) {
      const loadShop = async () => {
        setLoadingShop(true);
        const shop = await getShopById(editId);
        if (shop) {
          setInputField({
            shopNumber: shop.shopNumber || "",
            shopName: shop.shopName || "",
            shopFloor: shop.shopFloor || "",
            shopOwnerName: shop.shopOwnerName || "",
            ownerOccupation: shop.ownerOccupation || "",
            shopType: shop.shopType || "",
            contactPhone: shop.contactPhone || "",
            email: shop.email || "",
            instagramId: shop.instagramId || "",
            description: shop.description || "",
          });
        }
        setLoadingShop(false);
      };
      loadShop();
    } else if (initialFloor) {
      setInputField((prev) => ({ ...prev, shopFloor: initialFloor }));
    }
  }, [isEdit, editId, initialFloor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};

    const shopNum = Number(inputField.shopNumber);
    if (!inputField.shopNumber || isNaN(shopNum) || shopNum <= 0) {
      err.shopNumber = "Please enter a valid positive unit number";
    } else if (shopNum > 500) {
      err.shopNumber = "Shop number cannot exceed 500";
    }

    if (!inputField.shopName.trim()) err.shopName = "Store name is required";

    const floorNum = Number(inputField.shopFloor);
    if (!inputField.shopFloor || isNaN(floorNum) || floorNum < 1 || floorNum > 5) {
      err.shopFloor = "Please select a floor between 1 and 5";
    }

    if (!inputField.shopOwnerName.trim()) err.shopOwnerName = "Owner name is required";
    if (!inputField.shopType) err.shopType = "Please select a category";

    if (Object.keys(err).length > 0) {
      setError(err);
      return;
    }
    setError({});
    setSubmitting(true);

    try {
      const payload = {
        shopNumber: Number(inputField.shopNumber),
        shopName: inputField.shopName.trim(),
        shopFloor: Number(inputField.shopFloor),
        shopOwnerName: inputField.shopOwnerName.trim(),
        ownerOccupation: inputField.ownerOccupation.trim() || "Retail Merchant",
        shopType: inputField.shopType,
        contactPhone: inputField.contactPhone.trim() || "+91 98000 00000",
        email: inputField.email.trim() || `store${inputField.shopNumber}@vistasquare.com`,
        instagramId: inputField.instagramId.trim() || "@vistasquare_mall",
        description: inputField.description.trim() || `Official retail unit for ${inputField.shopName}.`,
      };

      if (isEdit && editId) {
        await updateShop(editId, payload);
      } else {
        await createShop({
          ...payload,
          shopOffer: [],
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/list_of_all_shop");
      }, 900);
    } catch (err) {
      console.error("Save shop error:", err);
      alert("Failed to save shop. Please verify details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title={isEdit ? "Update Store Profile" : "Create New Store"}
      subtitle={
        isEdit
          ? "Modify tenant details, assigned unit, and contact information"
          : "Onboard a new retail tenant into Vista Square Super Mall"
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {success && (
          <div className="mall-card p-4 bg-emerald-500/20 border-emerald-500/40 text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="font-semibold text-sm">
              {isEdit ? "Store successfully updated!" : "Store successfully registered!"} Returning to directory...
            </span>
          </div>
        )}

        <div className="mall-card p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-700 flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isEdit ? "Edit Retail Tenant Specifications" : "New Tenant Registration Form"}
                </h3>
                <p className="text-xs text-purple-200/70">
                  {isEdit ? "Update fields and save changes" : "Fill in store information and lease details"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/list_of_all_shop")}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Stores</span>
            </button>
          </div>

          {loadingShop ? (
            <div className="py-12 text-center text-purple-200/70 text-sm">
              Loading store details for editing...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shop Number */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Unit / Shop Number *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 101 or 302"
                    className="mall-input"
                    value={inputField.shopNumber}
                    onChange={(e) => setInputField({ ...inputField, shopNumber: e.target.value })}
                  />
                  {error.shopNumber && (
                    <p className="text-rose-300 text-xs mt-1">{error.shopNumber}</p>
                  )}
                </div>

                {/* Shop Name */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Store / Brand Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Electronics, The Royal Rooster"
                    className="mall-input"
                    value={inputField.shopName}
                    onChange={(e) => setInputField({ ...inputField, shopName: e.target.value })}
                  />
                  {error.shopName && (
                    <p className="text-rose-300 text-xs mt-1">{error.shopName}</p>
                  )}
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Floor Level (1 - 5) *
                  </label>
                  <select
                    className="mall-input"
                    value={inputField.shopFloor}
                    onChange={(e) => setInputField({ ...inputField, shopFloor: e.target.value })}
                  >
                    <option value="">Select Level</option>
                    <option value="1">Floor 1 — Ground & Anchor Stores</option>
                    <option value="2">Floor 2 — Fashion & Lifestyle</option>
                    <option value="3">Floor 3 — Food Court & Chicken</option>
                    <option value="4">Floor 4 — Tech Care & Couture</option>
                    <option value="5">Floor 5 — Entertainment & Rooftop</option>
                  </select>
                  {error.shopFloor && (
                    <p className="text-rose-300 text-xs mt-1">{error.shopFloor}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Retail Category *
                  </label>
                  <select
                    className="mall-input"
                    value={inputField.shopType}
                    onChange={(e) => setInputField({ ...inputField, shopType: e.target.value })}
                  >
                    <option value="">Select Business Sector</option>
                    {Object.entries(CATEGORY_LABELS).map(([k, label]) => {
                      if (k === "all") return null;
                      return (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  {error.shopType && (
                    <p className="text-rose-300 text-xs mt-1">{error.shopType}</p>
                  )}
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Store Owner / Tenant Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma"
                    className="mall-input"
                    value={inputField.shopOwnerName}
                    onChange={(e) => setInputField({ ...inputField, shopOwnerName: e.target.value })}
                  />
                  {error.shopOwnerName && (
                    <p className="text-rose-300 text-xs mt-1">{error.shopOwnerName}</p>
                  )}
                </div>

                {/* Owner Occupation (From Unified Mentor Diagram) */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Owner Occupation / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Retail Specialist, Executive Chef"
                    className="mall-input"
                    value={inputField.ownerOccupation}
                    onChange={(e) => setInputField({ ...inputField, ownerOccupation: e.target.value })}
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Mobile / Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    className="mall-input"
                    value={inputField.contactPhone}
                    onChange={(e) => setInputField({ ...inputField, contactPhone: e.target.value })}
                  />
                </div>

                {/* Email (From Unified Mentor Diagram) */}
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Store Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="store@vistasquare.com"
                    className="mall-input"
                    value={inputField.email}
                    onChange={(e) => setInputField({ ...inputField, email: e.target.value })}
                  />
                </div>

                {/* Instagram ID (From Unified Mentor Diagram) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Social Handle / Instagram ID
                  </label>
                  <input
                    type="text"
                    placeholder="@store_brand_mall"
                    className="mall-input"
                    value={inputField.instagramId}
                    onChange={(e) => setInputField({ ...inputField, instagramId: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Store Description & Offerings
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe merchandise, special services, operating hours..."
                  className="mall-input resize-none"
                  value={inputField.description}
                  onChange={(e) => setInputField({ ...inputField, description: e.target.value })}
                />
              </div>

              {/* Submit / Cancel */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/list_of_all_shop")}
                  className="mall-btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mall-btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {isEdit ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  <span>
                    {submitting
                      ? "Saving..."
                      : isEdit
                      ? "Update Store Details"
                      : "Create & Register Store"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateShop;
