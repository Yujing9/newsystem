import React,{useState} from 'react'
import TopHeader from '../../components/sandbox/TopHeader'
import SideMenu from '../../components/sandbox/SideMenu'
import { Outlet } from 'react-router-dom'
import {  Layout, theme } from 'antd';
import './NewsSandBox.css'
const {  Content } = Layout;

export default function NewsSandBox() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <SideMenu collapsed={collapsed}/>
      <Layout>
        <TopHeader colorBgContainer={colorBgContainer} collapsed={collapsed} setCollapsed={setCollapsed}/>
        <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
          <Outlet />
        </Content>  
      </Layout>
    </Layout>
  )
}
