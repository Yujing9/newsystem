import React,{useEffect,useState} from 'react'
import { message, Table, Tag,Button,Popconfirm,Switch,Popover } from 'antd';
import { DeleteOutlined,EditOutlined} from '@ant-design/icons';
import axios from "axios";

export default function RightList() {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (_, { key }) => (
        <>
            <Tag color='orange'>
              {key}
            </Tag>
      </>

      ),
    },
    {
      title: '操作',
      render:(item)=>(
        <>
            <Popconfirm
            title="删除改权限"
            description="你确定要删除该权限吗？"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            disabled = {item.pagepermisson===undefined}
            >
              <Button type="link" danger shape="circle" icon={<DeleteOutlined style={{ color: 'red' }}/>} disabled = {item.pagepermisson===undefined} onClick={()=>setWholeItem(item)}></Button>
            </Popconfirm>
            <Popover content={<div style={{textAlign:"center"}}><Switch defaultChecked onChange={onChange} /></div>} title="页面配置项">
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>setWholeItem(item)} ></Button> 
            </Popover>
        </> 
      )
    },
  ];

  const [rightList,setRightList] = useState([])

  useEffect(()=>{
    axios.get("http://localhost:3001/rights?_embed=children")
      .then(res=>{
        const items = res.data
        items.forEach(item=>{
          if(item.children.length === 0){
            item.children = ""
          }
          
        })
        setRightList(items)
        console.log(res.data);
      })
    },[])

    const [wholeItem,setWholeItem] = useState([])


    // 前端过滤数据，后端过滤数据
    const deleteItem = ()=>{
      console.log(wholeItem)
      if(wholeItem.grade===1){
        setRightList(rightList.filter(item=>item.id !== wholeItem.id))
        axios.delete(`http://localhost:3001/rights/${wholeItem.id}`)
      }else{
        let list = rightList.filter(data=>data.id===wholeItem.rightId)
        console.log(list[0].children)
        list[0].children = list[0].children.filter(data=>data.id!==wholeItem.id)
        setRightList([...rightList])
        axios.delete(`http://localhost:3001/children/${wholeItem.id}`)
      }
    }
    
    const confirm = (e) => {
      console.log(e);
      message.success('Click on Yes');
      deleteItem()
    };
    const cancel = (e) => {
      console.log(e);
      message.error('Click on No');
    };  

    // todo ： 这段代码好像写的跟坨屎一样，有时间再优化。wholeitem为什么变化，然后同时可以rightlist也会改变。是传的引用吗？
    const onChange = (checked) => {
      console.log(`switch to ${checked}`);
      wholeItem.pagepermisson = checked?1:0
      setRightList([...rightList])
      console.log(rightList)
      if(wholeItem.grade===1){
        axios.patch(`http://localhost:5000/rights/${wholeItem.id}`,{
            pagepermisson:wholeItem.pagepermisson
        })
      }else{
        axios.patch(`http://localhost:5000/children/${wholeItem.id}`,{
            pagepermisson:wholeItem.pagepermisson
        })
    }
    };

  return (
    <Table columns={columns} dataSource={rightList} pagination={{
      pageSize: 4}} />
    
  )
}
