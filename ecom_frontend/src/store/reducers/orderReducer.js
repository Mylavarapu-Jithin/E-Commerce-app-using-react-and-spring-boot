const initialState = {
  adminOrders: null,
  pagination: {},
}

const orderReducer = (state = initialState, action) => {
  switch(action.type) {
    case "GET_ORDERS":
      return {
        ...state, adminOrders: action.payload,
        pagination: {
          ...state.pagination,
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        }
      };
    default:
      return state; 
  }
}; 

export default orderReducer; 