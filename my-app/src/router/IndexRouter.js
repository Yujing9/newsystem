import React,{useEffect,useState} from 'react'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import axios from 'axios'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import UserList from '../views/sandbox/user-manage/UserList'
import RoleList from '../views/sandbox/right-manage/RoleList'
import RightList from '../views/sandbox/right-manage/RightList'
import Home from '../views/sandbox/home/Home'
import Nopermission from '../views/sandbox/nopermission/Nopermission'
import NewsAdd from '../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../views/sandbox/news-manage/NewsCategory'
import Audit from '../views/sandbox/audit-manage/Audit'
import AuditList from '../views/sandbox/audit-manage/AuditList'
import Unpublished from '../views/sandbox/publish-manage/Unpublished'
import Published from '../views/sandbox/publish-manage/Published'
import Sunset from '../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../views/sandbox/news-manage/NewsUpdate'
import { Spin } from 'antd';

export default function IndexRouter() {

  const [BackRouteList, setBackRouteList] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  useEffect(()=>{
        Promise.all([
            axios.get("http://localhost:3001/rights"),
            axios.get("http://localhost:3001/children"),
        ]).then(res=>{
            // console.log(res[1].data)
            setBackRouteList([...res[0].data,...res[1].data])
            // console.log(BackRouteList)
        })
    },[])
  
  const LocalRouterMap = {
    "/home":<Home />,
    "/user-manage/list":<UserList />,
    "/right-manage/role/list":<RoleList />,
    "/right-manage/right/list":<RightList />,
    "/news-manage/preview/:id":<NewsPreview />,
    "/news-manage/add":<NewsAdd />,
    "/news-manage/draft":<NewsDraft />,
    "/news-manage/category":<NewsCategory />,
    "/news-manage/update/:id":<NewsUpdate />,
    "/audit-manage/audit":<Audit />,
    "/audit-manage/list":<AuditList />,
    "/publish-manage/unpublished":<Unpublished />,
    "/publish-manage/published":<Published />,
    "/publish-manage/sunset":<Sunset />
}
// localhost:3000/news-manage/update/12

  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

  const checkRoute = (item)=>{
    return rights.includes(item.key)
  }
  const checkUserPermission = (item)=>{
    // console.log(item.routepermisson)
    // console.log(item.key)
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  // if (isLoading) {
  //   // 如果正在加载，显示加载状态
  //   return <Spin size="large" />;
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={localStorage.getItem("token") ? 
          <NewsSandBox />
           : <Login />}>
          {BackRouteList.map(item=>{
            if(checkRoute(item) && checkUserPermission(item)){
              // console.log(item.key)
              return <Route key={item.key} path={item.key} element={LocalRouterMap[item.key]} />
            }
            return null
            }
            )} 
          <Route path="/" element={<Navigate to="/home" replace={true} />} />
          {/* <Route path="*" element={<><Navigate to="/nopermission" replace={true} /> <Nopermission /></>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
