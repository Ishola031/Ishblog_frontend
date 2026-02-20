import { useState } from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import Navbar from './components/include/Navbar'
import './style/style.css'
import './style/universal.css'
import './style/responsive.css'
import Latest from './components/Page/Latest'
import ArticlePage from './components/Page/ArticlePage'
import CheckUrl from './components/Page/CheckUrl'
import Category from './components/page/Category'
import AuthPage from './components/page/AuthPage'
import { useAuthentication } from './auth'
import RedirectGoogleAuth from './components/include/GoogleRedirectHandler'
import Home from './components/page/Home'
import { AuthContext } from './IsAuth'
import Search from './components/page/Search'
function App() {
  const { isAuthenticated, logout } = useAuthentication()

  const ProtectedLogin = () => {
    return isAuthenticated ? <Navigate to="/" /> : <AuthPage initialMethod={'login'} />
  }

  const ProtectedRegister = () => {
    return isAuthenticated ? <Navigate to="/" /> : <AuthPage initialMethod={'register'} />
  }

  return (
    <>
      <AuthContext value={{ isAuthenticated, logout }}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login/callback" element={<RedirectGoogleAuth />} />
            <Route path='/' element={<Home />} />
            <Route path='/latest' element={<Latest />} />
            <Route path='/register' element={<ProtectedRegister />} />
            <Route path='/login' element={<ProtectedLogin />} />
            <Route path='/search' element={<Search />} />
            <Route path='/:categoryName' element={<Category />} />
            <Route path='/:categoryName/:slug' element={<CheckUrl />} />
            <Route path='/:categoryName/:subCategory/:slug' element={<ArticlePage />} />
          </Routes>
        </BrowserRouter>
      </AuthContext>
    </>
  )
}

export default App
