import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { Typography, Card, Col, Row, List } from 'antd'
const { Title } = Typography;
export default function News() {
    const [list, setlist] = useState([])
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            // console.log()
            setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div style={{
            width: "95%",
            margin: '0 auto'
        }}>
            
            <Title>全球大新闻</Title>
            <Title level={2}>新闻中心</Title>
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={data => <List.Item><a href={`/details/${data.id}`}>{data.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )
}
