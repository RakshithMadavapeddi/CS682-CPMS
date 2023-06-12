import {React, useState} from 'react';
import "../../styles/InviteLink.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InviteClient({handleChange}) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);

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
          const response = await axios.post("/api/user?returning=true", {"name": name, "email": email, role: "CLIENT", password: "testing"}, {
            headers: {
              'Content-Type': 'application/json',
            },
          });          
          switch(response.status) {
            case 200:
              console.log("user created successfully");
              handleChange(response.data);
              setShow(false);
              break;
            case 409:
              console.log("user already exists");
              break;
            case 401:
              console.log("user unauthorized");
              navigate("/signin", {replace: true});
              break;
            case 400:
              console.log(response.data);
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
  
    const handleOpenModal = () => {
      setShow(true);
    }
  
    return (
      <div>

          <div> <button className="invite-client" onClick={handleOpenModal}>Add a Client</button> </div>
            
            <div className="client-form-modal" style={{ display: show ? 'block' : 'none', position: 'absolute', zIndex: '999' }}>

                  <div className='client-form-modal-wrapper'>  

                    <div className="client-form-modal-content">



                        {/* clien-form-top */}
                        <div className='client-form-top'>

                              {/* form-title */}
                              <div className='client-form-title'>
                                  <span>Add a Client</span>
                              </div>

                              {/* Close icon goes here */}
                              <div className='client-form-close-wrapper'>
                                                  <div className='client-form-close' onClick={() => setShow(false)}>
                                                      <div className='client-form-close-button'> 
                                                          <svg className='cSvg' xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 14 14">
                                                              <path id="ic_close_24px" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                                          </svg>
                                                      </div>
                                                  </div>
                              </div>

                        </div>
                          
                          {/* input-name */}
                          <div className="client-form-input-name">

                            <label className={`client-form-input-name-label ${passwordFocused  || passwordHasValue ? 'focused' : ''}`}>Client Full Name</label>

                            <input className="client-form-input-name-input"
                                          onFocus={() => setPasswordFocused(true)}
                                          onBlur={(e) => {
                                                              setPasswordFocused(false);
                                                              setPasswordHasValue(e.target.value !== '');
                                                          }}
                                          type="text" id="name" required value={name} onChange={handleNameChange} />

                          </div>
                          
                          {/* input-email */}
                          <div className="client-form-input-email">

                            <label className={`client-form-input-email-label ${resourcesFocused  || resourcesHasValue ? 'focused' : ''}`}>Client Email ID</label>
                            <input className="client-form-input-email-input"
                                            onFocus={() => setResourcesFocused(true)}
                                            onBlur={(e) => {
                                                              setResourcesFocused(false);
                                                              setResourcesHasValue(e.target.value !== '');
                                                          }}
                                            type="email" id="email" value={email} required onChange={handleEmailChange} />

                          </div>


                          {/* save-button */}
                          <div className="client-form-button-group">
                                    <button className="client-form-save-button" onClick={handleSave}>Save</button>
                          </div>  

         

        </div>

        </div>

        </div>
                
           
                                                            
      </div> 
  
    );
}
  

export default InviteClient;
