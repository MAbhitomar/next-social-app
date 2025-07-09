"use client";

import { useUser } from "@clerk/nextjs";
import { HiOutlinePhotograph } from "react-icons/hi";
import { useRef, useState, useEffect } from "react";

export default function Input() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [text, setText] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const imagePickRef = useRef(null);

  if (!isSignedIn || !isLoaded) {
    return null;
  }

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // For local preview
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToCloudinary();
    }
  }, [selectedFile]);

  const uploadImageToCloudinary = async () => {
    setImageFileUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setImageFileUrl(data.secure_url); // Final Cloudinary image URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setSelectedFile(null);
      setImageFileUrl(null);
    } finally {
      setImageFileUploading(false);
    }
  };
  const handleSubmit = async () => {
    setPostLoading(true);
    const response = await fetch("/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMongoId: user.publicMetadata.userMongoId,
        name: user.fullName,
        username: user.username,
        text,
        profileImg: user.imageUrl,
        image: imageFileUrl,
      }),
    });
    setPostLoading(false);
    setText("");
    setSelectedFile(null);
    setImageFileUrl(null);
    // location.reload();
  };
  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img
        src={user.imageUrl}
        alt="user-img"
        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95 object-cover"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
          placeholder="Whats happening"
          rows="2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {selectedFile && (
          <img
            onClick={() => {
              setSelectedFile(null);
              setImageFileUrl(null);
            }}
            src={imageFileUrl}
            alt="selected-img"
            className={`w-full max-h-[250px] object-cover cursor-pointer ${
              imageFileUploading ? "animate-pulse" : ""
            }`}
          />
        )}

        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
            onClick={() => imagePickRef.current.click()}
          />
          <input
            type="file"
            ref={imagePickRef}
            accept="image/*"
            hidden
            onChange={addImageToPost}
          />
          <button
            disabled={text.trim() === "" || postLoading || imageFileUploading}
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
