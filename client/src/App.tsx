import { Route, Routes } from 'react-router-dom'
import Navbar from './layouts/Navbar';
import Home from './pages/Home';

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