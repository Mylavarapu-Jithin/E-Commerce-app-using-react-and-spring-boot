import { useState } from "react";

export const useTableActions = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  
  const handleTableAction = (type, row) => {
    setSelectedRow(row);
    setActiveModal(type);
  };

  const closeModals = () => {
    setActiveModal(null);
    setSelectedRow(null);
  };

  return { selectedRow, activeModal, handleTableAction, closeModals };
};