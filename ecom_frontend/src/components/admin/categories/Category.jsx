import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../store/actions';
import { FaBars } from 'react-icons/fa';
import CategoryTable from './CategoryTable';

const Category = () => {

  const { categories, categoryPagination } = useSelector(state => state.products);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false); 
  const dispatch = useDispatch();

  useEffect(() => {
    if(!categories || categories?.length === 0) {
      dispatch(fetchCategories()); 
    }
  }, [dispatch, categories?.length, categories]); 

  return (
    <div className='flex flex-col items-center justify-center px-2 md:px-4 xl:px-6 py-3'> 
      <div className='w-full flex justify-end pr-2 pt-2 pb-4'>
        <button onClick={() => setOpenAddCategoryModal(true)}
        className='flex items-center justify-center gap-2 bg-custom-blue rounded-md text-sm sm:text-base md:text-xl px-2 sm:px-3 py-1 cursor-pointer hover:bg-blue-500'> 
          <FaBars className='text-lg text-white' />
          <span className='text-white'>Add Category</span>    
        </button> 
      </div>  
      <CategoryTable adminCategories={categories} categoryPagination={categoryPagination} openAddCategoryModal={openAddCategoryModal} setOpenAddCategoryModal={setOpenAddCategoryModal}  />   
    </div>
  )
}

export default Category; 