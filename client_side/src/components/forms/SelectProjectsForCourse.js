import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/SelectProjects.css";
import { useNavigate } from "react-router-dom";
import ErrorMessagePopup from "./ErrorMessagePopup";

export default function SelectProjectsForCourse({ projects , name, setData}) {


  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    // set the initially selected projects
    setSelectedProjects(projects.map((project) => project._id));
    
    async function getAllProjects() {
        try {
            const response = await axios.get("/api/projects");
            setAllProjects(response.data);
        } catch (err) {
            navigate('/signin', {replace: true});
        }
    }

    getAllProjects();

  }, [projects, navigate]);

  const handleProjectSelection = (event) => {
    const projectId = event.target.value;
    if (event.target.checked) {
      setSelectedProjects((prevState) => [...prevState, projectId]);
    } else {
      setSelectedProjects((prevState) =>
        prevState.filter((id) => id !== projectId)
      );
    }
  };

  const handleSubmit = async() => {
    try {
        
        console.log(selectedProjects);
        const response = await axios.put(`/api/courses/${name}`, { projects: selectedProjects },
        { headers: { 'Content-Type': 'application/json' } });
        

        if (response.status === 200) {
            setData(response.data);
            onClose();
        }
        

    } catch (err) {
        console.log(err);
    }
  };

  const onClose = () => {
    setOpen(false);
  }

  return (
    <div>

    
    <button className="project-select-button"  onClick={()=>setOpen(true)}> Add Projects </button>
    {open && 
      (
                <div className='project-select-modal-wrapper'> 

                  <div className="project-select-popup-content">

                    <div className="project-select-top"> 

                          <div className='project-select-title'>
                                  <span>Assign projects</span>
                            </div>
                          
                            {/* Close icon goes here */}
                            <div className='project-select-close-wrapper'>
                                    <div className='project-select-close' onClick={onClose}>
                                      <div className='project-select-close-button'> 
                                            <svg className='cSvg' xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 14 14">
                                                <path id="ic_close_24px" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                            </svg>
                                      </div>
                                    </div>
                            </div>
                    </div>

                    <div className="project-select-list-wrapper">
                      <table className="project-select-list">
                        <thead>
                          <tr>
                            <td className="project-select-check">Select</td>
                            <td className="project-select-name" >Project Name</td>
                            <td>Creator</td>
                          </tr>
                        </thead>
                        <tbody>
                          {allProjects.map((project) => {
                            const isChecked = selectedProjects.includes(project._id);
                            return (
                              <tr className="project-select-item" key={project._id}>
                                <td className="project-select-check">
                                  <input
                                   className="check-box"
                                    type="checkbox"
                                    value={project._id}
                                    checked={isChecked}
                                    onChange={handleProjectSelection}
                                  />
                                </td>
                                <td className="project-select-name">{project.name}</td>
                                <td className="project-select-creator">{project.createdBy}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      
                    </div>

                    <div className="just-a-blob">transparent blob x transparent blob</div>

                    <div className="Preferences-set-button-group">
                      <button  className="Preferences-set-save-button" onClick={handleSubmit}>Submit</button>
                    </div>


                  </div>

              </div>

      )}
    </div>
  );
}
