import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export const useImageUpload = () => {
  const fileInputRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid image file (.jpeg, .jpg, .png)");
      handleClearImage();
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return {
    fileInputRef,
    previewImage,
    selectedFile,
    handleImageChange,
    handleClearImage,
  };
};