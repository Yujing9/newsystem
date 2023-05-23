import React,{ useEffect, useState,forwardRef } from 'react'
import axios from "axios";
import {
    Select,
    Form,
    Input,
    Button
  } from 'antd';
const { Option } = Select;





const UserForm = forwardRef((props, ref) => {
  const [isDisabled,setIsDisabled] = useState(false)
  useEffect(()=>{
    setIsDisabled(props.isEditDisabled)
  },[props.isEditDisabled])

  const {roleId,region} = JSON.parse(localStorage.getItem("token"))

  const onchange = (value) => {
    // console.log(value);
    if(value===1){
      setIsDisabled(true)
      
      ref.current.setFieldsValue({
        region:""
    })
    // console.log(ref.current,"fff");
    }else{
      setIsDisabled(false)
    }
  }
  const checkRegionDisabled = (item) => {
    if(props.isUpdate){
      if(region===""){
        return false
      }else{
        return true
      }
    }else{
      if(region===""){
        return false
      }else{
        return item.value!==region
      }
    }
    

  }
  const checkRoleDisabled = (item) => {
    if(props.isUpdate){
      if(roleId===1){
        return false
      }else{
        return true
      }
    }else{ //为添加状态
      if(roleId===1){
        return false
      }else{
        return item.value!==3
      }
    }
  }

 

  return (
    <Form
      ref={ref}
      name="userForm"
    >
      <Form.Item
        label="用户名"
        name="username"
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
        label="区域"
        name="region"
        rules={isDisabled?[]:[
          {
            required: true,
            message: 'Please input your region!',
          },
        ]}
      >

        <Select
          placeholder="Select a option and change input text above"
          disabled={isDisabled}
        >
          {props.regionData.map(item=>(
            <Option value={item.title} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="角色"
        name="roleId"
        rules={[
          {
            required: true,
            message: 'Please input your role!',
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          onChange={onchange} 
        >
          
          {props.roleData.map(item=>(
            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.title}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
    )
      
})
export default UserForm
