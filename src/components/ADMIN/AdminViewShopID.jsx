import { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getShopById, updateShop } from "../../services/mallStore";
import { CATEGORY_LABELS } from "../../services/dummyData";
import {
  Store,
  Tag,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Trash2,
  PlusCircle,
  FileText,
  Edit2,
  Mail,
  Share2,
} from "lucide-react";

const AdminViewShopID = () => {
  const { id: shopId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShop = useCallback(async () => {
    setLoading(true);
    try {
      const shop = await getShopById(shopId);
      if (shop) {
        setData(shop);
      } else {
        alert("Store not found in mall database.");
        navigate("/admin/list_of_all_shop");
      }
    } catch (err) {
      console.error("Fetch shop error:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, navigate]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  const handleDeleteOffer = async (offerIndex) => {
    if (!data?.shopOffer) return;
    if (!window.confirm("Are you sure you want to remove this promotional offer?")) return;

    const updatedOffers = data.shopOffer.filter((_, idx) => idx !== offerIndex);
    try {
      await updateShop(data.id, { shopOffer: updatedOffers });
      setData({ ...data, shopOffer: updatedOffers });
    } catch (err) {
      console.error("Delete offer error:", err);
      alert("Failed to delete offer.");
    }
  };

  if (loading || !data) {
    return (
      <AdminLayout title="Loading Store Details...">
        <div className="py-20 text-center text-purple-200/70">
          Fetching store profile...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Store #${data.shopNumber}: ${data.shopName}`}
      subtitle={`Floor ${data.shopFloor} · ${CATEGORY_LABELS[data.shopType] || data.shopType}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back and Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate("/admin/list_of_all_shop")}
            className="mall-btn-secondary text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Stores</span>
          </button>

          <div className="flex items-center gap-2">
            <NavLink
              to={`/admin/edit/${data.id}`}
              className="mall-btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-purple-300" />
              <span>Update Store Details</span>
            </NavLink>

            <NavLink
              to={`/admin/view/offer/${data.id}`}
              className="mall-btn-primary text-xs py-2 px-4 flex items-center gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Manage Offers</span>
            </NavLink>
          </div>
        </div>

        {/* Store Profile Card */}
        <div className="mall-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-700 flex items-center justify-center text-white shrink-0 shadow-md">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-purple-300">
                  Unit #{data.shopNumber}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {data.shopName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {CATEGORY_LABELS[data.shopType] || data.shopType}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-white/10 text-white">
                    Floor Level {data.shopFloor}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-purple-300/80 uppercase tracking-wider block font-semibold">
                Promotional Catalog
              </span>
              <span className="text-sm font-semibold text-white">
                {data.shopOffer?.length || 0} Registered Offers
              </span>
            </div>
          </div>

          {/* Details Grid (From Unified Mentor Specification) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="mall-inner p-3.5 space-y-1">
              <span className="text-xs text-purple-300/80 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5" />
                Store Owner
              </span>
              <p className="text-sm font-semibold text-white">{data.shopOwnerName}</p>
              {data.ownerOccupation && (
                <p className="text-[11px] text-purple-200/70">{data.ownerOccupation}</p>
              )}
            </div>

            <div className="mall-inner p-3.5 space-y-1">
              <span className="text-xs text-purple-300/80 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5" />
                Phone Number
              </span>
              <p className="text-sm font-mono text-white">
                {data.contactPhone || "+91 98000 00000"}
              </p>
            </div>

            <div className="mall-inner p-3.5 space-y-1">
              <span className="text-xs text-purple-300/80 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </span>
              <p className="text-xs text-white truncate">
                {data.email || `store${data.shopNumber}@vistasquare.com`}
              </p>
            </div>

            <div className="mall-inner p-3.5 space-y-1">
              <span className="text-xs text-purple-300/80 flex items-center gap-1.5 font-medium">
                <Share2 className="w-3.5 h-3.5" />
                Instagram / Social
              </span>
              <p className="text-xs font-mono text-purple-200 truncate">
                {data.instagramId || "@vistasquare_mall"}
              </p>
            </div>
          </div>

          {/* Store description */}
          {data.description && (
            <div className="mall-inner p-4 space-y-1">
              <span className="text-xs text-purple-300/80 flex items-center gap-1.5 font-medium">
                <FileText className="w-3.5 h-3.5" />
                Store Description & Offerings
              </span>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                {data.description}
              </p>
            </div>
          )}
        </div>

        {/* Promotions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-300" />
              <span>Offers & Deals ({data.shopOffer?.length || 0})</span>
            </h3>
            <NavLink
              to={`/admin/view/offer/${data.id}`}
              className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add / Edit Offers</span>
            </NavLink>
          </div>

          {data.shopOffer && data.shopOffer.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.shopOffer.map((offer, index) => (
                <div key={index} className="mall-card p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-base">
                        {offer.offerName}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {offer.offerDiscount || "Discounted"}
                      </span>
                    </div>

                    <p className="text-xs text-purple-200/80 leading-relaxed">
                      {offer.offerDiscription}
                    </p>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl font-bold text-white font-mono">
                        ₹{offer.offerDiscountPrice}
                      </span>
                      {offer.offerOriginalPrice && (
                        <span className="text-xs text-purple-300/60 line-through font-mono">
                          ₹{offer.offerOriginalPrice}
                        </span>
                      )}
                      {offer.stock && (
                        <span className="text-[11px] text-emerald-400 font-medium ml-auto">
                          {offer.stock}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-purple-200/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-300/60" />
                      <span>Valid till {offer.offerExpier || "Ongoing"}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteOffer(index)}
                      className="text-rose-300 hover:text-white p-1 rounded hover:bg-rose-500/20 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mall-card p-8 text-center text-purple-200/60 space-y-2">
              <Tag className="w-8 h-8 mx-auto text-purple-300/40" />
              <p className="text-sm">No offer yet</p>
              <NavLink
                to={`/admin/view/offer/${data.id}`}
                className="mall-btn-primary text-xs py-2 px-4 inline-flex items-center gap-2 mt-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Offer</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminViewShopID;
