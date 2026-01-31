import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch, } from "react-redux";
import { updateOrderStatusFromDashboard } from "../../../store/actions";
import toast from "react-hot-toast";
import ModalButton from "../../shared/ModalButton";
import { useAuthStatus } from "../../../hooks/useAuthStatus";

const ORDER_STATUSES = [
  "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Accepted"
]

const UpdateOrderForm = ({ setOpen, selectedId, selectedItem, loader, setLoader }) => {
  const [orderStatus, setOrderStatus] = useState(selectedItem?.status || "Accepted");
  const [error, setError] = useState("");
  const dispatch = useDispatch(); 

  const { isAdmin, isSeller } = useAuthStatus();

  const updateOrderStatus = (e) => {
    e.preventDefault(); 
    if(!orderStatus) {
      setError("Order status is required"); 
      return; 
    }
    dispatch(updateOrderStatusFromDashboard(isAdmin, isSeller, selectedId, orderStatus, toast, setLoader, setOpen)); 
  }; 

  return (
    <div className='py-5 relative h-full'>
      <form className='space-y-4' onSubmit={updateOrderStatus}> 
        <FormControl fullWidth variant='outlined' error={!!error}> 
          <InputLabel id="order-status-label">Order Status</InputLabel>
          <Select labelId='order-status-label' label='Order Status' value={orderStatus} onChange={(e) => {
            setOrderStatus(e.target.value); 
          }}>
            {
              ORDER_STATUSES.map(status => (
                <MenuItem key={status} value={status}>  
                  {status} 
                </MenuItem> 
              )) 
            }
          </Select> 
          {error && <FormHelperText>{error}</FormHelperText> } 
        </FormControl> 
        
        <ModalButton loader={loader} setOpen={setOpen} update /> 
      </form> 
    </div>
  )
}

export default UpdateOrderForm; 