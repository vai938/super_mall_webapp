import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";
import { useNavigate } from "react-router-dom";
import AdminNavigation from "./AdminNavigation";

const AdminCreateShop = () => {
  const [inputField, setInputField] = useState({
    shopNumber: "",
    shopName: "",
    shopFloor: "",
    shopOwnerName: "",
    shopType: "",
  });

  const [error, setError] = useState({});
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = {};

    if (Number(inputField.shopNumber) <= 0) error.er1 = "Invalid shop number";
    else if (Number(inputField.shopNumber) > 50)
      error.er2 = "Shop number cannot exceed 50";
    else if (!inputField.shopName) error.er3 = "Required";
    else if (!inputField.shopFloor) error.er4 = "Required";
    else if (inputField.shopFloor > 5) error.er5 = "Only 5 floors available";
    else if (!inputField.shopOwnerName) error.er6 = "Required";
    else if (!inputField.shopType) error.er7 = "Required";

    if (Object.keys(error).length) {
      setError(error);
      return;
    }

    await addDoc(collection(db, "shops"), {
      shopNumber: Number(inputField.shopNumber),
      shopName: inputField.shopName,
      shopFloor: Number(inputField.shopFloor),
      shopOwnerName: inputField.shopOwnerName,
      shopType: inputField.shopType,
      shopOffer: [],
      createdAt: new Date(),
    });

    alert("Shop added successfully");
    nav("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white">
      <div className="grid grid-cols-11 min-h-screen">
        {/* Sidebar */}
        <div className="col-span-2 bg-white/10 backdrop-blur-xl border-r border-white/20">
          <AdminNavigation />
        </div>

        {/* Content */}
        <div className="col-span-9 p-8">
          <div className="max-w-5xl mx-auto glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6">
              Create New Shop
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Shop Number */}
              <div>
                <label>Shop Number *</label>
                <input
                  type="number"
                  className="glass-input w-full"
                  value={inputField.shopNumber}
                  onChange={(e) =>
                    setInputField({ ...inputField, shopNumber: e.target.value })
                  }
                />
                <p className="text-red-300 text-sm">{error.er1 || error.er2}</p>
              </div>

              {/* Shop Name */}
              <div>
                <label>Shop Name *</label>
                <input
                  type="text"
                  className="glass-input w-full"
                  value={inputField.shopName}
                  onChange={(e) =>
                    setInputField({ ...inputField, shopName: e.target.value })
                  }
                />
                <p className="text-red-300 text-sm">{error.er3}</p>
              </div>

              {/* Floor */}
              <div>
                <label>Shop Floor *</label>
                <input
                  type="number"
                  className="glass-input w-full"
                  value={inputField.shopFloor}
                  onChange={(e) =>
                    setInputField({ ...inputField, shopFloor: e.target.value })
                  }
                />
                <p className="text-red-300 text-sm">{error.er4 || error.er5}</p>
              </div>

              {/* Owner */}
              <div>
                <label>Owner Name *</label>
                <input
                  type="text"
                  className="glass-input w-full"
                  value={inputField.shopOwnerName}
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      shopOwnerName: e.target.value,
                    })
                  }
                />
                <p className="text-red-300 text-sm">{error.er6}</p>
              </div>

              {/* Type */}
              <div>
                <label>Shop Type *</label>
                <select
                  className="glass-input w-full"
                  value={inputField.shopType}
                  onChange={(e) =>
                    setInputField({ ...inputField, shopType: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  <option value="tech">Technology</option>
                  <option value="veg">Vegetable</option>
                  <option value="fruit">Fruit</option>
                  <option value="cyber">Cyber Cafe</option>
                  <option value="chicken">Chicken Shop</option>
                </select>
                <p className="text-red-300 text-sm">{error.er7}</p>
              </div>

              {/* Submit */}
              <div className="flex items-end">
                <button type="submit" className="glass-button w-full">
                  Create Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateShop;
