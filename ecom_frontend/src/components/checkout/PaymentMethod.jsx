
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentMethod, createUserCart, getUserCart } from '../../store/actions';

const PaymentMethod = () => {
  const { paymentMethod } = useSelector(state => state.payment); 
  const { cart, cartId, totalPrice, isCartDirty } = useSelector(state => state.carts); 
  const { isLoading, errorMessage } = useSelector(state => state.errors);  
  console.log("totalPrice: ",totalPrice); 

  const dispatch = useDispatch();   


  useEffect(() => {
    console.log("amazon"); 
    if(cart.length > 0 && !errorMessage && isCartDirty) {
      const sendCartItems = cart.map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
        }
      });
      dispatch(createUserCart(sendCartItems)); 
    }
  }, [cart, dispatch, errorMessage, isCartDirty]);  
  console.log(cartId);
  console.log(cart); 
  console.log(totalPrice); 

  const paymentMethodHandler = (message) => {
    dispatch(addPaymentMethod(message)); 
    console.log(message); 
  }

  return (
    <div className='max-w-md mx-auto p-5 bg-white shadow-md rounded-lg mt-16 border'>
      <h1 className='text-2xl font-semibold mb-4'>Select Payment Method</h1>  
      <FormControl>
        <RadioGroup
          aria-label="demo-radio-buttons-group-label"
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => paymentMethodHandler(e.target.value)}  
        >
          <FormControlLabel value="Stripe" control={<Radio color='primary' />} label="Stripe" className='text-gray-700' />
          <FormControlLabel value="Paypal" control={<Radio color='primary' />} label="Paypal" className='text-gray-700' />   
        </RadioGroup>   
      </FormControl> 
    </div>
  )
}

export default PaymentMethod; 