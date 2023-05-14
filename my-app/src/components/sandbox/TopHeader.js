import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Dropdown, Space } from "antd";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function TopHeader(props) {
  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          退出
        </a>
      ),
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
          `${props.collapsed}` ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
        }
        onClick={() => props.setCollapsed(!props.collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right" }}>
        <span>欢迎admin回来</span>
        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              超级管理员
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
