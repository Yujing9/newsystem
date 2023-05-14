import React from 'react'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import UserList from '../views/sandbox/user-manage/UserList'
import RoleList from '../views/sandbox/right-manage/RoleList'
import RightList from '../views/sandbox/right-manage/RightList'
import Home from '../views/sandbox/home/Home'
import Nopermission from '../views/sandbox/nopermission/Nopermission'
export default function IndexRouter() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={localStorage.getItem("token") ? 
          <NewsSandBox />
           : <Login />}>
          <Route path="/" element={<Navigate to="/home" replace={true} />} />
          <Route path="*" element={<><Navigate to="/nopermission" replace={true} /> <Nopermission /></>} />
          {/* <Route path="*" element={<Nopermission />} /> */}
          <Route path='home' element={<Home />} />
          <Route path='user-manage/list' element={<UserList />} />
          <Route path='right-manage/role/list' element={<RoleList />} />
          <Route path='right-manage/right/list' element={<RightList />} />
          {/* Route path='news-manage/draft' element={<RoleList />} />
          Route path='news-manage/category' element={<RoleList />} /> */}
          {/* <Route element={<Navigate to="/home"/ >} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
