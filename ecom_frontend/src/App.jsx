
import { FaBeer } from 'react-icons/fa'
import './App.css'
import Products from './components/products/Products'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home'
import Navbar from './components/shared/Navbar'
import About from './components/About'
import Contact from './components/Contact'
import { Toaster } from 'react-hot-toast'
import React, { useEffect } from 'react' 
import Cart from './components/cart/Cart'
import Login from './components/shared/auth/Login'
import PrivateRoute from './components/PrivateRoute'
import Register from './components/shared/auth/Register'
import Checkout from './components/checkout/Checkout'
import PaymentConfirmation from './components/checkout/PaymentConfirmation'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/dashboard/Dashboard'
import Category from './components/admin/categories/Category'
import Sellers from './components/admin/sellers/Sellers'
import AdminProducts from './components/admin/products/AdminProducts'
import Orders from './components/admin/orders/Orders'
import { RiProfileFill } from 'react-icons/ri'
import Profile from './components/Profile'
import { useDispatch } from 'react-redux'
import { useAuthStatus } from './hooks/useAuthStatus'
import { getUserProfile } from './store/actions'

function App() {

  const dispatch = useDispatch();
  const { isAdmin, isSeller } = useAuthStatus();

  useEffect(() => {
    dispatch(getUserProfile(isAdmin, isSeller)); 
  }, [dispatch, isSeller, isAdmin]); 
  
  return (
    <React.Fragment> 
      <Router>
        <Navbar />   
        <Routes>
          <Route path='/' element={<Home />} />    
          <Route path='/products' element={<Products />} />    
          <Route path='/about' element={<About />} /> 
          <Route path='/contact' element={<Contact />} />     
          <Route path='/order-confirm' element={<PaymentConfirmation />} /> 
          
          <Route element={<PrivateRoute publicPage={true} />} >
            <Route path='/login' element={<Login />} />  
            <Route path='/register' element={<Register />} />      
          </Route>  

          <Route element={<PrivateRoute /> }>         
            <Route path='/cart' element={<Cart />} />        
            <Route path='/checkout' element={<Checkout />} />   
            <Route path='/profile/orders' element={<Orders />} /> 
            <Route path='/profile' element={<Profile />} /> 
          </Route>   

          <Route path='/' element={<PrivateRoute adminOnly />} >
              <Route path='/admin' element={<AdminLayout />} >
              <Route path='' element={<Dashboard />} /> 
              <Route path='categories' element={<Category />} />
              <Route path='sellers' element={<Sellers />} />
              <Route path='products' element={<AdminProducts />} />  
              <Route path='orders' element={<Orders />} />  
            </Route>
          </Route>  
        </Routes>   
      </Router> 
      <Toaster position='bottom-center' />               
    </React.Fragment>
  ) 
}

export default App
