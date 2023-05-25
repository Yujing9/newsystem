import React, { useEffect, useState, useRef } from "react";
import { Table, Button } from "antd";

export default function NewsPublish(props) {
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
          {props.button(item)}
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.dataSource}
        pagination={{
          pageSize: 4,
        }}
        rowKey={(item) => item.id}
      />
    </>
  );
}
