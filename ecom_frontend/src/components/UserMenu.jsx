import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaShoppingCart, FaUser, } from "react-icons/fa";
import BackDrop from "./BackDrop";
import { logOutUser } from "../store/actions";

const UserMenu = () => {
  const { user } = useSelector(state => state.auth); 
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN"); 
  const isSeller = user && user?.roles?.includes("ROLE_SELLER");
  const [anchorEl, setAnchorEl] = useState(null); 
  const { profile } = useSelector(state => state.profile);
  const imageUrl = profile?.imageUrl;
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);    
  };

  const logOutHandler = () => {
    dispatch(logOutUser(navigate));    
  }; 

  return (
    <div className='relative z-30'>  
      <div className='sm:border-[1px] sm:border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700'  
        onClick={handleClick}
      >
        <Avatar src={imageUrl} /> 
      </div>
      <Menu
        sx={{ width: "400px", }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
         slotProps={{
          list: {
            sx: {
              width: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',        
            },
          },
  }}
      >
        <Link to='/profile'>
          <MenuItem className='flex gap-2' onClick={handleClose}> 
            <BiUser className='text-xl ' /> 
            <span className='font-bold text-[19px]'>{user?.username}</span>  
          </MenuItem> 
        </Link>

        <Link to='/profile/orders'>
          <MenuItem className='flex gap-2' onClick={handleClose}>
            <FaShoppingCart className='text-xl' /> 
            <span className='font-semibold text-[16px]'>Order</span>      
          </MenuItem> 
        </Link>

        {(isAdmin || isSeller) && <Link to={isAdmin ? '/admin' : '/admin/orders'} > 
          <MenuItem className='flex gap-2' onClick={handleClose}> 
            <FaUser className='text-xl' />
            <span className='font-semibold text-[16px]'>
              {isAdmin ? "Admin Panel" : "Seller Panel"} 
            </span>       
          </MenuItem> 
        </Link> 
        } 

          <MenuItem onClick={logOutHandler}>
            <div className='flex gap-2 font-semibold w-full items-center bg-button-gradient px-4 py-1 text-white rounded-sm'>
              <RiLogoutCircleLine className='text-xl' />   
              <span className='font-semibold text-[16px]'>Logout</span>         
            </div>
          </MenuItem> 
      </Menu>
      {
        open && <BackDrop />     
      }
    </div>
  ); 
}; 

export default UserMenu; 