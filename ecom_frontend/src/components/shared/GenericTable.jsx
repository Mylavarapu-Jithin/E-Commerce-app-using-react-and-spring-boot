import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { useAuthStatus } from '../../hooks/useAuthStatus'

const GenericTable = ({ tableRecords, tableColumns, totalElements, currentPage, pageSize, sortModel, handleSortModelChange, handlePaginationChange, pageSizeOptions, }) => {
  const { isAdmin, isSeller } = useAuthStatus(); 
  const hasSidebar = isAdmin || isSeller; 
  return (
    <div className={hasSidebar ? 'w-full sm:mx-2 md:mx-4 lg:mx-5 xl:mx-7' : 'max-w-full sm:max-w-2xl md:max-w-4xl lg:mx-auto'}>
      <DataGrid 
        className="w-full"
          rows={tableRecords}
          columns={tableColumns} 
          paginationMode='server'
          rowCount={totalElements} 
          paginationModel={{
            page: currentPage,
            pageSize: pageSize,
          }}
          sortingOrder={['asc', 'desc']} 
          sortingMode="server" 
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          onPaginationModelChange={handlePaginationChange}   
          disableRowSelectionOnClick
          disableColumnResize
          pageSizeOptions={pageSizeOptions}  
          pagination 
      />
    </div> 
  )
}

export default GenericTable