import { Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Filter = ({categories, isAdmin = false, onlySearch = false, searchPlaceHolder, searchByOptions}) => {

  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams); 
  const pathname = useLocation().pathname;
  const isProfileOrders = pathname === '/profile/orders'; 
  const searchByDropDown = ['/profile/orders', '/admin/orders'].includes(pathname);
  const navigate = useNavigate(); 

  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [pageSize, setPageSize] = useState(10); 
  const [searchBy, setSearchBy] = useState("EMAIL");

  useEffect(() => {
    const currentCategory = searchParams.get("category") || "all";
    const currentSortOrder = searchParams.get("sortOrder") || "asc";
    const currentSearchTerm = searchParams.get("keyword") || "";  
    const currentPageSize = searchParams.get("pageSize") || 10; 
    const currentSearchBy = searchParams.get("searchBy") || "EMAIL"; 

    setCategory(currentCategory);
    setSortOrder(currentSortOrder);
    setSearchTerm(currentSearchTerm); 
    setPageSize(currentPageSize);  
    setSearchBy(currentSearchBy); 
  }, [searchParams]); 

  useEffect(() => {
    const handler = setTimeout(() => {
      if(searchTerm) {
        searchParams.set("keyword", searchTerm);  
      }  
      else {
        searchParams.delete("keyword");  
      }
      navigate(`${pathname}?${searchParams.toString()}`);    
    }, 700);

    return () => {
      clearTimeout(handler); 
    }
  }, [searchTerm, searchParams, navigate, pathname]); 

  const currentLabel = searchByOptions?.find(opt => opt.value === searchBy)?.label || "Email";

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    if(selectedCategory === "all") {
      params.delete("category");
    }
    else {
      params.set("category", selectedCategory);   
    }
    navigate(`${pathname}?${params}`); 

    setCategory(event.target.value);  
  };

  const handlePageSizeChange = (event) => {  
  const selectedSize = event.target.value; 

  if(selectedSize === 10) {
    params.delete("pageSize");   
  }
  else {
    params.set("pageSize", selectedSize);
  }
  navigate(`${pathname}?${params}`);

  setPageSize(selectedSize); 
};

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => {
      const newOrder = (prevOrder === "asc") ? "desc" : "asc";
      params.set("sortOrder", newOrder);
      navigate(`${pathname}?${params}`);
      return newOrder;
    })
  }; 

  const handleSearchByChange = (event) => {
    const val = event.target.value;
    params.set("searchBy", val);
    navigate(`${pathname}?${params.toString()}`);
    setSearchBy(val);
  };

  const handleClearFilters = () => {
    navigate({pathname: window.location.pathname});   
  }

  return (
    <div className={`${isProfileOrders ? 'mx-6 pt-4' : 'mx-0'} flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4`}> 
      {/* SEARCH BAR */} 
        <div className='relative flex items-center 2xl:w-[450px] sm:w-[420px] w-full gap-4'> 
          <input 
              type='text'
              placeholder={searchPlaceHolder ? searchPlaceHolder : `Search By ${currentLabel}`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='border border-gray-400 text-slate-800 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-[#1976d2]' /> 
          <FiSearch className='absolute left-3 text-slate-800' size={20} />   

          {/* DROP DOWN FOR ORDERS PAGE */} 
          {(searchByDropDown && searchByOptions) &&
            <FormControl variant="outlined" size="small" className="w-full sm:w-40"> 
              <InputLabel id="search-by-label">Search By</InputLabel>
              <Select
              labelId="search-by-label"
              value={searchBy}
              onChange={handleSearchByChange}
              label="Search By"
              className="bg-white"
              >
                {searchByOptions?.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem> 
                ))}
              </Select>
            </FormControl>
          }
        </div> 

      {(isAdmin || onlySearch) || 
        <div>
          <FormControl variant="outlined" size="small">
            <InputLabel id="page-size-select-label">Page Size</InputLabel>
            <Select
              labelId="page-size-select-label"
              className="min-w-[120px] text-slate-800 border-slate-700"
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Page Size"
            >
              <MenuItem value={10}>10 products</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={6}>6</MenuItem>  
              <MenuItem value={9}>9</MenuItem>      
            </Select>
          </FormControl>    
        </div>
      }

      {/* CATEGORY SELECTION */} 
      <div className='flex sm:flex-row flex-col gap-4 items-center'> 
        {!(!categories && onlySearch) &&
          <FormControl
          variant="outlined" size="small" > 
            <InputLabel id="category-select-label">Category</InputLabel> 
            <Select labelId="category-select-label" className='min-w-[120px] text-slate-800 border-slate-700'
            value={category} onChange={handleCategoryChange} label="Category">
              <MenuItem value="all">All</MenuItem>  
              {
                categories.map(item => (
                  <MenuItem key={item.categoryId} value={item.categoryName}>{item.categoryName}</MenuItem>     
                ))
              }
            </Select> 
          </FormControl>  
        }

        {/* SORT BUTTON, CLEAR FILTER */ }
        {(isAdmin || onlySearch) ||
          <Tooltip title={sortOrder === "asc" ? "Sorted By price: asc" : "Sorted By price: desc"}>
            <Button variant="contained" onClick={toggleSortOrder} color="primary" className="flex items-center gap-2 h-10"> 
              Sort By
              {
                sortOrder === "asc" ? (<FiArrowUp size={20} />) : (<FiArrowDown size={20} />) 
              }
            </Button> 
          </Tooltip> 
        }
 
          <button className="flex items-center gap-2 bg-rose-900 text-white px-3 py-2 cursor-pointer rounded-md transition duration-300 ease-in shadow-md focus:outline-none" onClick={handleClearFilters}> 
            <FiRefreshCw className='font-semibold size={16}' /> 
            <span className='font-semibold'>Clear Filter</span>    
          </button> 
      </div> 
    </div>
  ); 
}

export default Filter; 