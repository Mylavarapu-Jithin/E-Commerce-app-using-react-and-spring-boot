
import { Alert, AlertTitle } from '@mui/material';
import React from 'react'

const PaypalPayment = () => {
  return (
    <div className='flex justify-center items-center h-95'>
      <Alert severity="warning" variant='filled' style={{maxWidth: "400px"}}>
        <AlertTitle>Paypal Unavailable</AlertTitle> 
        Paypal payment is unavailable. Please use another payment method.
      </Alert>
    </div> 
  )
}

export default PaypalPayment;  