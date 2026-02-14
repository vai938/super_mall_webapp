import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { storage, db } from "../../firebase/firebaseconsole";

function ImageUpload({ userId }) {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Load existing image URL
  useEffect(() => {
    if (!userId) return;

    const fetchImage = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          setImageUrl(snapshot.data().profileImageURL || "");
        }
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    };

    fetchImage();
  }, [userId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      setUploadMessage("Missing file or user ID");
      return;
    }

    try {
      const storageRef = ref(
        storage,
        `images/${userId}_${Date.now()}_${file.name}`
      );

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        profileImageURL: downloadURL,
      });

      setImageUrl(downloadURL);
      setUploadMessage("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage("Failed to upload image");
    }
  };

  return (
    <div className="glass-card p-6 max-w-md">
      <h3 className="text-xl font-semibold mb-4">Profile Image</h3>

      {/* Preview */}
      <div className="flex justify-center mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-32 h-32 rounded-full object-cover border border-white/30"
          />
        ) : (
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white/10 text-white/50">
            No Image
          </div>
        )}
      </div>

      {/* File input */}
      <input
        type="file"
        onChange={handleFileChange}
        className="glass-input w-full mb-4"
      />

      {/* Upload button */}
      <button
        onClick={handleUpload}
        className="glass-button w-full"
      >
        Upload Image
      </button>

      {/* Status message */}
      {uploadMessage && (
        <p className="mt-3 text-sm text-white/70 text-center">
          {uploadMessage}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;
