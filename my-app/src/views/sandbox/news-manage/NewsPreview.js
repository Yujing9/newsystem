import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Descriptions, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
const { Text } = Typography;

export default function NewsPreview() {
  const [newsInfo, setnewsInfo] = useState({});
  const { username } = JSON.parse(localStorage.getItem("token"));
  const params = useParams();

  useEffect(() => {
    console.log(params.id);
    axios
      .get(`/news/${params.id}?_expand=category&_expand=role`)
      .then((res) => {
        console.log(res.data);
        setnewsInfo(res.data);
      });
  }, []);

  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];

  const colorList = ["black", "orange", "green", "red"];
  const navigate = useNavigate();

  // 返回上一级路径
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      {newsInfo.category && newsInfo &&
        <div>
          <ArrowLeftOutlined onClick={goBack} />
          <Text type="secondary">{newsInfo.category.title}</Text>
          <Descriptions title={username}>
            <Descriptions.Item label="创建者">
              {newsInfo.author}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="区域">
              {newsInfo.region}
            </Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <span style={{ color: colorList[newsInfo.auditState] }}>
                {auditList[newsInfo.auditState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="发布状态">
              <span style={{ color: colorList[newsInfo.publishState] }}>
                {publishList[newsInfo.publishState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="访问数量">
              {newsInfo.view}
            </Descriptions.Item>
            <Descriptions.Item label="点赞数量">
              {newsInfo.star}
            </Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
          </Descriptions>
        </div>
      }
      <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        margin:"0 24px",
                        border:"1px solid gray"
                    }}>
                    </div>
    </>
  );
}
