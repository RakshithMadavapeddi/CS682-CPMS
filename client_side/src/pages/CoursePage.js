import React, { useEffect, useState } from "react";
import Navbar from "components/Header/navbar";
import Footer from "components/Footer/footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CoursesAssignment from "../components/courses/CoursesAssignment";
import CoursesProject from "../components/courses/CoursesProjects";
import CoursesStudents from "../components/courses/CoursesStudents";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import "../styles/index.css";
import StudentCoursePage from "./StudentCoursePage";

export default function CoursePage() {
  const { name } = useParams();
  const [component, setComponent] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  function checkSignedIn() {
    try {
      const token = Cookies.get("token");
      const payload = jwtDecode(token);
      const role = payload.role;
      if (role === "CLIENT") {
        navigate("/signin", { replace: true });
      } else {
        return role;
      }
    } catch (error) {
      navigate("/signin", { replace: true });
    }
  }

  const role = checkSignedIn();

  useEffect(() => {
    checkSignedIn();

    async function fetchCourse() {
      try {
        const response = await axios.get(`/api/courses/${name}`);
        if (response.status === 200) {
          setCourse(response.data);
        }
      } catch (error) {
        console.log(error);
        navigate("/signin", { replace: true });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [name, role]);

  function renderComponent(course) {
    switch (component) {
      case 1:
        return <CoursesStudents course={course} />;
      case 2:
        return <CoursesProject course={course} />;
      case 3:
        return <CoursesAssignment course={course} />;
      default:
        return <CoursesStudents course={course} />;
    }
  }

  return (
    <div className="container">
      <Navbar />
      <div className="main-content">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {role === "ADMIN" && (
              <div className="coursepage-component">

                  <div className="coursepage-sub-navbar">

                        <div className="sub-nav-right"> 
                              <div className="sub-nav-title">{ name }</div>
                        </div>

                        <div className="sub-nav-left"> 
                              <div className="set-students" onClick={() => setComponent(1)}>Student Management</div>
                              <div className="set-projects" onClick={() => setComponent(2)}>Project Management</div>
                              <div className="assign-projects" onClick={() => setComponent(3)}>Project Allocation</div>
                        </div>
                                            
                  </div>

                  {renderComponent(course)}
              </div>
            )}
            {role === "STUDENT" && <StudentCoursePage  data={course} />}
          </>
        )}
      </div>
      <div className="bottom">
        <Footer />
      </div>
    </div>
  );
}
