import { useEffect } from "react";
import { useDispatch, } from "react-redux";
import { fetchCategories } from "../store/actions";
import useQueryBuilder from "./useQueryBuilder";

const useCategoryFilter = () => {

  const dispatch = useDispatch(); 

  const { queryString, searchParams } = useQueryBuilder("categoryId");

  useEffect(() => {
    dispatch(fetchCategories(queryString));
  }, [dispatch, searchParams, queryString]);  
};

export default useCategoryFilter;