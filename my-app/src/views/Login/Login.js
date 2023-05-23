import React from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd';
import './Login.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


export default function Login() {
  const navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Success:', values);
    axios.get(`http://localhost:3001/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
    .then(res=>{
        console.log(res.data)
        if(res.data.length>0){
          message.success('登陆成功')
          localStorage.setItem("token",JSON.stringify(res.data[0]))
          navigate('/')
        }else{
          message.error('登陆失败,请检查用户名或密码')
        }
      })

  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div style={{ background: 'rgb(35, 39, 65)', height: "100%",overflow:'hidden' }}>
    <div className="formContainer">
    <div className="logintitle">全球新闻发布管理系统</div>
    <Form
    name="basic"
    labelCol={{
      span: 5,
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
      label="用户名"
      name="username"
      style={{
        fontSize: 20,
        color: 'white',
      }}
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
      label="密码"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 10,
        span: 16,
      }}
    >
      <Checkbox>记住我</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 10,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        登陆
      </Button>
    </Form.Item>
  </Form>
  </div>
  </div>
  )
}
