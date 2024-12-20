import './App.css'
import LoginForm from './components/LoginForm'
import MetricsByDateRange from './components/MetricsByDateRange'
import ProductForm from './components/ProductForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ServiceForm from './components/ServiceForm'
import SalesForm from './components/SalesForm'
import Dashboard from './components/Dashboard'
import CellphoneForm from './components/CellphoneForm'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/service" element={<ServiceForm />} />
          <Route path="/sales" element={<SalesForm/>} />
          <Route path="/products" element={<ProductForm />} />
          <Route path="/metrics" element={<MetricsByDateRange />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cellphone" element={<CellphoneForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
