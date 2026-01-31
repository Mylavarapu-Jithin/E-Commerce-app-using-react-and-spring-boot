import React, { useEffect, useState } from 'react'
import { MdAddShoppingCart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../shared/Loader';
import { FaBoxOpen } from 'react-icons/fa';
import { adminProductTableColumn } from '../../helper/tableColumn';
import useProductFilter from '../../../hooks/useProductFilter';
import Filter from '../../products/Filter';
import { deleteProduct, fetchCategories } from '../../../store/actions';
import Modal from '../../shared/Modal';
import AddProductForm from './AddProductForm';
import ErrorPage from '../../shared/ErrorPage'
import Spinners from '../../shared/Spinners';
import DeleteModal from '../../shared/DeleteModal';
import toast from 'react-hot-toast';
import ImageUploadForm from './ImageUploadForm';
import ProductViewModal from '../../shared/ProductViewModal';
import GenericTable from '../../shared/GenericTable';
import { usePaginationandSorting } from '../../../hooks/usePaginationandSorting';
import { useTableActions } from '../../../hooks/useTableActions';
import { useAuthStatus } from '../../../hooks/useAuthStatus';

const AdminProducts = () => { 

  const { products, pagination, categories } = useSelector(state => state.products); 
  const { isLoading, errorMessage, categoryLoader } = useSelector(state => state.errors); 
  const { isAdmin, isSeller } = useAuthStatus();

  const dispatch = useDispatch(); 

  const [openAddModal, setOpenAddModal] = useState(false);   
  const [loader, setLoader] = useState(false); 

   useEffect(() => {
      dispatch(fetchCategories());    
    }, [dispatch]); 

  const emptyProduct = !products || products?.length === 0; 

  useProductFilter(isSeller, isAdmin); 

  const tableRecords = products?.map((item) => {
  return {
    id: item.productId,
    productName: item.productName,
    description: item.description,
    discount: item.discount,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    specialPrice: item.specialPrice, 
  }
});

 const { urlPage, urlPageSize, handlePaginationChange, handleSortModelChange, sortModel } = usePaginationandSorting("specialPrice", "asc");
 const { selectedRow, activeModal, handleTableAction, closeModals } = useTableActions();

const isAvailable = selectedRow ? selectedRow.quantity > 0 : false;

 const onDeleteHandler = () => {
  dispatch(deleteProduct(setLoader, isSeller, selectedRow.id, toast, closeModals)); 
}

  return (
    <div> 
      <div className='pt-6 pb-10 flex justify-between'> 
        {categoryLoader ? <Spinners /> : errorMessage ? <ErrorPage message={errorMessage} /> : <Filter categories={categories ? categories : []} isAdmin searchPlaceHolder='Search Products' />  }  

        <button className='bg-custom-blue hover:bg-blue-700 text-white font-semibold md:py-2 md:px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300 cursor-pointer'  onClick={() => setOpenAddModal(true)}> 
          <MdAddShoppingCart className='md:text-xl' /> 
          Add Product
        </button> 

      </div>

      {!emptyProduct && (
        <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>All Products</h1> 
      )} 

      {isLoading ? (
        <Loader /> 
      ) : ( 
        <>
          {emptyProduct ? (
            <div className='flex flex-col items-center justify-center text-gray-600 py-10'> 
              <FaBoxOpen size={50} className='mb-3' />  
              <h2 className='text-2xl font-semibold'>No Products Created yet</h2>  
            </div>
          ) : (
            <div className='max-w-full'> 
              <GenericTable tableRecords={tableRecords} 
                            tableColumns={adminProductTableColumn(handleTableAction)}
                            totalElements={pagination?.totalElements || 0}
                            currentPage={urlPage} 
                            pageSize={urlPageSize} 
                            sortModel={sortModel}
                            handlePaginationChange={handlePaginationChange}
                            handleSortModelChange={handleSortModelChange}
                            pageSizeOptions={[5, 10, 20, 50]} /> 

            </div>
          ) }
        </>
      )}

      <Modal open={activeModal === 'EDIT' || openAddModal } setOpen={activeModal === 'EDIT' ? closeModals : setOpenAddModal} 
      title={activeModal === 'EDIT' ? "Update Product" : "Add Product"} > 
        <AddProductForm setOpen={activeModal === 'EDIT' ? closeModals : setOpenAddModal} update={activeModal === 'EDIT' || false} 
        product={selectedRow} /> 
      </Modal>  

      <Modal open={activeModal === 'IMAGE'} setOpen={closeModals} 
      title="Add Product Image"> 
        <ImageUploadForm setOpen={closeModals} product={selectedRow} />   
      </Modal> 

      <DeleteModal open={activeModal === 'DELETE'} setOpen={closeModals} title="Delete Product" onDeleteHandler={onDeleteHandler} loader={loader}> 
      </DeleteModal> 

      <ProductViewModal  open={activeModal === 'VIEW'} setOpen={closeModals} product={selectedRow} isAvailable={isAvailable}
      />   
    </div>
  )
}

export default AdminProducts;  