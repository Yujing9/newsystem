import React, { useEffect } from "react";
import { useNavigate,useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Dropdown, Space,Avatar } from "antd";
import { DownOutlined, SmileOutlined,UserOutlined } from "@ant-design/icons";
import {useDispatch,useSelector} from 'react-redux'
import {changeCollapsed} from '../../redux/reducer/CollapsedReducer'
const { Header } = Layout;

export default function TopHeader(props) {
  const navigate = useNavigate();
  const {username,role:{roleName}} =  JSON.parse(localStorage.getItem('token'))
  const dispatch = useDispatch()
  const isCollapsed = useSelector((state) => state.CollapsedReducer.value)
  

  const items = [
    {
      key: "1",
      label: (
        <span>
          {roleName}
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          退出
        </span>
      ),
      onClick: () => {
        navigate("/login");
        localStorage.removeItem("token");
        console.log("退出");
        
      }
    },
  ];
  return (
    <Header
      style={{
        padding: 0,
        background: `${props.colorBgContainer}`,
      }}
    >
      <Button
        type="text"
        icon={
          isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
        }
        onClick={() => dispatch(changeCollapsed(isCollapsed))}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown
          menu={{
            items,
          }}
        > 
          <a onClick={(e) => e.preventDefault()}>
            <Space>
            <Avatar size="large" icon={<UserOutlined />} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
