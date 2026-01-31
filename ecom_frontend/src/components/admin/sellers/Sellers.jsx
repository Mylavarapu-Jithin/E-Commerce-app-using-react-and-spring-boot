import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSellersForAdminDashboard } from '../../../store/actions';
import { FaUser } from 'react-icons/fa';
import SellerTable from './SellerTable';
import Filter from '../../products/Filter';

const Sellers = () => {
  const { sellers, pagination } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  const [openAddSellerModal, setOpenAddSellerModal] = useState(false);  

  useEffect(() => {
    dispatch(getSellersForAdminDashboard()); 
  }, [dispatch]);

  return (
    <div className='flex flex-col items-center justify-center px-2 md:px-4 xl:px-6 py-3'> 
      <div className='w-full flex justify-between pr-2 pt-2 pb-4'>
        <Filter searchPlaceHolder='Search by Username' isAdmin onlySearch /> 
        <button onClick={() => setOpenAddSellerModal(true)}
        className='flex items-center justify-center gap-2 bg-custom-blue rounded-md text-sm sm:text-base md:text-xl px-2 sm:px-3 py-1 cursor-pointer hover:bg-blue-500'> 
          <FaUser className='text-lg text-white' />
          <span className='text-white'>Add New Seller</span>    
        </button> 
      </div>  
      <SellerTable sellers={sellers} openAddSellerModal={openAddSellerModal} setOpenAddSellerModal={setOpenAddSellerModal} pagination={pagination} />  
    </div> 
  )
}

export default Sellers