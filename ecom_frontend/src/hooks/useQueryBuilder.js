import { useSearchParams } from "react-router-dom";

const useQueryBuilder = (defaultSortBy = "id") => {
  const [searchParams] = useSearchParams();

  const pageNumber = searchParams.get("pageNumber") || "0";
  const pageSize = searchParams.get("pageSize") || "10";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const searchBy = searchParams.get("searchBy") || "";

  let sortBy = searchParams.get("sortBy") || defaultSortBy;
  if (sortBy === "id") {
    sortBy = defaultSortBy === "categoryId" ? "categoryId" : "userId";
  }

  const apiParams = new URLSearchParams();
  apiParams.set("pageNumber", pageNumber);
  apiParams.set("pageSize", pageSize);
  apiParams.set("sortBy", sortBy);
  apiParams.set("sortOrder", sortOrder);

  if (keyword) apiParams.set("keyword", keyword);
  if (category) apiParams.set("category", category);
  if (searchBy) apiParams.set("searchBy", searchBy);

  return {
    queryString: apiParams.toString(),
    searchParams
  };
}; 

export default useQueryBuilder; 