import React, { useEffect, useState, useRef } from "react";
import { notification, Table, Modal, Button, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SendOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const { confirm } = Modal;

export default function AuditList() {
  const [dataSource, setDataSource] = useState([]);

  const { username } = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  // 超级管理可以看到全部，其他人只能看到自己的
  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => {
        console.log(res.data);
        setDataSource(res.data);
      });
  }, [username]);

  const handleRervert = (item) => {
    // console.log(item);
    axios.patch(`/news/${item.id}`, {
      auditState: 0,
      publishState: 0,
    }).then((res) => {
      setDataSource(dataSource.filter((data) => data.id !== item.id));
      notification.info({
      message: `通知`,
      description: "已撤销,您可以在草稿箱中查看您的新闻",
      placement: "bottomRight",
    });
    });
    
  };
  const handlePublish = (item) => {
    // console.log(item);
    confirm({
      title: "是否要发布该新闻?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log("OK");
        axios
          .patch(`/news/${item.id}`, {
            publishState: 2,
          })
          .then((res) => {
            setDataSource(dataSource.filter((data) => data.id !== item.id));
            navigate("/publish-manage/published");
            notification.info({
              message: `通知`,
              description: "您可以发布管理中已发布中查看您的新闻",
              placement: "bottomRight",
            });
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleUpdate = (item) => {
    // console.log(item);
    navigate(`/news-manage/update/${item.id}`);
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
      title: "审核状态",
      dataIndex: "auditState",
      key: "auditState",
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "操作",
      render: (item) => (
        <>
          {item.auditState === 1 && (
            <Button type="primary" onClick={() => handleRervert(item)}>
              撤销
            </Button>
          )}
          {item.auditState === 2 && (
            <Button type="primary" danger onClick={() => handlePublish(item)}>
              发布
            </Button>
          )}
          {item.auditState === 3 && (
            <Button type="primary" onClick={() => handleUpdate(item)}>
              修改
            </Button>
          )}
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
