/* eslint-disable no-case-declarations */
const initialState = {
  cart: [],
  totalPrice: 0, 
  cartId: null,
  isCartDirty: false,
}

const calculateTotalPrice = (cart) =>
  cart.reduce(
    (acc, item) => acc + Number(item?.specialPrice) * Number(item?.quantity),
    0
  ); 

const cartReducer = (state = initialState, action) => {
  switch(action.type) {
    case "ADD_CART":
      // eslint-disable-next-line no-case-declarations
      const productToAdd = action.payload;
      const existingProduct = state?.cart?.find((item) => 
        item.productId === productToAdd.productId); 
      if(existingProduct) {
        const updatedCart = state.cart.map((item) => {
          if(item.productId === productToAdd.productId) { 
            return productToAdd;   
          } else {
            return item;
          }
        }); 
        return {
          ...state, cart: updatedCart, totalPrice: calculateTotalPrice(updatedCart), isCartDirty: true,
        }; 
      } else {
        const newCart = [...state.cart, productToAdd]; 
        return {
          ...state,
          cart: newCart,  totalPrice: calculateTotalPrice(newCart), isCartDirty: true,
        }; 
      }
      case "REMOVE_CART":
        const updatedCart = state.cart.filter(item => item.productId !== action.payload.productId);
        return {
          ...state, 
          cart: updatedCart, totalPrice: calculateTotalPrice(updatedCart), isCartDirty: true,
        }
      case "GET_USER_CART_PRODUCTS":
        return {
          ...state, 
          cart: action.payload, totalPrice: action.totalPrice, cartId: action.cartId, isCartDirty: false,
        }  
      case "CLEAR_CART":
        return {
          ...state, cart: [], totalPrice: 0, cartId: null,
        }  
      case "CART_SYNC_SUCCESS": 
      return {
        ...state, isCartDirty: false, 
      }  
      default:
        return state; 
  }    
}; 

export default cartReducer; 