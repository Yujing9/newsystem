import React,{useEffect,useState,useRef} from 'react'
import { message, Table, Modal,Button,Switch } from 'antd';
import { DeleteOutlined,EditOutlined,SendOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'

import axios from "axios";
const { confirm } = Modal;

export default function usePublish(props) {
    const [dataSource, setDataSource] = useState([]);
    // /news?author=${username}&publishState=${type}&_expand=category
    useEffect(() => {
      // console.log('Published')
      axios.get(`news?author=${props.username}&publishState=${props.type}&_expand=category`).then(res => {
        console.log(res.data)
        setDataSource(res.data)
      }
      )
    }, [])
    const handleClick = (item) => { 
      console.log(item);
      confirm({
        title: '是否要下线该新闻?',
        icon: <ExclamationCircleFilled />,
        onOk() {
          console.log('OK');
          axios.patch(`http://localhost:3001/news/${item.id}`,{
            ...item,
            publishState:3
          }).then(res=>{
            message.success("下线成功")
            setDataSource(dataSource.filter(data=>data.id!==item.id))
          }
          )
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  
   const columns = [
       
     {
       title: '新闻标题',
       dataIndex: 'title',
       key: 'title',
       render:(title,item)=>{
         // console.log(item);
         return (
         <a href={`/news-manage/preview/${item.id}`}>{title}</a>
         )
       }
     },
     {
       title: '作者',
       dataIndex: 'author',
       key: 'author',
     },
     {
       title: '新闻分类',
       dataIndex: 'category',
       key: 'category',
       render:(category)=>{
         return category?.title
       }
     },
     {
       title: '操作',
       render:(item)=>(
         <>
             <Button type="primary" onClick={()=>handleClick(item)}>下线</Button>
         </> 
       )
     },
   ];
  
   return (
     <>
     
     <Table columns={columns} dataSource={dataSource} pagination={{
       pageSize: 4}} rowKey={item => item.id}/>
     </>
   )
  }
  
  