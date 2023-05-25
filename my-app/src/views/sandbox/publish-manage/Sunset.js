import React from 'react'
import UsePublish from '../../../components/publish-manage/UsePublish'

export default function Sunset() {
  const {username} = JSON.parse(localStorage.getItem("token"))

  return (
    <UsePublish type={3} username={username} />
  )
}
