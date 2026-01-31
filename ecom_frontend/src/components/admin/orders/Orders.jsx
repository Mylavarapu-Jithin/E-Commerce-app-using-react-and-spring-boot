import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import OrderTable from './OrderTable';
import { useSelector } from 'react-redux';
import useOrderFilter from '../../../hooks/useOrderFilter';
import { useAuthStatus } from '../../../hooks/useAuthStatus';
import Filter from '../../products/Filter';

const Orders = () => {
  
  const { adminOrders, pagination } = useSelector(state => state.order); 

  const emptyOrder = !adminOrders || adminOrders?.length == 0;
  const { isAdmin } = useAuthStatus(); 

  const SEARCH_BY_OPTIONS = [
  { value: "STATUS", label: "Status" },
  { value: "EMAIL", label: "Email" },
  { value: "TOTAL_AMOUNT", label: "Amount" },
  { value: "ORDER_ID", label: "Order ID" },
  { value: "ORDER_DATE", label: "Date" },
];

  useOrderFilter(); 
 
  return (
    <div className='pb-6 pt-3'>
      <Filter isAdmin={isAdmin} onlySearch={true} searchByOptions={SEARCH_BY_OPTIONS} /> 
      {emptyOrder ? (
        <div className='flex flex-col justify-center items-center text-gray-400'> 
          <FaShoppingCart className='mb-3' size={50} />
          <h2 className='text-2xl font-semibold text-gray-600'>No Orders Placed yet</h2>  
        </div>
      ) : (
        <OrderTable adminOrder={adminOrders} pagination={pagination} />   
      )
      }
    </div>
  )
}

export default Orders