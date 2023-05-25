import React,{useEffect,useState,useRef} from 'react'
import UsePublish from '../../../components/publish-manage/UsePublish'

export default function Published() {
  const {username} = JSON.parse(localStorage.getItem("token"))

 return (
   <>
    <UsePublish type={2} username={username} />
   </>
 )
}

