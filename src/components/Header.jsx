import React from 'react'
import { Outlet } from 'react-router-dom'

export const Header = () => {
  return (
    <>
      <header className='app-header'>
          <h1><span>Quizo</span></h1>
      </header>
      <Outlet/>
    </>
  )
}
