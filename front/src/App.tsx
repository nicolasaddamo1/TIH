import './App.css'
import LoginForm from './components/LoginForm'
import ProductForm from './components/ProductForm'
import SalesForm from './components/SalesForm'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/sales" element={<SalesForm />} />
          <Route path="/products" element={<ProductForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
