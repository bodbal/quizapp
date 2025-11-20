import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AllQuiz from './pages/AllQuiz'
import CreateQuiz from './pages/CreateQuiz'
import Home from './pages/Home'
import NotFoundPage from './pages/NotFoundPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/AllQuize' element={<AllQuiz/>}></Route>
    <Route path='/CreateQuiz' element={<CreateQuiz/>}></Route>
    <Route path='*' element={<NotFoundPage/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
