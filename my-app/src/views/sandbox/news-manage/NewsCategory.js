import React,{useEffect,useState,useRef,useContext} from 'react'
import { message, Table, Modal,Button,Input,Form } from 'antd';
import { DeleteOutlined,EditOutlined,SendOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import style from "./News.module.css"
const { confirm } = Modal;

export default function NewsCategory() {
  const [dataSource,setDataSource] = useState([])
  const {username}  = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate()
  
  useEffect(() => {
    axios.get("/categories").then(res => {
      setDataSource(res.data)
    })
}, [])
  // editable row 
  const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const handleSave = (record)=>{
  console.log(record)

  setDataSource(dataSource.map(item=>{
      if(item.id===record.id){
          return {
              id:item.id,
              title:record.title,
              value:record.title
          }
      }
      return item
  }))

  axios.patch(`/categories/${record.id}`,{
      title:record.title,
      value:record.title
  })
}
  
  // delete confirm
  const showConfirm = (item) => {
   // console.log(item);
   confirm({
     title: '是否要删除该该分类?',
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
  // console.log(item);
   axios.delete(`http://localhost:3001/categories/${item.id}`)
     .then(res=>{
       message.success("删除成功")
       setDataSource(dataSource.filter(data=>data.id!==item.id))
     })  
 }
 const columns = [
   {
     title: 'ID',
     dataIndex: 'id',
     key: 'id',
   },
     
   {
     title: '栏目名称',
     dataIndex: 'title',
     key: 'title',
     onCell: (record) => ({
      record,
      editable: true,
      dataIndex: 'title',
      title: '栏目名称',
      handleSave: handleSave,
    }),
   },
   {
     title: '操作',
     render:(item)=>(
       <>
           <Button type="link" danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>showConfirm(item)}> </Button>
       </> 
     )
   },
 ];

 return (
   <>
   
   <Table 
   components={{
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
    }}
   columns={columns} dataSource={dataSource} pagination={{
     pageSize: 4}} rowKey={item => item.id}/>
   </>
 )
}
