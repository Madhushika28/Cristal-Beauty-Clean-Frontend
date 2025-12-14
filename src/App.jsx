import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import ProductCard from './components/productCard'
import AdminPage from './pages/adminPage';
import HomePage from './pages/homaPage';
import TestPage from './pages/test';
import LoginPage from './pages/loginPage';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/registerPage';


function App() {
  

  return (
    <BrowserRouter>
    <div className = "w-full h-[100vh] ">
    <Toaster position = "top-right"/>

      <Routes path="/">
        <Route path="/*" element={<HomePage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="/admin/*" element={<AdminPage/>}/>
        <Route path="/test" element={<TestPage/>}/>
      


      </Routes>
      </div>
     
    </BrowserRouter>
   
  );
}

export default App
