import React from "react";
import axios from "axios";
import "../../styles/ProjectPreview.css";

export default function ProjectPreview({ projectId, handleClose }) {
    const [project, setProject] = React.useState({});
    
    React.useEffect(()=>{
        async function fetchPdf() {
        try {
            const response = await axios.get(`/api/project/${projectId}?pdf=false`);
            if (response.status === 500) {
                console.log("project doesnt exist");
            } else {
                setProject(response.data);
            }
        } catch (err) {
            console.log(err);
        }}
        fetchPdf();
    },[projectId]);

    const downloadPDF = async () => {
      try {
        const response = await axios.get(`/api/project/${projectId}?pdf=true`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${projectId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (err) {
        console.log("Error downloading PDF file", err);
      }
    };
    
    if (!project) {
        return <div>Loading...</div>;
    }

    return (
      <div className="popup">
        <div className="popup-content">
          <button className="popup-close" 
                onClick={handleClose} >Close</button>
          <h2>Project Title</h2>
          <p>{project.name}</p>
          <h2>Skills</h2>
          <p>{project.skills}</p>
          <h2>Resources</h2>
          <p>{project.resources}</p>
          <h2>Administrators</h2>
          <p>{project.administrators}</p>
          <h2>Deadline</h2>
          <p>{project.deadline}</p>
          <button className="popup-download" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    );
  }
  