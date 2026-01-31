import { adminOrderTableColumn } from '../../helper/tableColumn';
import { useState } from 'react';
import Modal from '../../shared/Modal';
import UpdateOrderForm from './UpdateOrderForm';
import GenericTable from '../../shared/GenericTable';
import { usePaginationandSorting } from '../../../hooks/usePaginationandSorting';
import { useTableActions } from '../../../hooks/useTableActions';
import { useAuthStatus } from '../../../hooks/useAuthStatus';

const OrderTable = ({ adminOrder, pagination }) => {  
   const [loader, setLoader] = useState(false); 
   const { isAdmin, isSeller } = useAuthStatus();

  const tableRecords = adminOrder?.map((item) => {
    return {
      id: item.orderId,
      email: item.email,
      totalAmount: item.totalAmount,
      status: item.orderStatus,
      date: item.orderDate,
    }
  });

  const { selectedRow, activeModal, handleTableAction, closeModals } = useTableActions();

  const { urlPage, urlPageSize, handlePaginationChange, handleSortModelChange, sortModel } = usePaginationandSorting("totalAmount", "asc");

return (
    <div>
      <h1 className='uppercase text-slate-800 text-3xl text-center font-bold pb-6'>All Orders</h1> 

      <div>
        <GenericTable tableRecords={tableRecords} 
                      tableColumns={adminOrderTableColumn(handleTableAction, isAdmin, isSeller)} 
                      totalElements={pagination?.totalElements || 0} 
                      currentPage={urlPage}
                      pageSize={urlPageSize}
                      sortModel={sortModel}
                      handlePaginationChange={handlePaginationChange}
                      handleSortModelChange={handleSortModelChange}  
                      pageSizeOptions={[5, 10, 20, 50]} /> 
      </div>

      <Modal
        open={activeModal === 'EDIT'}
        setOpen={closeModals}
        title='Update Order Status'>
        <UpdateOrderForm setOpen={closeModals} loader={loader} setLoader={setLoader} 
                        selectedId={selectedRow?.id} selectedItem={selectedRow} />   
      </Modal>
    </div>
  )
}

export default OrderTable;