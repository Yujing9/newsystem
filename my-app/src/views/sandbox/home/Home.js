import React, { useEffect, useState, useRef } from "react";
import { Card, Avatar, List, Drawer, Col, Row } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as echarts from "echarts";
import _ from "lodash";
const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));
  const [allList, setallList] = useState([]);
  const [mypiechart, setmypiechart] = useState(null);
  const [mybarchart, setmybarchart] = useState(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef();
  const pieRef = useRef();
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

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      // console.log(res.data)
      renderBarChart(_.groupBy(res.data, (item) => item.category.title));
      setallList(res.data);
    });
  }, []);
  //初始化
  const [chartInitialized, setChartInitialized] = useState(false);

  const renderBarChart = (obj) => {
    if (mybarchart === null) {
      var myChart = echarts.init(barRef.current);
      setmybarchart(myChart);
      // console.log("hhhh")
    } else {
      myChart = mybarchart;
      // console.log("dd")
    }

    // Specify the configuration items and data for the chart
    var option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };

    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  };
  // drawer
  const onClose = () => {
    setOpen(false);
  };

  const renderPieChart = () => {
    var currentList = allList.filter((item) => item.author === username);
    var groupObj = _.groupBy(currentList, (item) => item.category.title);
    var list = [];
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      });
    }
    if (!chartInitialized) {
      var myChart = echarts.init(pieRef.current);
      setmypiechart(myChart);
      setChartInitialized(true);
      console.log("初始化");
    } else {
      // 其他逻辑
      myChart = mypiechart;
    }

    var option = {
      title: {
        text: "当前用户新闻分类图示",
        // subtext: '纯属虚构',
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "50%",
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
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
              <PieChartOutlined
                onClick={() => {
                  setOpen(true)
                  setTimeout(() => {
                    // init初始化
                    
                    renderPieChart();
                  }, 0);
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<UserOutlined />}
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span
                    style={{
                      paddingLeft: "30px",
                    }}
                  >
                    {roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        title="个人新闻分类"
        placement="right"
        onClose={onClose}
        open={open}
        width="500px"
      >
        <div ref={pieRef} style={{ width: "500px", height: "400px" }}></div>
      </Drawer>
      <div ref={barRef} style={{ width: "600px", height: "400px" }}></div>
    </div>
  );
}
