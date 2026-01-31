import React, { useState } from 'react'
import Sidebar from '../shared/Sidebar'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { RxCross1 } from 'react-icons/rx';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuthStatus } from '../../hooks/useAuthStatus';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);  

  const { isAdmin, isSeller } = useAuthStatus(); 
  const hasSidebar = isAdmin || isSeller; 
  
  return (
    <div>
      {hasSidebar && 
        <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="relative z-50 xl:hidden"> 
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <DialogBackdrop transition className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0" /> 

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex">
            {/* The actual dialog panel  */}
            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition ease-in-out data-closed:-translate-x-full"> 
              <TransitionChild className='absolute left-3/4 right-0 flex w-16 justify-end pt-5 duration-300  ease-in-out data-closed:opacity-0'> 
                <div className=''>
                  <button type='button' onClick={() => setSidebarOpen(false)} className='-m-2.5 p-2' > 
                    <span className='sr-only'>Close Sidebar</span>
                    <RxCross1 className='text-white text-2xl cursor-pointer' />    
                  </button>
                </div>
              </TransitionChild> 
              <Sidebar /> 
            </DialogPanel>       
          </div>
        </Dialog>
      }

      {hasSidebar && 
        <div className='hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col'> 
          <Sidebar /> 
        </div>
      }

      <div className={hasSidebar ? 'xl:pl-72' : 'max-w-6xl mx-auto'}>
        {hasSidebar && 
          <button type='button' onClick={() => setSidebarOpen(true)} className='-m-2.5 text-gray-700 xl:hidden p-4'> 
            <span className='sr-only'>Open Sidebar</span>
            <FaBars className='text-slate-800 text-2xl cursor-pointer' /> 
          </button> 
        }
        <main>
          <div className='p-4 sm:p-6 xl:p-8'> 
            <Outlet />  
          </div>
        </main>
      </div>
    </div> 
  )
}

export default AdminLayout