import React, { useState } from 'react'
import { sellersTableColumn } from '../../helper/tableColumn';
import Modal from '../../shared/Modal';
import AddSellerForm from './AddSellerForm';
import useSellersFilter from '../../../hooks/useSellersFilter';
import { usePaginationandSorting } from '../../../hooks/usePaginationandSorting';
import GenericTable from '../../shared/GenericTable'; 

const SellerTable = ({ openAddSellerModal, setOpenAddSellerModal, sellers, pagination }) => {

  const [loader, setLoader] = useState(false);
  useSellersFilter(); 

  const tableRecords = sellers?.map(item => {
    return {
      id: item?.userId,
      username: item?.username,
      email: item?.email,
    }
  });

  const { urlPage, urlPageSize, handlePaginationChange, handleSortModelChange, sortModel } = usePaginationandSorting("userId", "asc");

  return (
    <div className='w-full mx-auto max-w-full lg:max-w-2xl xl:max-w-3xl'> 
      <h1 className='uppercase text-center font-semibold text-3xl py-4'>All Sellers</h1>    
        <div className='w-full' > 
          <GenericTable tableRecords={tableRecords} 
                tableColumns={sellersTableColumn()}  
                totalElements={pagination?.totalElements || 0}
                currentPage={urlPage}
                pageSize={urlPageSize}
                sortModel={sortModel}
                handlePaginationChange={handlePaginationChange}
                handleSortModelChange={handleSortModelChange}  
                pageSizeOptions={[5, 10, 20, 50]} /> 
        </div> 

        <Modal open={openAddSellerModal} setOpen={setOpenAddSellerModal} >
          <AddSellerForm loader={loader} setLoader={setLoader} setOpen={setOpenAddSellerModal}  />  
        </Modal>
      </div>
  )
}

export default SellerTable