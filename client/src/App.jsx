import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import AnalyzeResult from './pages/AnalyzeResult'

function App() {

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis-result" element={<AnalyzeResult />} />
      </Routes>
  )
}

export default App
