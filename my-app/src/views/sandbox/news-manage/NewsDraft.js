import React,{useEffect,useState,useRef} from 'react'
import { message, Table, Modal,Button,Switch } from 'antd';
import { DeleteOutlined,EditOutlined,SendOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'

import axios from "axios";
const { confirm } = Modal;

export default function NewsDraft() {
   const [dataSource,setDataSource] = useState([])
   const {username}  = JSON.parse(localStorage.getItem("token"))
   const navigate = useNavigate()
   useEffect(()=>{
      axios.get(`/news?author=${username}&auditState=0&_expand=category`)
      .then(res=>{
        console.log(res.data);
        setDataSource(res.data)
      }
      )
    },[username])

   // delete confirm
   const showConfirm = (item) => {
    // console.log(item);
    confirm({
      title: '是否要删除该该用户?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteMethod = (item) => {
    axios.delete(`http://localhost:3001/news/${item.id}`)
      .then(res=>{
        message.success("删除成功")
        setDataSource(dataSource.filter(data=>data.id!==item.id))
      })  
  }
  // submit draft
  const submitDraft = (item) => {
    // 直接修改后端数据，auditsState=1，然后重新渲染页面
    axios.patch(`http://localhost:3001/news/${item.id}`,{
      ...item,
      auditState:1
    }).then(res=>{
      message.success("提交成功")
      setDataSource(dataSource.filter(data=>data.id!==item.id))
    })
  }
  //edit
  // 需要渲染编辑页面
  const editPage = (item) => {
    console.log(item);
    // 1.跳转到编辑页面
    navigate(`/news-manage/update/${item.id}`)
    // 2.将当前新闻的id传递给编辑页面
    // 3.编辑页面根据id向后端请求数据
    // 4.编辑页面将数据回填到表单中
    // 5.编辑页面将修改后的数据提交给后端
  }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
      
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
            <Button type="link" danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>showConfirm(item)}> </Button>
            <Button shape="circle" icon={<EditOutlined />} onClick={()=>editPage(item)}>
            </Button>
            <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={()=>submitDraft(item)}>
            </Button>
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
