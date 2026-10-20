import { useEffect, useState, useMemo } from "react";
import { getAllShops } from "../services/mallStore";
import { CATEGORY_LABELS } from "../services/dummyData";
import {
  Search,
  Tag,
  Layers,
  Store,
  ChevronRight,
  Phone,
  User,
  LayoutGrid,
  List,
  X,
  ArrowUpDown,
  GitCompare,
  Check,
} from "lucide-react";

const FLOOR_OVERVIEWS = {
  1: "Ground Floor · Anchor Technology, Organic Groceries, Footwear & Essentials",
  2: "Floor 2 · Luxury Lifestyle, Exotic Fruits, Esports Cyber Lounge & Beauty Care",
  3: "Floor 3 · Multi-Cuisine Food Court, Crispy Grills & Street Delicacies",
  4: "Floor 4 · Hardware Care, Device Specialists, Handloom Silk & Couture",
  5: "Floor 5 · 4K IMAX Cineplex, Family Entertainment & Skyline Rooftop Bistro",
};

const Home = () => {
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [floorSortOrder, setFloorSortOrder] = useState("asc"); // "asc" | "desc"
  const [activeTab, setActiveTab] = useState("stores"); // "stores" | "offers" | "compare" | "floors"
  const [layoutMode, setLayoutMode] = useState("grid"); // "grid" | "table"
  const [activeModalShop, setActiveModalShop] = useState(null);

  // Quick Unit Lookup State (From architecture diagram: Floor Number & Shop Number)
  const [lookupFloor, setLookupFloor] = useState("");
  const [lookupShop, setLookupShop] = useState("");
  const [lookupResult, setLookupResult] = useState(null);

  // Compare products state (IDs of offers selected for comparison)
  const [selectedOfferIds, setSelectedOfferIds] = useState(["OFF-101-1", "OFF-101-2"]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const shops = await getAllShops();
      setAllShops(shops);
    } catch (err) {
      console.error("Error fetching shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick unit lookup submit
  const handleUnitLookup = (e) => {
    if (e) e.preventDefault();
    if (!lookupFloor && !lookupShop) return;

    const matched = allShops.find((s) => {
      const floorMatch = !lookupFloor || String(s.shopFloor) === String(lookupFloor);
      const shopMatch = !lookupShop || String(s.shopNumber) === String(lookupShop);
      return floorMatch && shopMatch;
    });

    if (matched) {
      setActiveModalShop(matched);
      setLookupResult(null);
    } else {
      setLookupResult("No store found matching Floor #" + lookupFloor + " and Unit #" + lookupShop);
    }
  };

  // Filtered & Sorted Stores
  const filteredShops = useMemo(() => {
    const list = allShops.filter((shop) => {
      const matchesCategory =
        selectedCategory === "all" || shop.shopType === selectedCategory;

      const matchesFloor =
        selectedFloor === "all" || String(shop.shopFloor) === String(selectedFloor);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        shop.shopName?.toLowerCase().includes(q) ||
        shop.shopOwnerName?.toLowerCase().includes(q) ||
        String(shop.shopNumber).includes(q) ||
        shop.shopOffer?.some(
          (o) =>
            o.offerName?.toLowerCase().includes(q) ||
            o.offerDiscription?.toLowerCase().includes(q)
        );

      return matchesCategory && matchesFloor && matchesSearch;
    });

    // Floor sorting: ascending or descending (from architecture diagram)
    list.sort((a, b) => {
      const fA = Number(a.shopFloor) || 0;
      const fB = Number(b.shopFloor) || 0;
      return floorSortOrder === "asc" ? fA - fB : fB - fA;
    });

    return list;
  }, [allShops, selectedCategory, selectedFloor, searchQuery, floorSortOrder]);

  // Flattened active promotional offers list
  const allOffers = useMemo(() => {
    const list = [];
    allShops.forEach((shop) => {
      if (shop.shopOffer && Array.isArray(shop.shopOffer)) {
        shop.shopOffer.forEach((offer, idx) => {
          list.push({
            ...offer,
            uniqueId: offer.offerId || `${shop.id}-${idx}`,
            shopId: shop.id,
            shopName: shop.shopName,
            shopNumber: shop.shopNumber,
            shopFloor: shop.shopFloor,
            shopType: shop.shopType,
            contactPhone: shop.contactPhone,
          });
        });
      }
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (o) =>
          o.offerName?.toLowerCase().includes(q) ||
          o.offerDiscription?.toLowerCase().includes(q) ||
          o.shopName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allShops, searchQuery]);

  // Comparison list items
  const comparisonOffers = useMemo(() => {
    return allOffers.filter((o) => selectedOfferIds.includes(o.uniqueId));
  }, [allOffers, selectedOfferIds]);

  const toggleCompareOffer = (offerId) => {
    if (selectedOfferIds.includes(offerId)) {
      setSelectedOfferIds((prev) => prev.filter((id) => id !== offerId));
    } else {
      if (selectedOfferIds.length >= 4) {
        alert("You can compare up to 4 items simultaneously.");
        return;
      }
      setSelectedOfferIds((prev) => [...prev, offerId]);
    }
  };

  return (
    <div className="min-h-screen text-white pb-24">
      {/* VISTA SQUARE BRAND HERO */}
      <section className="pt-6 sm:pt-8 pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mall-card p-6 sm:p-10 relative overflow-hidden bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-purple-900/90">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <img
                  src="/Screenshot 2024-10-31 091121.png"
                  alt="Vista Square Dove"
                  className="w-12 h-12 object-contain brightness-200"
                />
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-wider text-white font-sans uppercase">
                    VISTA SQUARE
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200/80 font-medium">
                    YOUR ONE-STOP SHOPPING DESTINATION
                  </p>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Super Mall Retail & Product Offer Management System
              </h1>

              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                Centralized platform to browse multi-level shops, compare products, explore active promotions, and locate retail units across all 5 floors.
              </p>

              {/* Fast Floor & Unit Direct Lookup (Architecture diagram requirement) */}
              <form
                onSubmit={handleUnitLookup}
                className="pt-2 flex flex-wrap items-center gap-2"
              >
                <span className="text-xs font-semibold text-purple-200">
                  Quick Unit Search:
                </span>
                <select
                  value={lookupFloor}
                  onChange={(e) => setLookupFloor(e.target.value)}
                  className="mall-input py-1.5 px-3 text-xs w-28"
                >
                  <option value="">Floor #</option>
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                  <option value="4">Floor 4</option>
                  <option value="5">Floor 5</option>
                </select>

                <input
                  type="number"
                  placeholder="Shop # (e.g. 101)"
                  value={lookupShop}
                  onChange={(e) => setLookupShop(e.target.value)}
                  className="mall-input py-1.5 px-3 text-xs w-36"
                />

                <button type="submit" className="mall-btn-primary text-xs py-1.5 px-4">
                  Find Unit
                </button>
              </form>

              {lookupResult && (
                <p className="text-xs text-rose-300 font-medium mt-1">{lookupResult}</p>
              )}
            </div>

            {/* Shopping Mall Facade Illustration */}
            <div className="shrink-0 hidden lg:flex items-center justify-center p-4">
              <img
                src="/cartoon-multistory-shopping-mall-with-blue-glass-facade_1316704-6639-removebg-preview.png"
                alt="Vista Square Shopping Mall Building Facade"
                className="max-h-56 w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORATION CONTROL CENTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Navigation Tabs (From Architecture Diagrams) */}
        <div className="mall-card p-2 sm:p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("stores")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "stores"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-purple-200/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>List of Shop Details ({allShops.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("offers")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "offers"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-purple-200/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Tag className="w-4 h-4 text-amber-300" />
              <span>List Offer Products ({allOffers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("compare")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "compare"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-purple-200/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <GitCompare className="w-4 h-4 text-cyan-300" />
              <span>Compare Products Cost & Features ({comparisonOffers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("floors")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "floors"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-purple-200/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Floor Wise Details</span>
            </button>
          </div>

          {activeTab === "stores" && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-1.5 rounded text-xs ${
                  layoutMode === "grid" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode("table")}
                className={`p-1.5 rounded text-xs ${
                  layoutMode === "table" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="mall-card p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/60" />
              <input
                type="text"
                placeholder="Search shop name, owner, offer title, keywords..."
                className="mall-input pl-9 text-xs sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Floor Selector */}
            <select
              className="mall-input text-xs sm:text-sm"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="all">All Floors (1 - 5)</option>
              <option value="1">Floor 1 (Ground Floor)</option>
              <option value="2">Floor 2 (Fashion & Beauty)</option>
              <option value="3">Floor 3 (Food Court & Chicken)</option>
              <option value="4">Floor 4 (Tech Care & Couture)</option>
              <option value="5">Floor 5 (Cineplex & Rooftop)</option>
            </select>

            {/* Sort by Floor: Increasing / Decreasing (Direct from Unified Mentor Diagram) */}
            <button
              onClick={() => setFloorSortOrder(floorSortOrder === "asc" ? "desc" : "asc")}
              className="mall-btn-secondary text-xs flex items-center justify-center gap-2"
              title="Filter floor wise order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>
                Floor: {floorSortOrder === "asc" ? "Increasing (1→5)" : "Decreasing (5→1)"}
              </span>
            </button>
          </div>

          {/* Category Filter Tabs (From diagram: Technology, Vegetable, Fruit, Cyber Cafe, Chicken Shop, etc.) */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-purple-300/80 shrink-0 uppercase tracking-wider mr-2">
              Categories:
            </span>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const isSelected = selectedCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isSelected
                      ? "bg-purple-600 text-white font-semibold"
                      : "bg-white/10 text-purple-200 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. STORES VIEW */}
        {activeTab === "stores" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-purple-200/70 px-1">
              <span>
                Showing <strong className="text-white font-mono">{filteredShops.length}</strong> registered stores
              </span>
              {(searchQuery || selectedCategory !== "all" || selectedFloor !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedFloor("all");
                  }}
                  className="text-purple-300 hover:text-white underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Grid Layout */}
            {layoutMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredShops.map((shop) => (
                  <div
                    key={shop.id}
                    className="mall-card mall-card-hover p-5 flex flex-col justify-between space-y-4 cursor-pointer"
                    onClick={() => setActiveModalShop(shop)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-600/30 text-purple-200 border border-purple-400/30">
                          Unit #{shop.shopNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-purple-200">
                          Floor {shop.shopFloor}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-purple-300">
                          {shop.shopName}
                        </h3>
                        <p className="text-xs text-purple-300 font-medium">
                          {CATEGORY_LABELS[shop.shopType] || shop.shopType}
                        </p>
                      </div>

                      <p className="text-xs text-purple-200/80 line-clamp-2 leading-relaxed">
                        {shop.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-purple-200/70">
                        <span className="flex items-center gap-1 truncate">
                          <User className="w-3.5 h-3.5 text-purple-300/60" />
                          {shop.shopOwnerName}
                        </span>
                        {shop.contactPhone && (
                          <span className="font-mono text-[11px] text-purple-300/80">
                            {shop.contactPhone}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {shop.shopOffer?.length > 0 ? (
                          <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {shop.shopOffer.length} Live Offer{shop.shopOffer.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">Standard Catalog</span>
                        )}

                        <span className="text-xs font-semibold text-purple-300 flex items-center gap-0.5">
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table Layout */
              <div className="mall-card p-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/15 text-xs font-semibold text-purple-200/70 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Unit #</th>
                      <th className="py-3 px-3">Store Name</th>
                      <th className="py-3 px-3">Floor</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Owner / Contact</th>
                      <th className="py-3 px-3">Promotions</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredShops.map((shop) => (
                      <tr
                        key={shop.id}
                        className="hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => setActiveModalShop(shop)}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-purple-300">
                          #{shop.shopNumber}
                        </td>
                        <td className="py-3 px-3 font-semibold text-white">
                          {shop.shopName}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs">
                          Floor {shop.shopFloor}
                        </td>
                        <td className="py-3 px-3 text-xs text-purple-200">
                          {CATEGORY_LABELS[shop.shopType] || shop.shopType}
                        </td>
                        <td className="py-3 px-3 text-xs text-purple-200/80">
                          {shop.shopOwnerName}
                        </td>
                        <td className="py-3 px-3">
                          {shop.shopOffer?.length > 0 ? (
                            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {shop.shopOffer.length} Offers
                            </span>
                          ) : (
                            <span className="text-xs text-white/40">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button className="mall-btn-secondary text-xs py-1 px-3">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredShops.length === 0 && !loading && (
              <div className="mall-card p-12 text-center text-purple-200/60 space-y-2">
                <Store className="w-10 h-10 mx-auto text-purple-300/40" />
                <h4 className="font-semibold text-white">No Shops Matching Criteria</h4>
                <p className="text-xs">Adjust your search keyword or selected category filter.</p>
              </div>
            )}
          </div>
        )}

        {/* 2. LIST OFFER PRODUCTS VIEW */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-purple-200/70 px-1">
              <span>
                Showing <strong className="text-amber-300 font-mono">{allOffers.length}</strong> active offers across Super Mall
              </span>
              <span className="text-[11px] text-purple-300/80">
                Tip: Check the box on any offer to add it to the Product Comparison matrix!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allOffers.map((offer) => {
                const isCompared = selectedOfferIds.includes(offer.uniqueId);
                return (
                  <div
                    key={offer.uniqueId}
                    className="mall-card mall-card-hover p-5 flex flex-col justify-between space-y-4 relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/25 text-amber-300 border border-amber-500/35 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {offer.offerDiscount || "Discounted"}
                        </span>
                        <span className="text-xs font-mono text-purple-200 bg-white/10 px-2 py-0.5 rounded">
                          Floor {offer.shopFloor} · #{offer.shopNumber}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-white leading-snug">
                          {offer.offerName}
                        </h4>
                        <p className="text-xs text-purple-300 font-medium">
                          at {offer.shopName}
                        </p>
                      </div>

                      <p className="text-xs text-purple-200/80 leading-relaxed line-clamp-3">
                        {offer.offerDiscription}
                      </p>

                      {/* Pricing comparison */}
                      <div className="pt-2 flex items-baseline gap-2.5">
                        <span className="text-2xl font-bold font-mono text-white">
                          ₹{offer.offerDiscountPrice}
                        </span>
                        {offer.offerOriginalPrice && (
                          <span className="text-sm font-mono text-purple-300/60 line-through">
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

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <button
                        onClick={() => toggleCompareOffer(offer.uniqueId)}
                        className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
                          isCompared
                            ? "bg-cyan-600/40 text-cyan-200 border border-cyan-400/40 font-semibold"
                            : "bg-white/10 text-white/70 hover:text-white"
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isCompared ? "opacity-100" : "opacity-0"}`} />
                        <span>{isCompared ? "In Comparison" : "+ Compare"}</span>
                      </button>

                      <button
                        onClick={() => {
                          const target = allShops.find((s) => s.id === offer.shopId);
                          if (target) setActiveModalShop(target);
                        }}
                        className="mall-btn-primary text-xs py-1 px-3"
                      >
                        Shop Info
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. COMPARE PRODUCTS COST & FEATURES VIEW (Unified Mentor Spec) */}
        {activeTab === "compare" && (
          <div className="space-y-6">
            <div className="mall-card p-6 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <GitCompare className="w-5 h-5 text-cyan-300" />
                    <span>Product & Offer Cost Comparison Matrix</span>
                  </h3>
                  <p className="text-xs text-purple-200/80">
                    Compare product pricing, discount rates, unit location, and offer duration side-by-side.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("offers")}
                  className="mall-btn-secondary text-xs self-start sm:self-auto"
                >
                  + Add More Products to Compare
                </button>
              </div>
            </div>

            {comparisonOffers.length > 0 ? (
              <div className="mall-card p-5 overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/15">
                      <th className="py-3 px-4 text-xs font-semibold text-purple-300 uppercase w-48">
                        Product / Offer
                      </th>
                      {comparisonOffers.map((offer) => (
                        <th key={offer.uniqueId} className="py-3 px-4 min-w-[200px]">
                          <div className="font-bold text-white text-base">
                            {offer.offerName}
                          </div>
                          <div className="text-xs text-purple-300 font-medium">
                            {offer.shopName} (Floor {offer.shopFloor})
                          </div>
                          <button
                            onClick={() => toggleCompareOffer(offer.uniqueId)}
                            className="text-[11px] text-rose-300 hover:text-white mt-1 underline"
                          >
                            Remove
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                    {/* Offer Price */}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-purple-200">
                        Discounted Offer Price
                      </td>
                      {comparisonOffers.map((o) => (
                        <td key={o.uniqueId} className="py-3 px-4 font-mono font-bold text-lg text-emerald-400">
                          ₹{o.offerDiscountPrice}
                        </td>
                      ))}
                    </tr>

                    {/* Original Price */}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-purple-200">
                        Original Retail Price
                      </td>
                      {comparisonOffers.map((o) => (
                        <td key={o.uniqueId} className="py-3 px-4 font-mono line-through text-purple-300/70">
                          ₹{o.offerOriginalPrice || "—"}
                        </td>
                      ))}
                    </tr>

                    {/* Discount % */}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-purple-200">
                        Total Discount
                      </td>
                      {comparisonOffers.map((o) => (
                        <td key={o.uniqueId} className="py-3 px-4 font-bold text-amber-300">
                          {o.offerDiscount || "Deal"}
                        </td>
                      ))}
                    </tr>

                    {/* Stock Availability */}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-purple-200">
                        Stock / Availability
                      </td>
                      {comparisonOffers.map((o) => (
                        <td key={o.uniqueId} className="py-3 px-4 text-purple-100">
                          {o.stock || "Standard Inventory"}
                        </td>
                      ))}
                    </tr>

                    {/* Expiry Date */}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-purple-200">
                        Offer Validity
                      </td>
                      {comparisonOffers.map((o) => (
                        <td key={o.uniqueId} className="py-3 px-4 text-purple-200/90">
                          Valid till {o.offerExpier || "Ongoing"}
                        </td>
                      ))}
                    </tr>

                    {/* Location */}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-purple-200">
                        Store Location
                      </td>
                      {comparisonOffers.map((o) => (
                        <td key={o.uniqueId} className="py-3 px-4">
                          <button
                            onClick={() => {
                              const s = allShops.find((shop) => shop.id === o.shopId);
                              if (s) setActiveModalShop(s);
                            }}
                            className="text-xs text-purple-300 underline font-medium"
                          >
                            Floor {o.shopFloor}, Unit #{o.shopNumber} (View Details)
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mall-card p-12 text-center text-purple-200/60 space-y-3">
                <GitCompare className="w-10 h-10 mx-auto text-purple-300/40" />
                <h4 className="font-semibold text-white">No Offers Selected For Comparison</h4>
                <p className="text-xs">
                  Go to the &ldquo;List Offer Products&rdquo; tab and click &ldquo;+ Compare&rdquo; on any products you wish to evaluate.
                </p>
                <button
                  onClick={() => setActiveTab("offers")}
                  className="mall-btn-primary text-xs py-2 px-4"
                >
                  Browse Offers to Compare
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. FLOOR DIRECTORY GUIDE */}
        {activeTab === "floors" && (
          <div className="space-y-5">
            <div className="mall-card p-6">
              <h3 className="text-xl font-bold text-white mb-1">
                Five-Floor Architectural Directory
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/80">
                Floor-wise tenant mapping and retail zones inside Vista Square Super Mall.
              </p>
            </div>

            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((floorNum) => {
                const floorStores = allShops.filter((s) => Number(s.shopFloor) === floorNum);
                return (
                  <div key={floorNum} className="mall-card p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-purple-700/60 font-mono font-bold text-white text-sm flex items-center justify-center">
                          {floorNum}F
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-base">
                            Floor Level {floorNum}
                          </h4>
                          <p className="text-xs text-purple-200/70">
                            {FLOOR_OVERVIEWS[floorNum]}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-white/10 text-purple-200 self-start sm:self-auto">
                        {floorStores.length} Active Stores
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {floorStores.map((store) => (
                        <div
                          key={store.id}
                          onClick={() => setActiveModalShop(store)}
                          className="mall-inner p-3 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-white text-xs truncate block">
                              #{store.shopNumber} {store.shopName}
                            </span>
                            <span className="text-[11px] text-purple-200/60 block truncate">
                              {CATEGORY_LABELS[store.shopType] || store.shopType} · {store.shopOwnerName}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-purple-300/60 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* STORE DETAILS MODAL */}
      {activeModalShop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActiveModalShop(null)}
        >
          <div
            className="w-full max-w-2xl mall-card p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto bg-purple-950/95 border-purple-400/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalShop(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-700 flex items-center justify-center text-white shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-300">
                    Unit #{activeModalShop.shopNumber}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/15 text-white">
                    Floor {activeModalShop.shopFloor}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeModalShop.shopName}
                </h3>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  {CATEGORY_LABELS[activeModalShop.shopType] || activeModalShop.shopType}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="mall-inner p-3.5 text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              {activeModalShop.description || "Official branded retail unit at Vista Square Super Mall."}
            </p>

            {/* Owner & Contact Info (From Unified Mentor Diagram) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="mall-inner p-3 space-y-1">
                <span className="text-purple-300/80 flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5" />
                  Store Owner & Occupation
                </span>
                <p className="font-semibold text-white">{activeModalShop.shopOwnerName}</p>
                {activeModalShop.ownerOccupation && (
                  <p className="text-[11px] text-purple-200/70">{activeModalShop.ownerOccupation}</p>
                )}
              </div>

              <div className="mall-inner p-3 space-y-1">
                <span className="text-purple-300/80 flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  Direct Contact Line
                </span>
                <p className="font-mono font-semibold text-white">
                  {activeModalShop.contactPhone || "+91 98000 00000"}
                </p>
                {activeModalShop.email && (
                  <p className="text-[11px] text-purple-200/70 truncate">{activeModalShop.email}</p>
                )}
              </div>
            </div>

            {/* Offers List */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-300" />
                <span>Store Offers & Deals ({activeModalShop.shopOffer?.length || 0})</span>
              </h4>

              {activeModalShop.shopOffer?.length > 0 ? (
                <div className="space-y-2.5">
                  {activeModalShop.shopOffer.map((offer, idx) => (
                    <div key={idx} className="mall-inner p-3.5 space-y-1.5 border border-amber-500/25">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-sm">
                          {offer.offerName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300">
                          {offer.offerDiscount || "Special Deal"}
                        </span>
                      </div>
                      <p className="text-xs text-purple-200/80">
                        {offer.offerDiscription}
                      </p>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-bold font-mono text-white">
                          ₹{offer.offerDiscountPrice}
                        </span>
                        {offer.offerOriginalPrice && (
                          <span className="text-xs font-mono text-purple-300/60 line-through">
                            ₹{offer.offerOriginalPrice}
                          </span>
                        )}
                        <span className="text-xs text-purple-300/70 ml-auto">
                          Valid till: {offer.offerExpier || "Ongoing"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-purple-200/60 py-2">
                  No promotional offers currently provided for this store.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveModalShop(null)}
                className="mall-btn-primary text-xs py-2 px-5"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
