import React from 'react'
import {
  UserOutlined
} from '@ant-design/icons';

import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.css'

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


function SideMenu(props) {
  // 模拟数组结构的菜单数据
  const  menuList = [
    {
      key:"/home",
      title:"首页",
      icon:<UserOutlined />
    },
    {
      key:"/user-manage",
      title:"用户管理",
      icon:<UserOutlined />,
      children:[
        {
          key:"/user-manage/list",
          title:"用户列表",
          icon:<UserOutlined />
        }
      ]
    },
    {
      key:"/right-manage",
      title:"权限管理",
      icon:<UserOutlined />,
      children:[
        {
          key:"/right-manage/role/list",
          title:"角色列表",
          icon:<UserOutlined />
        },
        {
          key:"/right-manage/right/list",
          title:"权限列表",
          icon:<UserOutlined />
        }
      ]
    }
  ]

  const navigate = useNavigate();
  function renderMenu(menuList) {
    const newItems = menuList.map((item) => {
      if (item.children) {
        const temp = item.children.map((child) => {
          return getItem(child.title, child.key, child.icon);
        });
        return getItem(item.title, item.key, item.icon, temp);
      } else {
        return getItem(item.title, item.key, item.icon);
      }
    });
    return newItems;
  }
  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
        <div className="logo" >后台管理系统</div>
        <Menu
        mode="inline"
        theme="dark"
        items={renderMenu(menuList)}
        onClick={(item)=>{
          console.log(item.key)
          navigate(`${item.key}`,{ replace: true })
          }}
      />
      </Sider>
  )
}
export default SideMenu;
