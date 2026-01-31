import { useEffect } from "react";
import { useDispatch, } from "react-redux";
import { useLocation,} from "react-router-dom";
import { getOrdersForDashboard } from "../store/actions";
import { useAuthStatus } from "./useAuthStatus";
import useQueryBuilder from "./useQueryBuilder";

const useOrderFilter = () => {
  const dispatch = useDispatch();
  
  const { isAdmin, isSeller } = useAuthStatus(); 
  const ordersPlacedByUser = useLocation().pathname === '/profile/orders'; 

  const { queryString, searchParams } = useQueryBuilder("totalAmount"); 

  useEffect(() => {
    dispatch(getOrdersForDashboard(queryString, isAdmin, isSeller, ordersPlacedByUser));
  }, [dispatch, isAdmin, searchParams, isSeller, ordersPlacedByUser, queryString]);  
};

export default useOrderFilter;