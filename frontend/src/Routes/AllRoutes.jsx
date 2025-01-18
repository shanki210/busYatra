import React from 'react'
import { Route ,Routes} from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login'
import Register from '../components/Register'
import SeatBook from '../components/SeatBook'
import PrivateRoutes from './PrivateRoutes'
import Cart from '../components/Cart'
import AllBookeTicket from '../components/AllBookeTicket'
import PayNow from '../components/PayNow'
import AdminDashboard from '../components/AdminDashboard'
import DriverKYC from '../components/DriverKYC'

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} > </Route>
      <Route path='/login' element={<Login/>} > </Route>
      <Route path='/register' element={<Register/>} > </Route>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />;
       <Route path='/seatbook' element={<SeatBook/>} > </Route>
       <Route path='/cart' element={<PrivateRoutes><Cart/></PrivateRoutes>} > </Route>
       <Route path='/bookedticket' element={<PrivateRoutes><AllBookeTicket/></PrivateRoutes>} > </Route>
       <Route path='/pay' element={<PrivateRoutes><PayNow/></PrivateRoutes>} > </Route>
       <Route path='/driver/kyc' element={<DriverKYC />} />
    </Routes>
  )
}

export default AllRoutes
