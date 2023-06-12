import {React, useState} from 'react';
import "../../styles/InviteLink.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SendInviteLinkForm({handleChange}) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);
  
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

          <div>
          <button className="invite-client" onClick={handleOpenModal}>Send Invitation</button>
          </div>
            
            <div className="modal">
                    <div className="modal-content" style={{ display: show ? 'block' : 'none' }}>
                      <button className="close-button" onClick={() => setShow(false)}>x</button>
                      <h2>Enter your name and email</h2>
                      <div className="input-group">
                        <label>Name:</label>
                        <input type="text" id="name" required value={name} onChange={handleNameChange} />
                      </div>xw
                      <div className="input-group">
                        <label>Email:</label>
                        <input type="email" id="email" value={email} required onChange={handleEmailChange} />
                      </div>
                      <div className="button-group">
                        <button className="save-button" onClick={handleSave}>Save</button>
                      </div>
                </div>
            </div>

      </div> 
    );
}
  

export default SendInviteLinkForm;
