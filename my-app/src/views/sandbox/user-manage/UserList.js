import React,{useEffect,useState,useRef} from 'react'
import { message, Table, Modal,Button,Switch } from 'antd';
import { DeleteOutlined,EditOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import UserForm from "../../../components/user-manage/Form"
import axios from "axios";
const { confirm } = Modal;

export default function UserList() {
  //forwardRef 
  const addFormRef= useRef(null);
  const editFormRef= useRef(null);
  const [dataSource,setDataSource] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [regionData,setRegionData] = useState([])
  const [roleData,setRoleData] = useState([])
  const [current,setCurrent] = useState(null)
  const [isEditDisabled,setIsEditDisabled] = useState()
  
  const {roleId,region} = JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
    axios.get("http://localhost:3001/regions")
      .then(res=>{
        const items = res.data
        setRegionData(items)
      })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:3001/roles")
      .then(res=>{
        const items = res.data
        setRoleData(items.map(item=>({
          id:item.id,
          title:item.roleName,
          value:item.id
        })
        ))
      })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:3001/users?_expand=role")
      .then(res=>{
        const items = res.data
        // console.log(items);
        if(roleId===1){
          setDataSource(items)
        }else{
          setDataSource(
            items.filter(item=>item.roleId!==1 && region===item.region)
          )
        }
      })
  },[])

  


  //Switch

  const onChange = (item) => {
    // console.log(item);
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    // 修改后端
    axios.patch(`http://localhost:3001/users/${item.id}`,{  
      roleState:item.roleState
    })
    // console.log(dataSource);
  };

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
    axios.delete(`http://localhost:3001/users/${item.id}`)
      .then(res=>{
        message.success("删除成功")
        setDataSource(dataSource.filter(data=>data.id!==item.id))
      })  
  }

  //add
  //添加部分
  //if(角色为区域管理员){角色只能选择编辑，其他都disable}else{全部都可以选择}
  // if(区域为当前选择区域){区域只能选择当前区域，其他都disable}else{全部都可以选择}
    

  const addFormOk = () => {
    console.log("add")
    addFormRef.current.validateFields().then((values) => {
      console.log(values);
      setIsAddModalOpen(false);
      addFormRef.current.resetFields()
        // 添加到后端
      axios.post("http://localhost:3001/users",{
        ...values,
        "roleState":true,
        "default":false
      }).then(res=>{
        message.success("添加成功")
        // 同步到前端
        // console.log(res.data);
        setDataSource([...dataSource,{
          ...res.data,
          role:roleData.filter(item=>item.id===values.roleId)[0]
        }])
      })
    }).catch((errorInfo) => {
      console.log(errorInfo);
    });
    
  };
  // edit
  const editFormOk = () => {  
    console.log("edit");
    editFormRef.current.validateFields().then((values) => {
      setIsEditModalOpen(false);
      setDataSource(dataSource.map(data=>{
        if(data.id===current.id){
          return {
            ...data,
            ...values,
            role:roleData.filter(item=>item.id===values.roleId)
          }
        }
        return data
      }
      ))
      // 修改后端
      axios.patch(`http://localhost:3001/users/${current.id}`,values).then(res=>{
        message.success("修改成功")
      })
    }).catch((errorInfo) => {
      console.log(errorInfo);
    });
  };
  
  const showEditModal = (item) => {
    setIsEditModalOpen(true);
      setTimeout(() => {
          if(item.roleId===1){
            //禁用
            setIsEditDisabled(true)
        }else{
            //取消禁用
            setIsEditDisabled(false)
        }
          editFormRef.current.setFieldsValue(item)
      }, 100);
      setCurrent(item);
  };
  const handleEditCancel = () => {
      setIsEditModalOpen(false);
      setIsEditDisabled(!isEditDisabled)
    };
  
  

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      filters: [
        ...regionData.map(item=>({
            text:item.title,
            value:item.value
        })),
        {
            text:"全球",
            value:"全球"
        } 
    ],

    onFilter:(value,item)=>{
        if(value==="全球"){
            return item.region===""
        }
        return item.region===value
    },

      render: (region) => {
        if(region===""){
          return "全球"
        }
        return region
      },
    },
      
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户状态',
      render:(item)=>(
        <>
            <Switch checked={item.roleState} onChange={()=>onChange(item)} disabled={item.default} />
        </> 
      )
    },
    {
      title: '操作',
      render:(item)=>(
        <>
            <Button type="link" danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>showConfirm(item)} disabled={item.default}> </Button>
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>showEditModal(item)} disabled={item.default}>
            </Button>
        </> 
      )
    },
  ];

  

  return (
    <>
    <Button type='primary' onClick={()=>setIsAddModalOpen(true)}>添加用户</Button>
    
    <Table columns={columns} dataSource={dataSource} pagination={{
      pageSize: 4}} rowKey={item => item.id}/>
    <Modal title="更新用户信息" open={isAddModalOpen} onOk={()=>addFormOk()} onCancel={()=>setIsAddModalOpen(false)}>
        <UserForm ref={addFormRef} regionData={regionData} roleData={roleData} />
    </Modal>

    <Modal title="修改用户信息" open={isEditModalOpen} onOk={()=>editFormOk()} onCancel={handleEditCancel}>
      <UserForm ref={editFormRef} regionData={regionData} roleData={roleData} isEditDisabled={isEditDisabled} isUpdate={true} />
    </Modal>
    </>
    
  )
}
