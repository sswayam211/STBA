import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './MyComponents/Header';
import Home from './MyComponents/Pages/Home';
import Login from "./MyComponents/Pages/Login";
import About from './MyComponents/Pages/About';
import Services from './MyComponents/Pages/Services';
import AdminAccount from './MyComponents/Accounts/AdminAccount';
import StudentAccount from './MyComponents/Accounts/StudentAccount';
import TeacherAccount from './MyComponents/Accounts/TeacherAccount';
import RegisterUser from './MyComponents/Pages/RegisterUser';

function App() {

  return (
    <>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Home />
            </>
          } />
          <Route path="/login" element={
            <>
              <Header />
              <Login />
            </>
          } />
          <Route path="/register" element={
            <>
              <Header />
              <RegisterUser />
            </>
          } />
          <Route path="/about" element={
            <>
              <Header />
              <About />
            </>
          } />
          <Route path="/services" element={
            <>
              <Header />
              <Services />
            </>
          } />
          <Route path="/admin" element={
            <>
              <AdminAccount />
            </>
          } />
          <Route path="/student" element={
            <>
              <StudentAccount />
            </>
          } />
          <Route path="/teacher" element={
            <>
              <TeacherAccount />
            </>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
