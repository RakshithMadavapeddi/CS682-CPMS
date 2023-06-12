import React from "react";
import ActiveProjects from "../components/project/ActiveProjects";
import PendingProjects from "../components/project/PendingProjects";
import PublishProjects from "../components/project/PublishProjects";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "components/Header/navbar";
import Footer from "components/Footer/footer";
import "../styles/index.css";

export default function ProjectPage() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    .split("=")[1];
  const decodedToken = jwt_decode(token);
  const role = decodedToken.role;
  const navigate = useNavigate();

  const [tab, setTab] = React.useState(1);

  function renderTab() {
    switch (tab) {
      case 1:
        return <ActiveProjects />;
      case 2:
        return <PendingProjects />;
      case 3:
        return <PublishProjects />;
      default:
        return <ActiveProjects />;
    }
  }

  const isAdmin = () => {
    if (role !== "ADMIN") {
      navigate("/signin", { replace: true });
    }
  };

  React.useEffect(()=>{
    isAdmin();
  }, []);

  return (
    <div className="container">
      <Navbar />
      <div className="main-content">
        
          <div className="project-sub-navbar">

                          <div className="project-sub-nav-right"> 
                                <div className="project-sub-nav-title">Project Administration</div>
                          </div>

                          <div className="project-sub-nav-left"> 
                                <div className="active-projects" onClick={() => setTab(1)}>Active Projects</div>
                                <div className="pending-projects"  onClick={() => setTab(2)}>Pending Projects</div>
                                <div className="client-admin"  onClick={() => setTab(3)}>Client Management</div>
                          </div>

      </div>

        <div>{renderTab()}</div>
      </div>
      <div className="bottom">
        <Footer />
      </div>
    </div>
  );
}
