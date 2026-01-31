import { useMemo, } from "react";
import { useSearchParams } from "react-router-dom"; 

export const usePaginationandSorting = (defaultSortBy = "id", defaultSortOrder = "asc") => { 
const [searchParams, setSearchParams] = useSearchParams();
const urlSortBy = searchParams.get("sortBy") || defaultSortBy; 
const urlSortOrder = searchParams.get("sortOrder") || defaultSortOrder;  
const sortModel = useMemo(() =>{
  const field = (urlSortBy === "categoryId" || urlSortBy === "userId") ? "id" : urlSortBy;
  return [{field, sort: urlSortOrder}]; 
}, [urlSortBy, urlSortOrder]);

const urlPage = Number(searchParams.get("pageNumber")) || 0;
const urlPageSize = Number(searchParams.get("pageSize")) || 10; 

const updateURL = (updates) => {
  const params = new URLSearchParams(searchParams);
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
  });

  setSearchParams(params);
};

const handlePaginationChange = (paginationModel) => {
  const newPageSize = paginationModel.pageSize;
  const isPageSizeChanged = newPageSize !== urlPageSize; 

  const page = isPageSizeChanged ? 0 : paginationModel.page; 

  updateURL({pageNumber: page.toString(), pageSize: newPageSize.toString()}); 
};

const handleSortModelChange = (model) => {
  const params = new URLSearchParams(searchParams);
  const currentSortOrder = searchParams.get("sortOrder") || "asc";
  let nextSortOrder = currentSortOrder == "asc" ? "desc" : "asc";

  if (model?.length > 0) {
  updateURL({sortBy: model[0].field, sortOrder: nextSortOrder});
  } 
  else {
  updateURL({sortBy: defaultSortBy, sortOrder: defaultSortOrder}); 
  }
  params.set("pageNumber", "0"); 
};

  return {
    handlePaginationChange,
    handleSortModelChange,
    urlPage: urlPage,
    urlPageSize: urlPageSize, 
    sortModel: sortModel
  };
}; 