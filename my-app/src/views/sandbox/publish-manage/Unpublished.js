import React from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Table, Button } from "antd";
export default function Unpublished() {
  const { dataSource, handlePublish } = usePublish(1);
  return (
    <NewsPublish
      dataSource={dataSource}
      button={(item) => (
        <Button type="primary" onClick={() => handlePublish(item)}>
          发布
        </Button>
      )}
    />
  );
}
