import React, { useState } from 'react'
import { adminCategoriesTableColumn } from '../../helper/tableColumn';
import AddCategoryForm from './AddCategoryForm';
import Modal from '../../shared/Modal';
import DeleteModal from '../../shared/DeleteModal';
import { useDispatch } from 'react-redux';
import { deleteCategoryFromDashboard } from '../../../store/actions';
import toast from 'react-hot-toast';
import useCategoryFilter from '../../../hooks/useCategoryFilter';
import GenericTable from '../../shared/GenericTable';
import { usePaginationandSorting } from '../../../hooks/usePaginationandSorting';
import { useTableActions } from '../../../hooks/useTableActions';

const CategoryTable = ({ adminCategories, categoryPagination, openAddCategoryModal, setOpenAddCategoryModal }) => {

  const [loader, setLoader] = useState(false); 

  const dispatch = useDispatch(); 

  const tableRecords = adminCategories?.map(item => {
    return {
      id: item.categoryId,
      categoryName: item.categoryName,
    }
  });

  useCategoryFilter(); 

  const { urlPage, urlPageSize, handleSortModelChange, handlePaginationChange, sortModel } = usePaginationandSorting("categoryId", "asc"); 
  const { selectedRow, activeModal, handleTableAction, closeModals } = useTableActions(); 

   const onDeleteHandler = () => {
    dispatch(deleteCategoryFromDashboard(selectedRow, setLoader, toast, closeModals));
  }

  return (
    <div className='w-full overflow-x-auto mx-auto max-w-full lg:max-w-2xl xl:max-w-3xl'> 
      <h1 className='uppercase text-center font-semibold text-3xl py-4'>All Categories</h1>    
      <div className='max-w-full' > 
        <GenericTable tableRecords={tableRecords} 
                      tableColumns={adminCategoriesTableColumn(handleTableAction)}
                      totalElements={categoryPagination?.totalElements || 0} 
                      currentPage={urlPage} 
                      pageSize={urlPageSize} 
                      sortModel={sortModel} 
                      handlePaginationChange={handlePaginationChange}
                      handleSortModelChange={handleSortModelChange} 
                      pageSizeOptions={[5, 10, 20]} /> 
      </div> 

      <Modal open={openAddCategoryModal || activeModal === 'EDIT' } setOpen={openAddCategoryModal ? setOpenAddCategoryModal : closeModals} title={openAddCategoryModal ? "Add Category" : "Update Category" } > 
        <AddCategoryForm setOpen={openAddCategoryModal ? setOpenAddCategoryModal : closeModals} loader={loader} setLoader={setLoader} category={selectedRow} update={activeModal === 'EDIT'} /> 
      </Modal>  

      <DeleteModal open={activeModal === 'DELETE'} setOpen={closeModals} loader={loader} title="Delete Category" 
      onDeleteHandler={onDeleteHandler}></DeleteModal> 
    </div>   
  )
}

export default CategoryTable