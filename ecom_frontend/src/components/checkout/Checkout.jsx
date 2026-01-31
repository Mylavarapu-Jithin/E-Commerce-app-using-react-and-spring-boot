import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import AddressInfo from "./AddressInfo";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses } from "../../store/actions";
import toast from "react-hot-toast";
import Skeleton from "../shared/Skeleton";
import ErrorPage from "../shared/ErrorPage";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import StripePayment from "./StripePayment";
import PaypalPayment from "./PaypalPayment";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);   
  const { address, selectedUserCheckoutAddress } = useSelector(state => state.auth);   
  const { cart, totalPrice } = useSelector(state => state.carts); 
  const {isLoading, errorMessage} = useSelector(state => state.errors);   
  const dispatch = useDispatch(); 
  const { paymentMethod } = useSelector(state => state.payment);  
  console.log("totalPricefg: ",totalPrice); 

  useEffect(() => {
    dispatch(getUserAddresses());    
  }, [dispatch]);   

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);  
  }

  const handleNext = () => {
    if(activeStep === 0 && !selectedUserCheckoutAddress?.addressId) {
      toast.error("Please select checkout Address before proceeding."); 
      return;
    }
    if(activeStep === 1 && !paymentMethod) {
      toast.error("Please select payment method before proceeding."); 
      return;
    }
    setActiveStep(prevStep => prevStep + 1); 
  }

  const steps = [
    "Address",
    "Payment Method",
    "Order Summary",
    "Payment",
  ]; 

  return (
    <div className='py-14 min-h-[calc(100vh-100px)]'> 
      <Stepper activeStep={activeStep} alternativeLabel>   
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>         
          </Step>
        ))}
      </Stepper>

      {isLoading ? (
        <div className='lg:w-[80%] mx-auto py-5'>   
          <Skeleton />  
        </div>
      ) : (
        <div className='mt-5'>
          {activeStep === 0 && <AddressInfo address={address} /> }        
          {activeStep === 1 && <PaymentMethod /> }    
          {activeStep === 2 && <OrderSummary address={selectedUserCheckoutAddress} totalPrice={totalPrice} cart={cart} paymentMethod={paymentMethod} /> }   
          {activeStep === 3 && (paymentMethod === "Stripe" ? <StripePayment /> : <PaypalPayment /> )}     
        </div>
      ) }

      <div className='flex justify-between items-center px-4 fixed z-50 h-24 bottom-0 bg-white left-0 w-full'
          style={{boxShadow: "0 -2px 4px rgba(100, 100, 100, 0.15)"}}> 
          <div>
            {activeStep !== 0 && (
            <Button variant='outlined' disabled={activeStep === 0} onClick={handleBack} sx={{
              fontWeight: 'semibold', backgroundColor: 'blue',
              px: 3,
              height: 40,
              borderRadius: 1,
              color:'white',
              cursor: 'pointer', '&:disabled':{backgroundColor: 'gray-400', color: 'white', cursor: 'not-allowed !important'}
            }} >    
              Back
            </Button>  
            )
            }
          </div>     

          <div>
            {activeStep !== steps.length - 1 && (
            <Button disabled={
              errorMessage || (activeStep === 0 ? !selectedUserCheckoutAddress?.addressId : activeStep === 1 ? !paymentMethod : false)
            } sx={{
              fontWeight: 'semibold', backgroundColor: 'blue',
              px: 3, height: 40,
              borderRadius: 1, color:'white',
              cursor: 'pointer', 
              opacity: errorMessage || 
              (activeStep === 0 && !selectedUserCheckoutAddress?.addressId) || (activeStep === 1 && !paymentMethod) ? "0.6" : "",
              '&:disabled':{backgroundColor: 'gray-400', color: 'white', cursor: 'not-allowed !important'}
            }} onClick={handleNext}>   
              Proceed   
            </Button> 
            )}  
          </div> 
        </div>  
      {errorMessage && <ErrorPage message={errorMessage} /> } 
    </div> 
  ); 
}; 

export default Checkout; 