import React, { useState } from "react";
import axios from "axios";
import "../../styles/PublishProjectForm.css";
import { useNavigate } from "react-router-dom";

const PublishProjectForm = ({data, setData}) => {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [projectAdmins, setProjectAdmins] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectSkills, setProjectSkills] = useState("");
  const [projectResources, setProjectResources] = useState("");
  const [projectAttachments, setProjectAttachments] = useState();
  const [selectedFileName, setSelectedFileName] = useState('');


    const [subjectIDFocused, setSubjectIDFocused] = useState(false);
    const [subjectIDHasValue, setSubjectIDHasValue] = useState(false);

    const [studentIDFocused, setStudentIDFocused] = useState(false);
    const [studentIDHasValue, setstudentIDHasValue] = useState(false);

    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordHasValue, setPasswordHasValue] = useState(false);

    const [resourcesFocused, setResourcesFocused] = useState(false);
    const [resourcesHasValue, setResourcesHasValue] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');

    function handleDateChange(event) {
        setSelectedDate(event.target.value);
    }

    const chooseFile = () => {
      document.getElementById('projectAttachments').click();
    }

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value !== '');
    };

  const handleProjectTitleChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleProjectDeadlineChange = (event) => {
    setProjectDeadline(event.target.value);
  };

  const handleProjectAdminsChange = (event) => {
    setProjectAdmins(event.target.value);
  };

  const handleProjectDescriptionChange = (event) => {
    setProjectDescription(event.target.value);
  };

  const handleProjectSkillsChange = (event) => {
    setProjectSkills(event.target.value);
  };

  const handleProjectResourcesChange = (event) => {
    setProjectResources(event.target.value);
  };

  const handleProjectAttachmentsChange = (event) => {
    const file = event.target.files[0];
  if (file) {
    setSelectedFileName(file.name);
  } else {
    setSelectedFileName('');
  }
    setProjectAttachments(event.target.files[0]);
  };

  const handleNextPage = (event) => {
    event.preventDefault();
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = (event) => {
    event.preventDefault();
    setCurrentPage(currentPage - 1);
  };

  const sendToApi = async() => {
    if (
      projectTitle &&
      projectDeadline &&
      projectAdmins &&
      projectDescription &&
      projectSkills &&
      projectResources &&
      projectAttachments
    ) {
      const formData = new FormData();
      formData.set('name', projectTitle);
      formData.set('administrators', projectAdmins);
      formData.set('description', projectDescription);
      formData.set('skills', projectSkills);
      formData.set('resources', projectResources);
      formData.set('deadline', projectDeadline);
      if (projectAttachments !== null) { // check if projectAttachments is not null
        formData.append('file', projectAttachments);
      } else {
        console.log("file is null");
      }
      
      try {
        const response = await axios.post('/api/project', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.status === 201) {
          setData([response.data, ...data]);
          setCurrentPage(currentPage + 1);
        }
        
      } catch (error) {
        switch (error.response.status) {
          case 401:
            navigate("/signin", { replace: true });
            break;
          case 400:
            console.log("missing fields");
            break;
          case 500:
            console.log("internal error");
            break;
          default:
            console.log("unexpected error");
        }
        console.log(error);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendToApi();
  };

  const handleClose = (event) => {
    setPopup(false);
  };

  const pageOne = () => {
    return (
      <div className="project-form-p1-container">

                        <div className='project-form-p1-progress'>
                                    <div className='project-form-p1-progress-one'> 
                                        <svg className='project-form-p2-progress-one-svg' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <g id="one" transform="translate(-687 -275)">
                                            <circle id="Ellipse_2" data-name="Ellipse 2" cx="12" cy="12" r="12" transform="translate(687 275)" fill="#0097eb"/>
                                            <text id="_1" data-name="1" transform="translate(697 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">1</tspan></text>
                                          </g>
                                        </svg>
                                    </div>

                                    <div className='project-form-p1-progress-first-line'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="227.835" height="2" viewBox="0 0 227.835 2">
                                          <path id="first-grey-line" d="M-4537.775,3601h225.835" transform="translate(4538.775 -3600)" fill="none" stroke="#9f9f9f" stroke-linecap="round" stroke-width="2"/>
                                        </svg>
                                    </div>

                                    <div className='project-form-p1-progress-two'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <g id="two-grey-bg" transform="translate(-948 -275)">
                                            <circle id="Ellipse_3" data-name="Ellipse 3" cx="12" cy="12" r="12" transform="translate(948 275)" fill="#9f9f9f"/>
                                            <text id="_2" data-name="2" transform="translate(956 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">2</tspan></text>
                                          </g>
                                        </svg>
                                    </div>

                                    <div className='project-form-p1-progress-second-line'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="227.835" height="2" viewBox="0 0 227.835 2">
                                          <path id="second-grey-line" d="M-4537.775,3601h225.835" transform="translate(4538.775 -3600)" fill="none" stroke="#9f9f9f" stroke-linecap="round" stroke-width="2"/>
                                        </svg>
                                    </div>

                                    <div className='project-form-p1-progress-three'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <g id="three-grey-bg" transform="translate(-1209 -275)">
                                            <circle id="Ellipse_4" data-name="Ellipse 4" cx="12" cy="12" r="12" transform="translate(1209 275)" fill="#9f9f9f"/>
                                            <text id="_3" data-name="3" transform="translate(1217 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">3</tspan></text>
                                          </g>
                                        </svg>
                                    </div>
                        </div>

                        <div className='project-form-p1-progress-title'> 
                                    <span   class='project-form-p2-progress-title-text'>General Information</span>
                        </div>



        <form className="project-form-page01" onSubmit={handleNextPage}>



          <div className='project-form-page01-fullName-ID'> 

            <label htmlFor="projectTitle" className={`project-form-page01-fullName-ID-label ${subjectIDFocused  || subjectIDHasValue ? 'focused' : ''}`}>Project Title</label>
            <input
              className="project-form-page01-fullName-ID-input"
              type="text"
              id="projectTitle"
              name="projectTitle"
              value={projectTitle}
              onChange={handleProjectTitleChange}
              required
              onFocus={() => setSubjectIDFocused(true)}
              onBlur={(e) => {
                                setSubjectIDFocused(false);
                                setSubjectIDHasValue(e.target.value !== '');
                              }}
            />
          </div>


          <div className='formProject-p1-date'> 

            <label htmlFor="projectDeadline" className={`formProject-p1-date-label ${isFocused || hasValue ? 'focused' : ''}`}>Expected Project Deadline</label>
            <input
              type="date"
              id="projectDeadline"
              name="projectDeadline"
              value={projectDeadline}
              onChange={handleProjectDeadlineChange}
              required
              className={`formProject-p1-date-input ${isFocused || hasValue ? 'focused' : ''}`}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

          </div>

          <div className='formProject01-Admins'>      

              <label htmlFor="projectAdmins" className={`formProject01-Admins-label ${studentIDFocused  || studentIDHasValue ? 'focused' : ''}`}>Project Administrators</label>
              
              <input
                type="text"
                id="projectAdmins"
                name="projectAdmins"
                value={projectAdmins}
                onChange={handleProjectAdminsChange}
                required
                className="formProject01-Admins-input"
                onFocus={() => setStudentIDFocused(true)}
                onBlur={(e) => {
                    setStudentIDFocused(false);
                    setstudentIDHasValue(e.target.value !== '');
                }}
              />
          </div>

            <div className='formProject01-message'>

                  <label htmlFor="projectDescription" className={`formProject01-message-label ${passwordFocused  || passwordHasValue ? 'focused' : ''}`}>Project Description</label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={projectDescription}
                    onChange={handleProjectDescriptionChange}
                    required
                    className="formProject01-message-input"
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={(e) => {
                                          setPasswordFocused(false);
                                          setPasswordHasValue(e.target.value !== '');
                                      }}
                  />

            </div>

            <div className="project-form-p1-buttons">
              <button className="project-form-p1-continue" type="submit">Continue</button>
            </div>
          </form>
      </div>
    )
  }

  const pageTwo = () => {
    return (
      <div className="project-form-p2-container">

                        <div className='project-form-p2-progress'>

                                    <div className='project-form-p2-progress-one'> 
                                        <svg className='project-form-p2-progress-one-svg' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <g id="one" transform="translate(-687 -275)">
                                            <circle id="Ellipse_2" data-name="Ellipse 2" cx="12" cy="12" r="12" transform="translate(687 275)" fill="#0097eb"/>
                                            <text id="_1" data-name="1" transform="translate(697 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">1</tspan></text>
                                          </g>
                                        </svg>
                                    </div>

                                    <div className='project-form-p2-progress-first-line'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="227.835" height="2" viewBox="0 0 227.835 2">
                                          <path id="one-two-line" d="M-4537.775,3601h225.835" transform="translate(4538.775 -3600)" fill="none" stroke="#0097eb" stroke-linecap="round" stroke-width="2"/>
                                        </svg>
                                    </div>

                                    <div className='project-form-p2-progress-two'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <g id="two" transform="translate(-948 -275)">
                                            <circle id="Ellipse_3" data-name="Ellipse 3" cx="12" cy="12" r="12" transform="translate(948 275)" fill="#0097eb"/>
                                            <text id="_2" data-name="2" transform="translate(956 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">2</tspan></text>
                                          </g>
                                        </svg>
                                    </div>

                                    <div className='project-form-p2-progress-second-line'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="227.835" height="2" viewBox="0 0 227.835 2">
                                          <path id="second-grey-line" d="M-4537.775,3601h225.835" transform="translate(4538.775 -3600)" fill="none" stroke="#9f9f9f" stroke-linecap="round" stroke-width="2"/>
                                        </svg>
                                    </div>

                                    <div className='project-form-p2-progress-three'> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <g id="three-grey-bg" transform="translate(-1209 -275)">
                                            <circle id="Ellipse_4" data-name="Ellipse 4" cx="12" cy="12" r="12" transform="translate(1209 275)" fill="#9f9f9f"/>
                                            <text id="_3" data-name="3" transform="translate(1217 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">3</tspan></text>
                                          </g>
                                        </svg>
                                    </div>
                        </div>

                        <div className='project-form-p2-progress-title'> 
                                    <span   class='project-form-p2-progress-title-text'>Skills, Technologies & Resources</span>
                        </div>

                        <form className="project-form-page02" onSubmit={handleNextPage}>

                                <div className="formProject02-skills"> 

                                    <label htmlFor="projectSkills" className={`formProject02-skills-label ${passwordFocused  || passwordHasValue ? 'focused' : ''}`}>Skills & Technologies Required</label>
                                    <textarea
                                      id="projectSkills"
                                      name="projectSkills"
                                      value={projectSkills}
                                      onChange={handleProjectSkillsChange}
                                      required
                                      className="formProject02-skills-input"
                                          onFocus={() => setPasswordFocused(true)}
                                          onBlur={(e) => {
                                                              setPasswordFocused(false);
                                                              setPasswordHasValue(e.target.value !== '');
                                                          }}
                                    />

                                </div>


                                <div className="formProject02-resources"> 
                                
                                      <label htmlFor="projectResources" className={`formProject02-resources-label ${resourcesFocused  || resourcesHasValue ? 'focused' : ''}`}>Resources Required</label>
                                      <textarea
                                        id="projectResources"
                                        name="projectResources"
                                        value={projectResources}
                                        onChange={handleProjectResourcesChange}
                                        required
                                        className="formProject02-resources-input"
                                          onFocus={() => setResourcesFocused(true)}
                                          onBlur={(e) => {
                                                              setResourcesFocused(false);
                                                              setResourcesHasValue(e.target.value !== '');
                                                          }}
                                      />

                                </div>

                            
                                <div className="project-form-p2-buttons">

                                    <div className="formProject02-previous"> 
                                      <button className="project-form-p2-previous" onClick={handlePrevPage}>Previous</button>
                                    </div>

                                    <div className="formProject02-continue"> 
                                    <button className="project-form-p2-continue" type="submit">Continue</button>
                                    </div> 
                                    
                                </div>

                
                        </form>
          </div>
    )
  }

  const pageThree = () => {
    return (
      <div className="project-form-p3-container">
        <form onSubmit={handleSubmit}>
            
                               <div className='project-form-p2-progress'>

                                                      <div className='project-form-p3-progress-one'> 
                                                          <svg className='project-form-p3-progress-one-svg' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                            <g id="one" transform="translate(-687 -275)">
                                                              <circle id="Ellipse_2" data-name="Ellipse 2" cx="12" cy="12" r="12" transform="translate(687 275)" fill="#0097eb"/>
                                                              <text id="_1" data-name="1" transform="translate(697 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">1</tspan></text>
                                                            </g>
                                                          </svg>
                                                      </div>

                                                      <div className='project-form-p3-progress-first-line'> 
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="227.835" height="2" viewBox="0 0 227.835 2">
                                                            <path id="one-two-line" d="M-4537.775,3601h225.835" transform="translate(4538.775 -3600)" fill="none" stroke="#0097eb" stroke-linecap="round" stroke-width="2"/>
                                                          </svg>
                                                      </div>

                                                      <div className='project-form-p3-progress-two'> 
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                            <g id="two" transform="translate(-948 -275)">
                                                              <circle id="Ellipse_3" data-name="Ellipse 3" cx="12" cy="12" r="12" transform="translate(948 275)" fill="#0097eb"/>
                                                              <text id="_2" data-name="2" transform="translate(956 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">2</tspan></text>
                                                            </g>
                                                          </svg>
                                                      </div>

                                                      <div className='project-form-p3-progress-second-line'> 
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="227.835" height="2" viewBox="0 0 227.835 2">
                                                          <path id="two-three-line" d="M-4537.775,3601h225.835" transform="translate(4538.775 -3600)" fill="none" stroke="#0097eb" stroke-linecap="round" stroke-width="2"/>
                                                        </svg>
                                                      </div>

                                                      <div className='project-form-p3-progress-three'> 
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                            <g id="three" transform="translate(-1209 -275)">
                                                              <circle id="Ellipse_4" data-name="Ellipse 4" cx="12" cy="12" r="12" transform="translate(1209 275)" fill="#0097eb"/>
                                                              <text id="_3" data-name="3" transform="translate(1217 292)" fill="#fff" font-size="14" font-family="Poppins-Regular, Poppins"><tspan x="0" y="0">3</tspan></text>
                                                            </g>
                                                          </svg>
                                                      </div>


                               </div>

                               <div className='project-form-p3-progress-title'> 
                                                        <span   class='project-form-p3-progress-title-text'>Additional Information</span>
                              </div>

            <div className="attachment-container">

                                <div className='uploadFile'>
                                    <svg className='uploadSvg'   xmlns="http://www.w3.org/2000/svg" width="155.48" height="115.653" viewBox="0 0 119.48 79.653">
                                      <path id="ic_cloud_upload_24px" d="M96.331,34.069a37.3,37.3,0,0,0-69.7-9.957A29.858,29.858,0,0,0,29.87,83.653H94.588a24.82,24.82,0,0,0,1.742-49.584ZM69.7,48.8V68.718H49.783V48.8H34.848L59.74,23.913,84.632,48.8Z" transform="translate(0 -4)" fill="#2b6d95" opacity="0.403"/>
                                    </svg>
                                </div>

                                <div className='uploadFile-instructions'>
                                  
                                    <span className='instructions-01'>Drag & drop files here</span>
                                    <span className='instructions-02'>(Please upload a PDF file, less than 25 MB)</span>

                                </div>

                  
                                <div className="file-input-wrapper">
                                  <input type="file" id="projectAttachments" name="file" onChange={handleProjectAttachmentsChange} accept="application/pdf" required />
                                  <button className="custom-file-button" onClick={chooseFile}>Choose File</button>
                                  {selectedFileName && <span className="selected-file-name">{selectedFileName}</span>}
                                </div>

                  </div>

            <div className="form-buttons">
              
              
                  <div className="project-form-p3-buttons">

                                        <div className="formProject03-previous"> 
                                          <button className="project-form-p3-previous" onClick={handlePrevPage}>Previous</button>
                                        </div>

                                        <div className="formProject03-submit"> 
                                           <button className="project-form-p3-submit" type="submit">Submit</button>
                                        </div> 
                                        
                  </div>
            </div>
          </form>
      </div>
    )
  }

  const confirmationPage = () => {
    return (
    <>
      <div className="project-form-p4-container">
        <div className="project-attachment-container">

                                <div className='thumbsup'>
                                  <svg className='upSvg' width="200px" height="200px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.1818 9.36364H14.4455L15.3091 5.20909L15.3364 4.91818C15.3364 4.54545 15.1818 4.2 14.9364 3.95455L13.9727 3L7.99091 8.99091C7.65455 9.31818 7.45455 9.77273 7.45455 10.2727V19.3636C7.45455 20.3636 8.27273 21.1818 9.27273 21.1818H17.4545C18.2091 21.1818 18.8545 20.7273 19.1273 20.0727L21.8727 13.6636C21.9545 13.4545 22 13.2364 22 13V11.1818C22 10.1818 21.1818 9.36364 20.1818 9.36364Z" fill="#000000"/>
                                    <path d="M5.63636 10.2727H2V21.1818H5.63636V10.2727Z" fill="#000000"/>
                                  </svg>
                                </div>

            <div className="successfully"> 
              <p>Project created successfully!</p>
            </div>
          
          </div>

        <div>
          <button className="finish" onClick={()=>{setPopup(false); setCurrentPage(1);}}>Finish</button>
        </div>
      </div>
    </>
    )
  }

  return (
    <>
      <button className="create-project" onClick={() => setPopup(true)}>Create Project</button>
      
    
        {popup &&
          (<div className="form-popup-bg">
                <div className={`form-popup ${currentPage === 1 ? "page1" : currentPage === 2 ? "page2" : "page3"}`}>
                  

                    <div className='project-form-popup-header'>
                            
                            {/* Title goes here */}
                    
                              <div className='project-form-popup-title'> 
                                  <span class='project-form-popup-title-01'>Publish a Project</span>
                              </div>
              

                            {/* Close icon goes here */}
                            <div className='project-form-popup-close-1' onClick={handleClose}>
                                <div className='project-form-popup-close-button-1'> 
                                  <svg className='cSvg' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                      <path id="ic_close_24px" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                  </svg>
                                </div>
                            </div>

                    </div>


                  {currentPage === 1 && pageOne()}
                  {currentPage === 2 && pageTwo()}
                  {currentPage === 3 && pageThree()}
                  {currentPage === 4 && confirmationPage()}
                </div>
          </div>
          )}
      
    </>
 );
};

export default PublishProjectForm;

             
