import { FaAddressBook } from "react-icons/fa";
import Skeleton from "../shared/Skeleton";
import { useState } from "react";
import AddressInfoModal from "./AddressInfoModal";
import AddAddressForm from "./AddAddressForm";
import { useDispatch, useSelector } from "react-redux";
import AddressList from "./AddressList";
import toast from "react-hot-toast";
import { deleteUserAddresses } from "../../store/actions";
import DeleteModal from "../shared/DeleteModal";

const AddressInfo = ({address}) => {
  const noAddressExist = !address || address.length === 0; 
  const {isLoading, btnLoader} = useSelector(state => state.errors); 
  const [openAddressModal, setOpenAddressModal] = useState(false);    
  const [selectedAddress, setSelectedAddress] = useState("");  
  const [openDeleteModal, setOpenDeleteModal] = useState(false); 

  const addNewAddressHandler = () => {
    setSelectedAddress(""); 
    setOpenAddressModal(true);   
  }; 

  const dispatch = useDispatch();  

  const deleteAddressHandler = () => {
     dispatch(deleteUserAddresses(
      toast, selectedAddress?.addressId, setOpenDeleteModal
     )); 
  }; 

  return (
    <div className='pt-4'>
      {noAddressExist ? (
        <div className='p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center'>    
          <FaAddressBook size={40} className='text-gray-500 mb-4' />    
          <h1 className='text-2xl text-slate-900 font-semibold text-center mb-2'>           
            No Address added Yet 
          </h1>     
          <p className='text-slate-800 text-center mb-6'>     
            Please add your address to complete purchase    
          </p>  

          <button className='px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-200 cursor-pointer'
                  onClick={addNewAddressHandler}>    
            Add Address 
          </button>
        </div>
      ) : (
        <div className='relative p-6 rounded-lg max-w-md mx-auto'>  
          <h1 className='text-2xl text-slate-800 font-bold text-center'>    
            Select Address   
          </h1> 
          {isLoading ? (
            <div className='py-4 px-8'>   
              <Skeleton />  
            </div>
          ) : (
            <>
            <div className='space-y-4 pt-6'>   
              <AddressList addresses={address} setSelectedAddress={setSelectedAddress} setOpenAddressModal={setOpenAddressModal}
                           setOpenDeleteModal={setOpenDeleteModal} />         
            </div>   

            {address.length > 0 && (
              <div>
                 <button className='px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-200            cursor-pointer'
                  onClick={addNewAddressHandler}>      
                    Add More
                  </button>  
              </div>  
            )}
            </> 
          )}
        </div>
      )}
      <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal}>
        <AddAddressForm address={selectedAddress} setOpenAddressModal={setOpenAddressModal} />        
      </AddressInfoModal>    

      <DeleteModal open={openDeleteModal} loader={btnLoader} setOpen={setOpenDeleteModal} title="Delete Address" onDeleteHandler={deleteAddressHandler} />   
    </div>  
  ); 
}; 

export default AddressInfo; 