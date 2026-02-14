import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseconsole";

const AdminShopOffer = () => {
  const { id: shopId } = useParams(); // Firestore document ID
  const nav = useNavigate();

  const [inputFields, setInputFields] = useState([
    {
      offerName: "",
      offerDiscription: "",
      offerReleaseDate: "",
      offerDiscount: "",
      offerExpier: "",
      offerOriginalPrice: "",
      offerDiscountPrice: "",
      offerImageUrl: "",
    },
  ]);

  // Load existing offers (if any)
  const fetchShopOffers = async () => {
    try {
      const shopRef = doc(db, "shops", shopId);
      const snapshot = await getDoc(shopRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.shopOffer && data.shopOffer.length > 0) {
          setInputFields(data.shopOffer);
        }
      } else {
        alert("Shop not found");
        nav("/admin");
      }
    } catch (err) {
      console.error("Error fetching shop:", err);
      alert("Failed to load shop data");
    }
  };

  useEffect(() => {
    fetchShopOffers();
  }, []);

  // Handle input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updated = [...inputFields];
    updated[index][name] = value;
    setInputFields(updated);
  };

  const handleAddField = () => {
    setInputFields([
      ...inputFields,
      {
        offerName: "",
        offerDiscription: "",
        offerReleaseDate: "",
        offerDiscount: "",
        offerExpier: "",
        offerOriginalPrice: "",
        offerDiscountPrice: "",
        offerImageUrl: "",
      },
    ]);
  };

  const handleRemoveField = (index) => {
    const updated = inputFields.filter((_, i) => i !== index);
    setInputFields(updated);
  };

  const handleSubmit = async () => {
    try {
      const shopRef = doc(db, "shops", shopId);

      await updateDoc(shopRef, {
        shopOffer: inputFields,
      });

      alert("Offers updated successfully");
      nav(`/admin/view/${shopId}`);
    } catch (err) {
      console.error("Error updating offers:", err);
      alert("Failed to update offers");
    }
  };

  return (
    <div>
      <div className="text-center font-mono">
        <h2>Offer Section</h2>
      </div>

      <button onClick={() => nav(`/admin/view/${shopId}`)}>Back</button>

      <div className="grid grid-cols-12 font-mono border rounded-md p-4 m-3">
        <div className="grid col-span-9">
          {inputFields.map((inputField, index) => (
            <div
              className="grid-cols-4 mt-3 grid gap-4 border p-4"
              key={index}
            >
              <div>
                <label>Offer Name</label>
                <input
                  className="border w-full"
                  type="text"
                  name="offerName"
                  value={inputField.offerName}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <div>
                <label>Description</label>
                <input
                  className="border w-full"
                  type="text"
                  name="offerDiscription"
                  value={inputField.offerDiscription}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <div>
                <label>Discount</label>
                <input
                  className="border w-full"
                  type="text"
                  name="offerDiscount"
                  value={inputField.offerDiscount}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <div>
                <label>Release Date</label>
                <input
                  className="border w-full"
                  type="date"
                  name="offerReleaseDate"
                  value={inputField.offerReleaseDate}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <div>
                <label>Expire Date</label>
                <input
                  className="border w-full"
                  type="date"
                  name="offerExpier"
                  value={inputField.offerExpier}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <div>
                <label>Original Price</label>
                <input
                  className="border w-full"
                  type="text"
                  name="offerOriginalPrice"
                  value={inputField.offerOriginalPrice}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <div>
                <label>Discount Price</label>
                <input
                  className="border w-full"
                  type="text"
                  name="offerDiscountPrice"
                  value={inputField.offerDiscountPrice}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <button
                className="bg-red-200 border px-3 py-1"
                onClick={() => handleRemoveField(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="col-span-3">
          <button
            className="bg-purple-200 mt-4 border px-3 py-1"
            onClick={handleAddField}
          >
            Add More Offer
          </button>
        </div>
      </div>

      <div className="float-right m-4">
        <button
          className="bg-green-200 border px-4 py-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AdminShopOffer;
