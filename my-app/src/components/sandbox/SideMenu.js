import React,{ useEffect, useState } from 'react'
import {
  UserOutlined
} from '@ant-design/icons';

import { Layout, Menu } from 'antd';
import { useNavigate,useLocation } from 'react-router-dom';
import './index.css'
import axios from "axios";

const { Sider } = Layout;


function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


export default function SideMenu(props) {

  const iconList = {
    "/home":<UserOutlined />,
    "/user-manage":<UserOutlined />,
    "/user-manage/list":<UserOutlined />,
    "/right-manage":<UserOutlined />,
    "/right-manage/role/list":<UserOutlined />,
    "/right-manage/right/list":<UserOutlined />,
    //.......
    "/news-manage/audit-manage":<UserOutlined />,
    "/publish-manage":<UserOutlined />,
    "/publish-manage/unpublished" :<UserOutlined />,
    "/publish-manage/published" :<UserOutlined />,
    "/publish-manage/sunset" :<UserOutlined />,
    "/audit-manage/list":<UserOutlined />,
    "/audit-manage/audit":<UserOutlined />,
  }

  const location = useLocation();
  // console.log("/"+location.pathname.split("/")[1]); // 输出当前页面的路径名
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  
  const selectKey = [location.pathname]
  const openKey = ["/"+location.pathname.split("/")[1]]

  // 获取后端返回的菜单数据
  const [newMenuList,setNewMenuList] = useState([])
  useEffect(()=>{
    axios.get("http://localhost:3001/rights?_embed=children").then(res=>{
      setNewMenuList(res.data)
    })
  },[])

  const navigate = useNavigate();
  
  const checkPermission = (item)=>{
    // console.log(item)
    return item.pagepermisson && rights.includes(item.key)
  }

  const renderMenu = (menuList) =>{
    const newItems = menuList.map((item) => {
      if (item.children?.length>0) {
        const temp = item.children.map((child) => {
          if(checkPermission(child)){
            return getItem(child.title, child.key, iconList[child.key]);
          }
        });
        return getItem(item.title, item.key, iconList[item.key], temp);
      } else {
        return getItem(item.title, item.key, iconList[item.key]);
      }
    });
    console.log(newItems)
    return newItems;
  }
  

  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
        <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
        <div className="logo" >后台管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
        <Menu
        mode="inline"
        theme="dark"
        items={renderMenu(newMenuList)}
        selectedKeys={selectKey}
        defaultOpenKeys={openKey}
        onClick={(item)=>{
          navigate(`${item.key}`,{ replace: true })
          }}
      />
      </div>
      </div>
      </Sider>
  )
}
