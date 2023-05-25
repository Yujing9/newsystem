import React, { useEffect, useState, useRef } from "react";
import { Card, Avatar, List, Typography } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6"
      )
      .then((res) => {
        // console.log(res.data)
        setviewList(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6"
      )
      .then((res) => {
        // console.log(res.data)
        setstarList(res.data);
      });
  }, []);
  return (
    <div>
      <Card title="用户最常浏览" bordered={true}>
        <List
          size="small"
          // bordered
          dataSource={viewList}
          renderItem={(item) => (
            <List.Item>
              <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
            </List.Item>
          )}
        />
      </Card>
      <Card title="用户点赞最多" bordered={true}>
        <List
          size="small"
          // bordered
          dataSource={starList}
          renderItem={(item) => (
            <List.Item>
              <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
            </List.Item>
          )}
        />
      </Card>
      <Card
        style={{
          width: 300,
        }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
          }
          title="Card title"
          description="This is the description"
        />
      </Card>
    </div>
  );
}
