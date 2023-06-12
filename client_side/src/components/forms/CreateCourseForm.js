import {React, useState} from 'react';
import "../../styles/InviteLink.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateCourseForm({closePopup , handleChange}) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [popup, setPopup] = useState(false);
    const [description, setDescription] = useState("");

    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordHasValue, setPasswordHasValue] = useState(false);

    const [resourcesFocused, setResourcesFocused] = useState(false);
    const [resourcesHasValue, setResourcesHasValue] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);


    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value !== '');
    };
  
    const handleNameChange = (event) => {
      setName(event.target.value);
    }
  
    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    }

    const handleClose = (event) => {
        setPopup(false)
    }
  
    const handleSave = async() => {
      if (name && description) {
        try {
          const response = await axios.post("/api/course", {"name": name, "description": description}, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });          
          switch(response.status) {
            case 201:
              console.log("course created successfully");
              handleChange(response.data);
              setPopup(false);
              break;
            case 400:
                console.log("name and description cannot be missing");
                break;
            case 409:
              console.log("course name already exists");
              break;
            case 401:
              console.log("user unauthorized");
              navigate("/signin", {replace: true});
              break;
            default:
              console.log("server error");
              break;
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        //do error handling;
        console.log("missing fields");
      }
    }
  
    return (
      <div>
        <button className='create-course-button' onClick={() => setPopup(true)}>Create a Course</button>

        {popup && 
        (
            <div className='create-course-modal-wrapper'> 
              <div className="create-course-modal-content" >

              <div className='create-course-top'>

                    <div className='create-course-title'>
                          <span>Create a Course</span>
                    </div>
                   
                    {/* Close icon goes here */}
                    <div className='create-course-close-wrapper'>
                            <div className='create-course-close' onClick={handleClose}>
                               <div className='create-course-close-button'> 
                                    <svg className='cSvg' xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 14 14">
                                        <path id="ic_close_24px" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                    </svg>
                              </div>
                            </div>
                    </div>
              </div>


                    <div className="create-course-input-name">
                      <label className={`create-course-input-name-label ${passwordFocused  || passwordHasValue ? 'focused' : ''}`}>Course Name</label>
                      <input className="create-course-input-name-input"
                                          onFocus={() => setPasswordFocused(true)}
                                          onBlur={(e) => {
                                                              setPasswordFocused(false);
                                                              setPasswordHasValue(e.target.value !== '');
                                                          }}
                                          type="text"
                                          id="name" required value={name} onChange={handleNameChange} />
                    </div>

                   <div className="create-course-input-desc">
                              <label className={`create-course-input-desc-label ${resourcesFocused  || resourcesHasValue ? 'focused' : ''}`}>
                                Course Description
                              </label>
                              <textarea
                                className="create-course-input-desc-input"
                                onFocus={() => setResourcesFocused(true)}
                                onBlur={(e) => {
                                  setResourcesFocused(false);
                                  setResourcesHasValue(e.target.value !== '');
                                }}
                                id="description"
                                value={description}
                                required
                                onChange={handleDescriptionChange}
                                rows="5"
                              />
                    </div>

                    <div className="create-course-button-group">
                      <button className="create-course-save-button" onClick={handleSave}>Save</button>
                    </div>
              </div>
            </div>
        )}
      </div>
    );
} 
  

export default CreateCourseForm;
