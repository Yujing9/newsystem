import React, { useEffect, useState } from "react";
import { Row, Space, Descriptions, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { ArrowLeftOutlined,HeartTwoTone } from "@ant-design/icons";
const { Title,Text } = Typography;
export default function Details() {
  const [newsInfo, setnewsInfo] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // 返回上一级路径
  const goBack = () => {
    navigate(-1);
  };
  // console.log(id)
  useEffect(() => {
    axios
      .get(`/news/${id}?_expand=category&_expand=role`)
      .then((res) => {
        // console.log(res.data)
        setnewsInfo({
          ...res.data,
          view: res.data.view + 1,
        });

        //同步后端
        return res.data;
      })
      .then((res) => {
        axios.patch(`/news/${id}`, {
          view: res.view + 1,
        });
      });
  }, [id]);
  const handleStar = () => {
    setnewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1,
    });

    axios.patch(`/news/${id}`, {
      star: newsInfo.star + 1,
    });
  };
  return (
    <>
      {newsInfo && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Space>
              <ArrowLeftOutlined style={{ fontSize: "18px" }} onClick={()=>goBack()} />
              <Title level={4} style={{ marginRight: "8px" }}>
                {newsInfo.title}
              </Title>
              <Text type="secondary">{newsInfo.category.title}</Text>
              <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()} />
            </Space>
          </div>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">
              {newsInfo.author}
            </Descriptions.Item>

            <Descriptions.Item label="发布时间">
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="区域">
              {newsInfo.region}
            </Descriptions.Item>

            <Descriptions.Item label="访问数量">
              {newsInfo.view}
            </Descriptions.Item>
            <Descriptions.Item label="点赞数量">
              {newsInfo.star}
            </Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
          </Descriptions>
          <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        margin:"0 24px",
                        border:"1px solid gray"
                    }}>
                    </div>
        </div>
    
      )}
    </>
  );
}
