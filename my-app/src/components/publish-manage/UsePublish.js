import React, { useEffect, useState} from "react";
import { message, Modal } from "antd";
import {
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

function usePublish(type) {
  const [dataSource, setDataSource] = useState([]);

  const {username} = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    // console.log('Published')
    axios
      .get(
        `news?author=${username}&publishState=${type}&_expand=category`
      )
      .then((res) => {
        console.log(res.data);
        setDataSource(res.data);
      });
  }, []);

  const handlePublish = (item) => {
    console.log(item);
    confirm({
      title: "是否要发布该新闻?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log("OK");
        axios
          .patch(`http://localhost:3001/news/${item.id}`, {
            ...item,
            publishState: 2,
            publishTime: Date.now(),
          })
          .then((res) => {
            message.success("发布成功");
            setDataSource(dataSource.filter((data) => data.id !== item.id));
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleSunset = (item) => {
    console.log(item);
    confirm({
      title: "是否要下线该新闻?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log("OK");
        axios
          .patch(`http://localhost:3001/news/${item.id}`, {
            ...item,
            publishState: 3,
          })
          .then((res) => {
            message.success("下线成功");
            setDataSource(dataSource.filter((data) => data.id !== item.id));
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleDelete = (item) => {
    console.log(item);
    confirm({
      title: "是否要删除该新闻?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log("OK");
        axios
          .delete(`http://localhost:3001/news/${item.id}`)
          .then((res) => {
            message.success("删除成功");
            setDataSource(dataSource.filter((data) => data.id !== item.id));
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  };
}
export default usePublish;
  