import React,{useEffect,useState} from 'react'
import { message, Table, Tree,Button,Popconfirm,Switch,TreeSelect,Modal } from 'antd';
import { DeleteOutlined,BarsOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import axios from "axios";
const { confirm } = Modal;


export default function RoleList() {
  const [dataSource,setDataSource] = useState([])
  const [rightList,setRightList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRight, setCurrentRight] = useState([]);//当前选中的权限
  const [currentId, setCurrentId] = useState([]);//当前选中的权限


  useEffect(()=>{
    axios.get("http://localhost:3001/roles")
      .then(res=>{
        const items = res.data
        setDataSource(items)
      })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:3001/rights?_embed=children")
      .then(res=>{
        const items = res.data
        setRightList(items)
      })
  },[])

  // delete confirm
  const showConfirm = (item) => {
    confirm({
      title: '是否要删除该权限?',
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
    axios.delete(`http://localhost:3001/roles/${item.id}`)
      .then(res=>{
        message.success("删除成功")
        setDataSource(dataSource.filter(data=>data.id!==item.id))
      })  
  }
  // modal
  
  const handleOk = () => {
    setIsModalOpen(false);
    // 前端修改数据
    setDataSource(dataSource.map((item)=>{
      if(item.id === currentId){
        return {...item,rights:currentRight}
      }
      return item
    }))

    // 修改数据，同步到数据库
    axios.patch(`http://localhost:3001/roles/${currentId}`,{
      rights:currentRight
    })
  
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // tree
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);  
    setCurrentRight(checkedKeys)
    
  };

  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '操作',
      render:(item)=>(
        <>
        <Button type="link" danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>showConfirm(item)}> </Button>

        <Button type="primary" shape="circle" icon={<BarsOutlined />} onClick={()=>{
          setIsModalOpen(true);
          setCurrentRight(item.rights)
          setCurrentId(item.id)
          }}></Button>  
        </>
        
      )
    },
  ];


  return (
    <div>
    <Table columns={columns} dataSource={dataSource} pagination={{
      pageSize: 4}} />
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
        checkable
        checkedKeys={currentRight}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={rightList}
        / >
      </Modal>
      </div>
  )
}
