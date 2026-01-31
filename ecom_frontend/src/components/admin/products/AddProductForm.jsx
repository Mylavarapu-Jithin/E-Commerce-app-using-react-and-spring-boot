import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputField from '../../shared/InputField'
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addNewProductFromDashboard, updateProductFromDashboard } from '../../../store/actions';
import Spinners from '../../shared/Spinners'
import SelectedTextField from '../../shared/SelectedTextField';
import ErrorPage from '../../shared/ErrorPage';
import ModalButton from '../../shared/ModalButton';
import { useAuthStatus } from '../../../hooks/useAuthStatus';

const AddProductForm = ({ setOpen, product, update=false, }) => {

  const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm({mode: "onTouched"}); 
  const [loader, setLoader] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const { categories } = useSelector(state => state.products); 
  const { categoryLoader, errorMessage } = useSelector(state => state.errors); 
  const dispatch = useDispatch(); 

  const { isSeller } = useAuthStatus();

  useEffect(() => {
    if(update && product) { 
      setValue("productName", product?.productName);
      setValue("description", product?.description);
      setValue("specialPrice", product?.specialPrice); 
      setValue("discount", product?.discount);
      setValue("quantity", product?.quantity);
      setValue("price", product?.price);  
    }
  }, [update, product, setValue]);   

  useEffect(() => {
    if(!categoryLoader && categories)
      setSelectedCategory(categories[0]); 
  }, [categories, categoryLoader]); 

  const saveProductHandler = (data) => {
    if(!update) {
      dispatch(addNewProductFromDashboard(data, isSeller, selectedCategory.categoryId ,toast, reset, setLoader, setOpen)); 
    } else {
      const sendData = {...data, id: product?.id}; 
      dispatch(updateProductFromDashboard(sendData, isSeller, toast, reset, setLoader, setOpen));  
    }
  }; 
  
  return (
    <div className='py-5 relative h-full'> 
      <form className='space-y-4 ' onSubmit={handleSubmit(saveProductHandler)}> 
        <div className='flex md:flex-row flex-col gap-4 w-full'>
          <InputField label="Product Name" required id="productName" type="text" message="This field is required*" register={register} 
          errors={errors} placeholder="Product Name" /> 
          {!update && (
            categoryLoader ? <Spinners /> : errorMessage ? <ErrorPage message={errorMessage} /> : <SelectedTextField label="Select Categories" select={selectedCategory} setSelect={setSelectedCategory} lists={categories} />     
          )}
        </div>

        <div className='flex md:flex-row flex-col gap-4 w-full'>
          <InputField label="Price" required id="price" type="number" message="This field is required*" register={register} errors={errors} 
           placeholder="Product Price" />

           <InputField label="Quantity" required id="quantity" type="number" message="This field is required*" register={register} errors={errors} placeholder="Product Quantity" />   
        </div>

         <div className='flex md:flex-row flex-col gap-4 w-full'>
          <InputField label="Discount" required id="discount" type="number" message="This field is required*" register={register} errors={errors} 
           placeholder="Product Discount" /> 

           <InputField label="Special Price" required id="specialPrice" type="number" message="This field is required*" register={register} errors={errors} placeholder="Product Special Price" />   
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <label htmlFor='desc'> 
            Description
          </label> 

          <textarea rows={4} placeholder='Add Product Description...' className={`px-4 py-2  w-full border outline-none bg-transparent text-slate-800 rounded-md ${errors["description"]?.message ? "border-red-500" : "border-slate-700" }`} 
            {...register("description", {
              required: {value: true, message: "Description is required"},   
            })}> 
          </textarea> 
          {errors["description"]?.message && (
            <p className='text-sm font-semibold text-red-600 mt-0'>    
              {errors["description"]?.message}    
            </p>
          )}
        </div> 

        <ModalButton loader={loader} update={update} setOpen={setOpen} /> 
      </form>
    </div>  
  )
}

export default AddProductForm