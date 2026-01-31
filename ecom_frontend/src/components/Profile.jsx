import React, { useState } from 'react';
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { RiBarChartFill } from "react-icons/ri";
import { useAuthStatus } from '../hooks/useAuthStatus'
import DeleteModal from './shared/DeleteModal';
import { AiFillDollarCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfileImage, updateProfileImage } from '../store/actions';
import { useImageUpload } from '../hooks/useImageUpload';
import ImageModal from './ImageUpload';

const Profile = () => {
  const { isAdmin, isSeller, isUser } = useAuthStatus();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isImageFullViewOpen, setIsImageFullViewOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const { profile } = useSelector(state => state.profile); 
  const [isUploading, setIsUploading] = useState(false);  

  const dispatch = useDispatch(); 

  const { username, email, imageUrl, totalOrders, totalSpent, sellerProductOrdersCount, totalApplicationOrders, } = profile || {};

  const { fileInputRef, previewImage, selectedFile, handleImageChange, handleClearImage, } = useImageUpload();

  const handleDeleteProfilePic = async () => {
    setIsDeleting(true);
    
    dispatch(deleteProfileImage());

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  const handleUploadClick = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsUploading(true);
    
    dispatch(updateProfileImage(formData, () => {
       setIsUploading(false);
       handleClearImage();
     }));
  };

  const handleImageClick = () => {
  if (imageUrl && !previewImage) {
    setIsImageFullViewOpen(true);
  }
};

return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"> 
          
          <div className="p-8 sm:p-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 text-center sm:text-left">
            <div className="flex flex-col items-center sm:flex-row sm:space-x-8">
              
              {/* PROFILE IMAGE CONTAINER */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200 flex items-center justify-center relative ${imageUrl && !previewImage ? 'cursor-zoom-in' : ''}`}" onClick={handleImageClick}> 
                  {/* Priority: Preview Image > Backend Image > Default Icon */}
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover cursor-pointer" />  
                  ) : (
                    <MdAccountCircle className="w-24 h-24 text-gray-400" /> 
                  )}

                  {/* Loading Spinner Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* HIDDEN FILE INPUT */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
                
                {/* ACTION BUTTONS */}
                {!selectedFile ? (
                  <div className="absolute bottom-0 right-0 flex gap-1">
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-lg transition-transform hover:scale-110"
                    >
                      <FaCamera className="w-4 h-4 cursor-pointer" />
                    </button>
                    {imageUrl && (
                      <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
                      >
                        <MdDelete className="w-4 h-4 cursor-pointer" /> 
                      </button>
                    )}
                  </div>
                ) : (
                  // SAVE / CANCEL SELECTION
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-1 rounded-full shadow-xl border border-gray-100">
                    <button 
                      onClick={handleUploadClick}
                      className="p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors"
                    >
                      <FaCheck className="w-3 h-3 cursor-pointer" /> 
                    </button>
                    <button 
                      onClick={handleClearImage}
                      className="p-2 bg-gray-400 rounded-full text-white hover:bg-gray-500 transition-colors"
                    >
                      <FaTimes className="w-3 h-3 cursor-pointer" /> 
                    </button>
                  </div>
                )}
              </div>

              {/* IDENTITY INFO */}
              <div className="mt-8 sm:mt-0">
                <h1 className="text-2xl font-bold text-gray-900">{username || "User"}</h1>
                <p className="text-gray-500 mb-3">{email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {isAdmin && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">Admin</span>}
                  {isSeller && <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase">Seller</span>}
                  {isUser && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">User</span>} 
                </div>
              </div>
            </div>
          </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            
            {/* Standard User Stats */}
            <StatCard 
              label="Orders Placed" 
              value={totalOrders} 
              icon={<FaShoppingBag className="w-6 h-6 text-blue-500" />} 
            />
            <StatCard 
              label="Total Spent" 
              value={`$${totalSpent ? totalSpent?.toLocaleString() : '0.00'}`}  
              icon={<AiFillDollarCircle className="w-6 h-6 text-green-500" />} 
            />

            {/* Seller Specific Stats */}
            {isSeller || isAdmin && (
              <StatCard 
                label="Orders Received" 
                value={sellerProductOrdersCount} 
                icon={<RiBarChartFill className="w-6 h-6 text-orange-500" />} 
                highlight
              />
            )}

            {/* Admin Specific Stats */}
            {isAdmin && (
              <StatCard 
                label="Global Orders" 
                value={totalApplicationOrders} 
                icon={<RiBarChartFill className="w-6 h-6 text-purple-500" />} 
                highlight
              />
            )}
          </div> 
        </div>
      </div>

      <DeleteModal 
        open={isDeleteModalOpen} 
        setOpen={setIsDeleteModalOpen} 
        title="Remove Profile Picture"
        onDeleteHandler={handleDeleteProfilePic} 
        loader={isDeleting} 
      /> 

      <ImageModal
      src={imageUrl} 
      isOpen={isImageFullViewOpen} 
      onClose={() => setIsImageFullViewOpen(false)} 
      />
    </div>
  );
};

const StatCard = ({ label, value, icon, highlight }) => (
  <div className={`flex items-center p-4 rounded-xl border ${highlight ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-gray-100'}`}>
    <div className="p-3 rounded-lg bg-white shadow-sm mr-4">          
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>     
      <p className="text-xl font-bold text-gray-900">{value}</p> 
    </div>
  </div>
);

export default Profile;