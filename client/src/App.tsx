import { Route, Routes } from 'react-router-dom'
import Home from "./routes/home/home";  
import Navbar from './components/navbar/navbar';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        {/* <Route path="shop/*" element={<Shop />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="checkout" element={<Checkout />} /> */}
      </Route>
    </Routes>
  )
}

export default App