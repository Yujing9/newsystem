import React, { useEffect, useState, useRef } from "react";
import { message, Table, Modal, Button, Switch } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const { confirm } = Modal;

export default function Audit() {
  const [dataSource, setDataSource] = useState([]);

  const { username,roleId,region } = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/news?auditState=1&_expand=category`)
      .then((res) => {
        console.log(res.data)
        const items = res.data;
        // setDataSource(items);
        //超级管理员,看到全部的其他人看到区域内的自己的部分
        if(roleId === 2 && region !== ""){
          setDataSource(items.filter(item=>item.region===region));
        }else if(roleId === 3 && username === items.username){
          setDataSource(items);
        }
        else{
          setDataSource(items);
        }
      });
  }, [username]);

  // 审核通过
  const auditSucess = (item) => {
    console.log(item);
    axios
      .patch(`http://localhost:3001/news/${item.id}`, {
        ...item,
        auditState: 2,
        publishState: 1
      })
      .then((res) => {
        message.success("审核成功");
        setDataSource(dataSource.filter((data) => data.id !== item.id));
      });
  };
  // 审核不通过
  const auditFail = (item) => {
    axios
      .patch(`http://localhost:3001/news/${item.id}`, {
        ...item,
        auditState: 3,
        publishState: 0
      })
      .then((res) => {
        message.success("审核不通过");
        setDataSource(dataSource.filter((data) => data.id !== item.id));
      });
  };

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      key: "title",
      render: (title, item) => {
        // console.log(item);
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        return category?.title;
      },
    },
    {
      title: "操作",
      render: (item) => (
        <>
          <Button
            type="primary"
            onClick={() => auditSucess(item)}
            shape="circle"
            icon=<CheckOutlined />
          ></Button>
          <Button
            danger
            shape="circle"
            onClick={() => auditFail(item)}
            icon=<CloseOutlined />
          ></Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 4,
        }}
        rowKey={(item) => item.id}
      />
    </>
  );
}
