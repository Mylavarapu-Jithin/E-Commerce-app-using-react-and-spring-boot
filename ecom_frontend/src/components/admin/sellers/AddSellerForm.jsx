import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Spinners from '../../shared/Spinners';
import { FaUser } from 'react-icons/fa';
import { Button } from '@mui/material';
import { addSellerFromAdminDashboard } from '../../../store/actions';
import toast from 'react-hot-toast';
import InputField from '../../shared/InputField';

const AddSellerForm = ({ loader, setLoader, setOpen }) => {

   const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm({mode: "onTouched"}); 
   const dispatch = useDispatch(); 

    const addNewSellerHandler = (data) => {
      const sendData = {...data, role:["seller", "user"]};
      dispatch(addSellerFromAdminDashboard(sendData, setLoader, reset, toast, setOpen)); 
    }; 

  return (
    <div className='relative h-full py-5'>
      <form className='space-y-4' onSubmit={handleSubmit(addNewSellerHandler)}>
        <div className='flex w-full'>
          <InputField label="UserName" required id="username" type="text" message="this field is required" register={register} errors={errors} placeholder="Enter UserName" /> 
        </div>

        <div className='flex w-full'>
          <InputField label="Email" required id="email" type="text" message="this field is required" register={register} errors={errors} placeholder="Enter Email" /> 
        </div>

         <div className='flex w-full'>
          <InputField label="Password" required id="password" type="text" message="this field is required" register={register} errors={errors} placeholder="Enter Password" /> 
        </div>

        <div className='flex w-full justify-between items-center absolute bottom-14'>
          <Button disabled={loader} onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button> 

          <Button disabled={loader} type='submit' variant='contained'>  
            {loader ? (
              <div className='flex gap-2 items-center'> 
                <Spinners /> Loading... 
              </div>
            ) : (
              <div className='flex gap-2 items-center'>
                <FaUser />
                Add New Seller
              </div>
            )
            }
          </Button> 
        </div>
      </form>
    </div>
  )
}

export default AddSellerForm