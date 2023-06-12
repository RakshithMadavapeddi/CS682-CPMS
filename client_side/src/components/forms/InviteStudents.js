import {React, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../styles/InviteLink.css";
import ErrorMessagePopup from './ErrorMessagePopup';

export default function InviteStudents({setData, data}) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);

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
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    }
  
    const handleSave = async() => {
      // do something with the name and email data, e.g. submit to server
      console.log('Name:', name);
      console.log('Email:', email);

      if (name && email) {
        try {
          const response = await axios.post( "/api/course/student" , 
            {_id:data._id, "name": name, "email": email, password: "testing"}, {
            headers: {
              'Content-Type': 'application/json',
            },
          }); 
            console.log("user created successfully");
            setData(response.data);
            setOpen(false);
        } catch (err) {
          switch (err.response.status) {
            case (401):
                navigate("/signin", {replace: true});
                break;
            case (400):
                <ErrorMessagePopup message={"Missing fields while adding students"} />;
                setOpen(false);
                break;
            case (409):
                <ErrorMessagePopup message={"Student already added to course"} />;
                setOpen(false);
                break;
            case (404):
                <ErrorMessagePopup message={"Course doesnt exist"} />;
                setOpen(false);
                break;
            default:
                navigate("/signin" , {replace: true});
                break;
          }
        }
    }}

    const handleOpenModal = () => {
      setOpen(true);
    }
  
    return (
      <div>

        <button className="open-button" onClick={handleOpenModal}>Add a Student</button>

       

                <div className="student-form-modal" style={{ display: open ? 'block' : 'none', position: 'absolute', zIndex: '999' }}>
                     
                     <div className='student-form-modal-wrapper'>    

                            <div className="student-form-modal-content">

                                <div className='student-form-top'>

                                    <div className='student-form-title'>
                                        <span>Add a Student</span>
                                    </div>

                                    {/* Close icon goes here */}
                                    <div className='student-form-close-wrapper'>
                                                        <div className='student-form-close' onClick={() => setOpen(false)}>
                                                            <div className='student-form-close-button'> 
                                                            <svg className='cSvg' xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 14 14">
                                                                <path id="ic_close_24px" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                                            </svg>
                                                            </div>
                                    </div>
                                </div>

                                
                            </div>
                                
                                
                                <div className="student-form-input-name">
                                    <label className={`student-form-input-name-label ${passwordFocused  || passwordHasValue ? 'focused' : ''}`}> Student Full Name</label>
                                    <input className="student-form-input-name-input"
                                          onFocus={() => setPasswordFocused(true)}
                                          onBlur={(e) => {
                                                              setPasswordFocused(false);
                                                              setPasswordHasValue(e.target.value !== '');
                                                          }}
                                            type="text"
                                            id="name" required value={name} onChange={handleNameChange} />
                                </div>

                                <div className="student-form-input-email">
                                    <label className={`student-form-input-email-label ${resourcesFocused  || resourcesHasValue ? 'focused' : ''}`} >Student Email ID</label>
                                    <input className="student-form-input-email-input"
                                            onFocus={() => setResourcesFocused(true)}
                                            onBlur={(e) => {
                                                              setResourcesFocused(false);
                                                              setResourcesHasValue(e.target.value !== '');
                                                          }}
                                            type="email" id="email" value={email} required onChange={handleEmailChange} />
                                </div>

                                <div className="student-form-button-group">
                                    <button className="student-form-save-button" onClick={handleSave}>Save</button>
                                </div>
        
                    </div>
                </div>
            </div>
      </div> 
    );
}
