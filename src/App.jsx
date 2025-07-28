import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import { useEffect, useState } from 'react'
import Loading from './components/Loading.jsx'
import AppLoader from './components/AppLoader.jsx'

function App() {
  const [isauthReady , setIsAuthReady] = useState(false)
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth , ()=>{
      setIsAuthReady(true)
    })
    return() => unsub()
  } , [])
  // if(!isauthReady) return <Loading/>
  return (
    <BrowserRouter>
      <AppLoader/>
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App
