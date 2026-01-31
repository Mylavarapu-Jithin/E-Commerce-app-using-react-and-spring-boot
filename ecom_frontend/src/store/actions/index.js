
import toast from 'react-hot-toast';
import api from '../../api/api'
import { toastStyles } from '../../utils/toastStyles';
import { FaBullseye } from 'react-icons/fa';

export const fetchProducts = (queryString, isAdmin = false, isSeller = false) => async (dispatch) => {
  try {
    dispatch({type: 'IS_FETCHING'});
    const endpoint = isAdmin ? '/admin/products' : isSeller ? '/seller/products' : '/public/products';
    const fullURL = queryString && queryString.trim() !== "" ? `${endpoint}?${queryString}` : endpoint;
    const { data } = await api.get(fullURL); 
    console.log(data); 
    dispatch({
      type: 'FETCH_PRODUCTS',
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,     
      totalPages: data.totalPages,
      lastPage: data.lastPage, 
    });
    dispatch({type: 'IS_SUCCESS'});
  } catch (error) {
    dispatch({type: 'IS_ERROR',
      payload: error?.response?.data?.message || "Failed to fetch Products",      
    });
  }
}; 

export const fetchCategories = (queryString) => async (dispatch) => {
  try {
    dispatch({type: 'CATEGORY_LOADER'});
    const { data } = await api.get(`/public/categories?${queryString}`);  
    console.log(data);
    dispatch({
      type: 'FETCH_CATEGORIES',
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage, 
    });
    dispatch({type: 'CATEGORY_SUCCESS'});
  } catch (error) {
    dispatch({type: 'IS_ERROR',
      payload: error?.response?.data?.message || "Failed to fetch Categories", 
    });
  }
}; 

export const addToCart = (data, qty = 1, toast) => (dispatch, getState) => {

  const { products } = getState().products; 
  const getProduct = products.find(item => item.productId === data.productId);   

  const isQuantityExist = getProduct.quantity >= qty; 
  if(isQuantityExist) {
    dispatch({type: 'ADD_CART', payload: {...data, quantity: qty}});   
    toast.success(`${data?.productName} added to the cart`, toastStyles());  
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));   
  } 
  else {
    toast.error("Out of stock");     
  } 
};  

export const increaseCartQuantity = (data, toast, currentQuantity, setCurrentQuantity) => (dispatch, getState) => {
  const { products } = getState().products;  
  const getProduct = products.find(item => item.productId === data.productId);  

  const isQuantityExist = getProduct.quantity >= currentQuantity + 1;  

  if(isQuantityExist) {
    const newQuantity = currentQuantity + 1;    
    setCurrentQuantity(newQuantity);      
    dispatch({
      type: 'ADD_CART', 
      payload: {...data, quantity: newQuantity}, 
    });  
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart)); 
  }
  else {
    toast.error("Quantity reached to Limit");   
  }
}; 

export const decreaseCartQuantity = (data, newQuantity) => (dispatch, getState) => { 
  dispatch({
    type: 'ADD_CART',
    payload: {...data, quantity: newQuantity},     
  }); 
  localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart)); 
}; 

export const removeFromCart = (data, toast) => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_CART',
    payload: data,
  }); 
  toast.success(`${data.productName} removed from cart`, toastStyles());  
  localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));  
}; 

export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
  try {
    setLoader(true); 
    const { data } = await api.post(`/auth/signin`, sendData);        
    dispatch({type:"LOGIN_USER", payload: data}); 
    localStorage.setItem("auth", JSON.stringify(data));
    toast.success("Login Success", toastStyles());  
    reset();
    navigate("/");       
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to Login");   
  }
  finally {
    setLoader(false);      
  }
}; 

export const registerNewUser = (sendData, toast, reset, navigate, setLoader) => async () => {
  try {
    setLoader(true); 
    const { data } = await api.post(`/auth/signup`, sendData);        
    reset();
    toast.success(data?.message || "User Registered Successfully", toastStyles());     
    navigate("/login");       
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to Register an account");      
  }
  finally {
    setLoader(false);       
  }
}; 

export const logOutUser = (navigate) => async (dispatch) => { 
  dispatch({type: 'LOG_OUT'}); 
  localStorage.removeItem("auth");    
 // await api.post(`/auth/signout`);    
  navigate("/")
};  

export const addUpdateUserAddress = (sendData, toast, addressId, setOpenAddressModal) => async (dispatch, getState) => {
  
  //const {user} = getState().auth;   
  dispatch({type:"BUTTON_LOADER"});
  try { 
    if(addressId) {
      await api.put(`/addresses/${addressId}`, sendData);  
    } else {
      await api.post(`/addresses`, sendData);  
    } 
    dispatch(getUserAddresses()); 
    dispatch({type: "IS_SUCCESS"});       
    toast.success("Address saved Successfully", toastStyles());             
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to Save Address");    
    dispatch({type:"IS_ERROR", payload: null}); 
  }
  finally {
    setOpenAddressModal(false);  
  } 
}; 

export const getUserAddresses = () => async (dispatch, getState) => {
  try {
    dispatch({type: 'IS_FETCHING'});
    const { data } = await api.get(`users/addresses`);  
    dispatch({type:"USER_ADDRESS", payload: data});   
    dispatch({type:"IS_SUCCESS"}); 
  } catch (error) {
    dispatch({type: 'IS_ERROR',
      payload: error?.response?.data?.message || "Failed to fetch user's addresses",    
    });    
  }  
};

export const selectUserCheckoutAddress = (address) => {
  localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address)); 
  
  return {
    type: "SELECT_CHECKOUT_ADDRESS",  
    payload: address, 
  }
}; 

export const deleteUserAddresses = (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
  try {
    dispatch({type: 'BUTTON_LOADER'});
    await api.delete(`addresses/${addressId}`);  
    dispatch({type:"IS_SUCCESS"}); 
    dispatch(getUserAddresses()); 
    if(addressId === getState().auth.selectedUserCheckoutAddress?.addressId) {
      dispatch(clearCheckoutAddress()); 
    }

    toast.success("Address deleted successfully", toastStyles());  
  } catch (error) {
    dispatch({type: 'IS_ERROR',
      payload: error?.response?.data?.message || "Failed to delete address",    
    });    
  }  
  finally {
    setOpenDeleteModal(false); 
  }
};

export const clearCheckoutAddress = () => {
  return {
    type: "REMOVE_CHECKOUT_ADDRESS",
  };
}

export const addPaymentMethod = (method) => {
  return {
    type: "ADD_PAYMENT_METHOD",  
    payload: method, 
  }; 
};

export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
  try {
    dispatch({type: 'IS_FETCHING'});
    await api.post(`/cart/create`, sendCartItems);
    dispatch({ type: 'CART_SYNC_SUCCESS' }); // ✅ correct place
    dispatch({ type: 'IS_SUCCESS' });
   // await dispatch(getUserCart()); 
  } catch (error) {
    dispatch({type: 'IS_ERROR',
      payload: error?.response?.data?.message || "Failed to create cart items",     
    });    
  }  
};

export const getUserCart = () => async (dispatch, getState) => {
  try {
    dispatch({type: 'IS_FETCHING'});
    const {data} = await api.get(`/carts/users/cart`);
    
    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: data.products,
      totalPrice: data.totalPrice, 
      cartId: data.cartId,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart)); 
    
    dispatch({type: "IS_SUCCESS"});
  } catch (error) {
    dispatch({type: 'IS_ERROR',
      payload: error?.response?.data?.message || "Failed to get user's cart",    
    });    
  }  
};

export const createStripePaymentSecret = (sendData) => async (dispatch, getState) => {
  try {
    dispatch({type:"IS_FETCHING"}) 
    const { data } = await api.post(`/order/stripe-client-secret`, sendData);  
    dispatch({type: "CLIENT_SECRET", payload: data});
    localStorage.setItem("client-secret", JSON.stringify(data));  
    dispatch({type: "IS_SUCCESS"});       
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to create client secret"); 
  } 
};

export const stripePaymentConfirmation = (sendData, setErrorMessage, setLoading, toast) => async (dispatch, getState) => {
  try {
    setLoading(true); 
    const response = await api.post(`/order/users/payments/online`, sendData);   
    console.log(response);       
    if(response?.data) {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("client-secret"); 
        localStorage.removeItem("CHECKOUT_ADDRESS"); 
        dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS" }); 
        dispatch({ type: "CLEAR_CART" }); 
        toast.success("Order Accepted", toastStyles()); 
    } else {
      setErrorMessage("Payment Failed Please try again later."); 
    }  
  } catch(error) {
    setErrorMessage("Payment Failed Please try again later."); 
  }  
  finally {
    setLoading(false); 
  }
};

export const analyticsAction = () => async (dispatch, getState) => {
  try {
    dispatch({type: "IS_FETCHING"});
    const { data } = await api.get('/admin/app/analytics');
    dispatch({
      type: "FETCH_ANALYTICS",
      payload: data,
    });
    dispatch({type: "IS_SUCCESS"});
  }
  catch(error) {
    dispatch({type: "IS_ERROR", payload: error?.response?.data?.message || "Failed to fetch analytics data"}); 
  }
};


export const getOrdersForDashboard = (queryString, isAdmin, isSeller, ordersPlacedByUser = false) => async (dispatch) => {
  try {
    const endpoint = ordersPlacedByUser ? '/user/orders' : isAdmin ? '/admin/orders' : '/seller/orders'; 
    dispatch({type: 'IS_FETCHING'});
    const { data } = await api.get(`${endpoint}?${queryString}`); 
    console.log(data);
    dispatch({
      type: 'GET_ORDERS',
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,     
      totalPages: data.totalPages,
      lastPage: data.lastPage, 
    });
    dispatch({type: 'IS_SUCCESS'});
  } catch (error) {
    dispatch({type: 'IS_ERROR',
      payload: error?.response?.data?.message || "Failed to fetch Products",      
    });
  }
};

export const updateOrderStatusFromDashboard = (isAdmin, isSeller, orderId, orderStatus, toast, setLoader, setUpdateOpenModal) => async (dispatch) => {
  try { 
    const endpoint = isAdmin ? '/admin' : '/seller';
    setLoader(true); 
    const { data } = await api.put(`${endpoint}/orders/${orderId}/status`, {status: orderStatus}); 
    const queryString = window.location.search.substring(1);
    await dispatch(getOrdersForDashboard(queryString, isAdmin, isSeller));      
    toast.success(`Order Updated to ${orderStatus}`, toastStyles());             
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to Update Order Status", toastStyles());    
  }
  finally {
    setLoader(false);  
    setUpdateOpenModal(false);  
  } 
};

export const updateProductFromDashboard = (sendData, isSeller, toast, reset, setLoader, setOpen) => async (dispatch) => {
  try {
    const endpoint = isSeller ? '/seller' : '/admin';
    setLoader(true);
    await api.put(`${endpoint}/products/${sendData?.id}`, sendData);
    const searchPath = window.location.search;
    const queryString = searchPath.startsWith('?') ? searchPath.substring(1) : searchPath;
    await dispatch(fetchProducts(queryString, false, isSeller)); 
    toast.success("Product update successful", toastStyles()); 
    reset();
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to update product"); 
  } finally {
    setLoader(false); 
    setOpen(false); 
  }
}; 

export const addNewProductFromDashboard = (sendData, isSeller, categoryId, toast, reset, setLoader, setOpen) => async (dispatch) => {
  try {
    const endpoint = isSeller ? '/seller' : '/admin';
    setLoader(true); 
    await api.post(`${endpoint}/categories/${categoryId}/product`, sendData); 
    const searchPath = window.location.search;
    const queryString = searchPath.startsWith('?') ? searchPath.substring(1) : searchPath;
    await dispatch(fetchProducts(queryString, false, isSeller)); 
    toast.success("Product added successfully", toastStyles()); 
    reset(); 
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to add Product"); 
  } finally {
    setOpen(false);
    setLoader(false); 
  }
}; 

export const deleteProduct = (setLoader, isSeller, productId, toast, setOpenDeleteModal) => async (dispatch) => {
  try {
    const endpoint = isSeller ? '/seller' : '/admin';
    setLoader(true);
    await api.delete(`${endpoint}/products/${productId}`);
    toast.success("Product deleted successfully", toastStyles()); 
    const searchPath = window.location.search;
    const queryString = searchPath.startsWith('?') ? searchPath.substring(1) : searchPath;
    await dispatch(fetchProducts(queryString, false, isSeller)); 
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to delete product"); 
  } finally {
    setLoader(false);
    setOpenDeleteModal(false); 
  }
}; 

export const updateProductImageFromDashboard = (formData, isSeller, productId, setLoader, toast, setOpen) => async (dispatch) => {
  try {
    const endpoint = isSeller ? '/seller' : '/admin';
    setLoader(true);
    await api.put(`${endpoint}/products/${productId}/image`, formData);
    toast.success("Updated product image successfully", toastStyles());
    const searchPath = window.location.search;
    const queryString = searchPath.startsWith('?') ? searchPath.substring(1) : searchPath;
    await dispatch(fetchProducts(queryString, false, isSeller)); 
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to update product image");  
  } finally {
    setLoader(false);
    setOpen(false); 
  }
}; 

export const addCategoryFromDashboard = (category, setLoader, toast, setOpen, reset) => async (dispatch) => {
  try {
    setLoader(true);
    const { data } = await api.post(`/admin/categories`, category);
    toast.success(`Category ${category?.categoryName} added successfully`, toastStyles()); 
    reset(); 
    await dispatch(fetchCategories()); 
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to add new Category");  
  } finally {
    setLoader(false);
    setOpen(false);
  }
};

export const updateCategoryFromDashboard = (category, categoryId ,setLoader, toast, setOpen, reset) => async (dispatch) => {
  try {
    setLoader(true); 
    const { data } = await api.put(`/admin/categories/${categoryId}`, category);
    toast.success(`Category ${category?.categoryName} updated successfully`, toastStyles());
    reset();
    await dispatch(fetchCategories());
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to update Category"); 
  } finally {
    setLoader(false);
    setOpen(false); 
  }
}; 

export const deleteCategoryFromDashboard = (category, setLoader, toast, setOpen) => async (dispatch) => {
  try {
    setLoader(true);
    const categoryId = category.id;
    const { data } = await api.delete(`/admin/categories/${categoryId}`); 
    toast.success(`Category ${category?.categoryName} deleted successfully`, toastStyles()); 
    await dispatch(fetchCategories()); 
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to delete Category");  
  } finally {
    setLoader(false);
    setOpen(false); 
  }
}; 

export const getSellersForAdminDashboard = (queryString) => async (dispatch) => {
  try {
    const { data } = await api.get(`/auth/sellers?${queryString}`); 
    dispatch({
      type: 'FETCH_SELLERS',
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,     
      totalPages: data.totalPages,
      lastPage: data.lastPage, 
    }); 
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to get sellers List"); 
  }
};

export const addSellerFromAdminDashboard = (sendData, setLoader, reset, toast, setOpen) => async (dispatch) => {
  try {
    setLoader(true);
    const { data } = await api.post(`/auth/signup`, sendData);
    const queryString = window.location.search.substring(1);
    await dispatch(getSellersForAdminDashboard(queryString));
    toast.success(`User registered successfully as ${sendData.username}`);
    reset();
  } catch(error) {
    toast.error(error?.response?.data?.message || "Failed to register user"); 
  } finally {
    setLoader(false);
    setOpen(false);
  }
};

export const getUserProfile = (isAdmin, isSeller) => async (dispatch) => {
  try {
    const endpoint = isAdmin ? '/admin/profile' : isSeller ? '/seller/profile' : '/profile/user'; 
    dispatch({type: 'PROFILE_FETCHING'});
    const { data } = await api.get(`${endpoint}`); 
    dispatch({
      type: 'GET_USER_PROFILE',
      payload: data,
    });
    dispatch({type: 'PROFILE_FETCHED'});
  } catch (error) {
    dispatch({type: 'PROFILE_FETCH_ERROR',
      payload: error?.response?.data?.message || "Failed to get User Profile",      
    });
  }
};

export const updateProfileImage = (formData, onSuccess) => async (dispatch) => {
  try {

    const { data } = await api.post('/profile/image/upload', formData);

    dispatch({
      type: 'UPDATE_PROFILE_SUCCESS',
      payload: data,
    });
    
    if (onSuccess) onSuccess(); 
  } catch (error) {
    dispatch({
      type: 'PROFILE_FETCH_ERROR',
      payload: error?.response?.data?.message || "Failed to upload image",
    });
  }
};

export const deleteProfileImage = () => async (dispatch) => {
  try {
    await api.delete('/profile/image');

    dispatch({type: 'DELETE_PROFILE_PICTURE',}); 
  }
  catch(error) {
    dispatch({
      type: 'PROFILE_FETCH_ERROR',
      payload: error?.response?.data?.message || "Failed to delete profile picture",
    });
  }
};
