import React from 'react'
import UsePublish from '../../../components/publish-manage/UsePublish'


export default function Unpublished() {
  const {username} = JSON.parse(localStorage.getItem("token"))

  return (
    <UsePublish type={1} username={username} />
  )
}
