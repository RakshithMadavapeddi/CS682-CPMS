import React, { useState } from 'react';
import camsBlue from '../../assets/camsBlue.png';
import '../../styles/formResetPasswordStyles.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const FormResetPassword = ({changeContent}) => {

    const navigate = useNavigate();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [email, setEmail] = useState("");

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value !== '');
    };

    const handleBack = (event) => {
        event.preventDefault();
        navigate("/signin", {replace: true});
    }

    const handleContinue = async(event) => {
        event.preventDefault();
        if (email) {
            try {
                const response = await axios.post('/api/forgot-password', 
            {email:email}, {headers:{'Content-Type': 'application/json'}});
            switch (response.status) {
                case 200:
                    console.log("succesful");
                    changeContent(2);
                    break;
                case 404:
                    console.log("Your email is not signed up");
                    break;
                case 400:
                    console.log("Email is missing");
                    break;
                case 500:
                    console.log("Email address doesnt exist");
                    break;
                }
            } catch (err) {
                console.log(err);
            }  
        } else {
            console.log("Email cannot be empty");
        }
    }

  return (
    <div className='reset-pwd'>
        <div className='reset-pwd-container'>
            <form className='reset-pwd-actualForm'>
                        <div className='reset-pwd-Logo-Help'>
                            
                                {/* logo goes here */}
                                <div className='reset-pwd-logo'>
                                    <div class="reset-pwd-camsBlue"> <img src={camsBlue} alt="CAMS Logo" />  </div>
                                </div>

                                {/* Help icon goes here */}
                                <div className='reset-pwd-help'>
                                    <div className='reset-pwd-question'> 
                                        <svg className='qSvg' xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 29 29">
                                            <path id="ic_help_outline_24px" d="M15.05,25.2h2.9V22.3h-2.9ZM16.5,2A14.5,14.5,0,1,0,31,16.5,14.505,14.505,0,0,0,16.5,2Zm0,26.1A11.6,11.6,0,1,1,28.1,16.5,11.615,11.615,0,0,1,16.5,28.1Zm0-20.3a5.8,5.8,0,0,0-5.8,5.8h2.9a2.9,2.9,0,1,1,5.8,0c0,2.9-4.35,2.538-4.35,7.25h2.9c0-3.263,4.35-3.625,4.35-7.25A5.8,5.8,0,0,0,16.5,7.8Z" transform="translate(-2 -2)" fill="#fff"/>
                                        </svg>
                                    </div>
                                </div>

                        </div>

                        <div className='reset-password'> 
                                <span class='reset-password-text-01'>Reset Password</span>
                                <p1   class='reset-password-text-02'>
                                    Enter the email associated with your account and
                                    we’ll send an email with instructions to reset your password.
                                </p1>
                        </div>

      
                <div className='reset-pwd-input-fields'>
                        <div className='reset-pwd-email'>

                                <label htmlFor="email" className={`reset-pwd-label ${isFocused || hasValue ? 'focused' : ''}`}>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    className={`reset-pwd-input ${isFocused || hasValue ? 'focused' : ''}`}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={email}
                                    onChange={(event)=>{setEmail(event.target.value)}}
                                />
                        </div>

                </div>

                <div className='reset-pwd-form-buttons'>
                        <button className='reset-pwd-button-01' onClick={handleContinue}>Send Instructions</button>
                        <button className='reset-pwd-button-02' onClick={handleBack}>Back to Sign in</button>  
                </div>                        
                
            </form>
        </div>

        <div className='plain-footer'>

        </div>
    </div>
  )
}

export default FormResetPassword