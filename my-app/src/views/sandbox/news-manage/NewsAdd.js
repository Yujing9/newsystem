import React,{useState,useRef, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {  Typography,Steps,Button, Form, Input,message,notification,Select } from 'antd';
import style from './News.module.css'
import NewsEditor from '../../../components/news-manage/NewsEditor';
import axios from "axios";
const { Title } = Typography;
const { Option } = Select;

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [formInfo, setFormInfo] = useState({});//{title:"",category:""
  const [content, setContent] = useState("")//<p>123</p>
  const [categoryList, setCategoryList] = useState([])
  const NewsForm = useRef(null)
  const User = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate()

  useEffect(()=>{
    axios.get("/categories").then(res=>{
      setCategoryList(res.data)
    })
  },[])


  const handleNext = () => {
    if(current === 0){
      NewsForm.current.validateFields().then(values=>{
        setCurrent(current+1)
        setFormInfo(values)
        // console.log(values)
      }).catch(err=>{
        console.log(err)
      })
    }else{
      if(content === "" || content.trim() === "<p></p>"){
        message.error("新闻内容不能为空")
      }else{
        setCurrent(current+1)
      }
    }
  }
  const getEditorData = (value)=>{
    setContent(value)
    console.log(value)
  }
  const handleLast = () => {
    setCurrent(current-1)
  }
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const submitNews = (auditState)=>{
    console.log(formInfo)
    console.log(content)
    axios.post("/news",{
            ...formInfo,
            "content": content,
            "region": User.region?User.region:"全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
    }).then(res=>{
      notification.info({
        message: `通知`,
        description: `您可以${auditState === 0? "草稿箱":"审核列表"}到中查看您的新闻`,
        placement:"bottomRight"
      });
      navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')
    })
  }

  return (
    <div>
      <Typography>
        <Title level={3}>撰写新闻</Title>
      </Typography>
      <Steps
        current={current}
        items={[
          {
            title:"基本信息",
            description:"新闻标题，新闻分类"
          },
          {
            title:"新闻内容",
            description:"新闻主体内容"
          },
          {
            title:"新闻提交",
            description:"保存草稿或者提交审核"
          },
        ]}
      />
      <div style={{ marginTop: "50px" }}>
      <Form
        name="basic"
        ref={NewsForm}
        className={current === 0 ? '' : style.active}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="新闻标题"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >

          <Input />
        </Form.Item>

        <Form.Item
          label="新闻分类"
          name="categoryId"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Select>
          {categoryList.map(item=>(
            <Option value={item.id} key={item.id}>{item.title}</Option>
          ))}
          </Select>
        </Form.Item>
      </Form>
      </div>
      <div style={{ marginTop: "50px" }}>
      <div className={current === 1 ? '' : style.active}>
        <NewsEditor getEditorData={getEditorData} />
      </div>
      


      {
        current < 2 &&<Button type="primary" onClick={handleNext}>下一步</Button>
      }
      {
        current >= 1 &&<Button onClick={handleLast}>上一步</Button>
      }
      {
        current === 2 && <span><Button onClick={()=>submitNews(0) }>保存草稿</Button> <Button type="primary" danger onClick={()=>submitNews(1)}>提交审核</Button></span>
      }
      </div>


    </div>
  )
}
