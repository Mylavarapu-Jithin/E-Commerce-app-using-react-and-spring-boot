import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSellersForAdminDashboard } from "../store/actions";
import useQueryBuilder from "./useQueryBuilder";

const useSellersFilter = () => {
  const dispatch = useDispatch(); 

  const { queryString, searchParams } = useQueryBuilder("userId"); 

  useEffect(() => {
    dispatch(getSellersForAdminDashboard(queryString)); 
  }, [dispatch, searchParams, queryString]);  
};

export default useSellersFilter;