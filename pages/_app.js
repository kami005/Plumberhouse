import React, { useEffect, useState } from 'react'
import Appbar from '../src/Components/appbar'
import { useToggle } from '../src/CustomHooks/RandHooks'
import Sidebar from '../src/Components/Sidebar'
import { Stack } from '@mui/material'
import Drawer from '../src/Components/Drawer'
import Linearprogress from './api/linearprogress'
import { Router, useRouter } from 'next/dist/client/router'
import '../styles/globals.css'
import SessionProvider from '../src/Context/SessionContext'
import ReactGA from 'react-ga4'
import { Footer } from '../src/Components/Footer'
function MyApp({ Component, pageProps }) {
  const [drawerOpen, toggleDrawer] = useToggle()
  const [loading, toggleLoading] = useState(false)
  const route=useRouter()
  Router.events.on('routeChangeStart', () => {
    toggleLoading(true)
  })
  Router.events.on('routeChangeComplete', () => {
    toggleLoading(false)
  })
  Router.events.on('routeChangeError', () => {
    toggleLoading(false)
  })

  useEffect(()=>{
    ReactGA.initialize('G-T6N1JCBTSE')
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search });
},[])
  return(
    <SessionProvider style={{height:'100%'}} route={route}>
    {!route.pathname.includes('/prints') &&  <Appbar toggleDrawer={toggleDrawer}/>}
      {loading && <Linearprogress />}
      <Stack direction={'row'} justifyContent='space-between' >
      {(!route.pathname.includes('/prints') && route.pathname !== '/signin') ? <Sidebar />:null}
      {!route.pathname.includes('/prints') && <Drawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />}
      <Component {...pageProps} pathname={route.pathname} />
      </Stack>
      {(route && route.pathname.includes('signin')) && 
      <Footer />
      } 
      
    </SessionProvider>

  )
 
}

export default MyApp
