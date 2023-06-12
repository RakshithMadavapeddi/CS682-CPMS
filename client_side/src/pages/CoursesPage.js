import React from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import AdminCoursesPage from './AdminCousesPage';
import StudentCoursesPage from "./StudentCoursesPage";
import Navbar from 'components/Header/navbar';
import Footer from 'components/Footer/footer';
import "../styles/index.css"


export default function CoursesPage() {

    const navigate = useNavigate();

    function checkSignedIn() {
        try {
            const token = Cookies.get("token");
            const payload = jwtDecode(token);
            const role = payload.role;
            if (role === "CLIENT") {
                navigate("/signin", {replace: true});
            } else {
                return role;
            }
        } catch (error) {
            navigate("/signin", {replace: true});
        }
    }
    
    const role = checkSignedIn();
  
  return (
    <div className="container">
        <Navbar />
        <div className='main-content'>
            <div>
                {role === "ADMIN" && <AdminCoursesPage/> }
                {role === "STUDENT" ? <StudentCoursesPage/> : navigate("signin", {replace: true})}
            </div>
        </div>
        <div className='bottom'><Footer /></div>
    </div>
  );
}
