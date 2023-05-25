import React from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Table, Button } from "antd";
export default function Sunset() {
  const { dataSource, handleDelete } = usePublish(3);
  return (
    <NewsPublish
      dataSource={dataSource}
      button={(item) => (
        <Button danger type="primary" onClick={() => handleDelete(item)}>
          删除
        </Button>
      )}
    />
  );
}
