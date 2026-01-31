import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../store/actions";
import useQueryBuilder from "./useQueryBuilder";

const useProductFilter = (isSeller = false, isAdmin = false) => {

  const dispatch = useDispatch(); 

  const { queryString, searchParams } = useQueryBuilder("specialPrice"); 

  useEffect(() => {
    dispatch(fetchProducts(queryString, isAdmin, isSeller));     
  }, [dispatch, searchParams, isAdmin, isSeller, queryString]);  
};

export default useProductFilter;  