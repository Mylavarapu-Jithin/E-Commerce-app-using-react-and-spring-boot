
import { Button } from '@mui/material';
import React, { useRef, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import Spinners from '../../shared/Spinners';
import toast from 'react-hot-toast';
import { useDispatch,} from 'react-redux';
import { updateProductImageFromDashboard } from '../../../store/actions';
import { useAuthStatus } from '../../../hooks/useAuthStatus';
import ModalButton from '../../shared/ModalButton';
import { useImageUpload } from '../../../hooks/useImageUpload';

const ImageUploadForm = ({ setOpen, product }) => {
  const [loader, setLoader] = useState(false); 

  const dispatch = useDispatch(); 
  const { isSeller } = useAuthStatus();
  const { fileInputRef, previewImage, selectedFile, handleImageChange, handleClearImage, } = useImageUpload(); 

  const addNewImageHandler = async (event) => {
    event.preventDefault(); 
    if(!selectedFile) {
      toast.error("Please select an image before saving."); 
      return; 
    } 
    const formData = new FormData();
    formData.append("image", selectedFile);   

    dispatch(updateProductImageFromDashboard(formData, isSeller, product.id ,setLoader, toast, setOpen));
  } 

  return (
    <div className='py-5 relative h-full'>
      <form className='space-y-4' onSubmit={addNewImageHandler}> 
        <div className='flex flex-col gap-4 w-full' >
          <label className='flex items-center gap-2 cursor-pointer text-custom-blue border border-dashed border-custom-blue rounded-md p-3 w-full justify-center'>  
            <FaCloudUploadAlt size={24} /> 
            <span>Upload Product Image</span> 
            <input type='file' ref={fileInputRef} onChange={handleImageChange} className='hidden' accept='.jpeg, .jpg, .png' /> 
          </label> 

          {previewImage && (
            <div>
              <img src={previewImage} alt='Image Preview' className='h-60 rounded-md mb-2' /> 
              <button type='button' 
              className='bg-rose-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-rose-500 font-semibold' 
              onClick={handleClearImage}>Clear Image</button>  
            </div>
          )}
        </div> 

        <ModalButton loader={loader} setOpen={setOpen} /> 
      </form>
    </div>
  )
}

export default ImageUploadForm