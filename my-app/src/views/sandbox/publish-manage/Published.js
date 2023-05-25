import React, { useEffect, useState, useRef } from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Table, Button } from "antd";
export default function Published() {
  const { dataSource, handleSunset } = usePublish(2);

  return (
    <NewsPublish
      dataSource={dataSource}
      button={(item) => (
        <Button type="primary" onClick={() => handleSunset(item)}>
          下线
        </Button>
      )}
    />
  );
}
