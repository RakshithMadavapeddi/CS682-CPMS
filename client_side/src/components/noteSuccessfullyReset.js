import React from 'react';
import camsBlue from '../../assets/camsBlue.png';
import './noteSuccessfullyResetStyles.css'

function noteSuccessfullyReset() {
    return (
        <div className='noteSuccessfullyReset'>
            <div className='noteSuccessfullyReset-container'>
                <form className='noteSuccessfullyReset-actualForm'>
                    <div className='noteSuccessfullyReset-Logo-Help'>

                        {/* logo goes here */}
                        <div className='noteSuccessfullyReset-logo'>
                            <div class="noteSuccessfullyReset-camsBlue"> <img src={camsBlue} alt="CAMS Logo" />  </div>
                        </div>

                        {/* Help icon goes here */}
                        <div className='noteSuccessfullyReset-help'>
                            <div className='noteSuccessfullyReset-question'>
                                <svg className='qSvg' xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 29 29">
                                    <path id="ic_help_outline_24px" d="M15.05,25.2h2.9V22.3h-2.9ZM16.5,2A14.5,14.5,0,1,0,31,16.5,14.505,14.505,0,0,0,16.5,2Zm0,26.1A11.6,11.6,0,1,1,28.1,16.5,11.615,11.615,0,0,1,16.5,28.1Zm0-20.3a5.8,5.8,0,0,0-5.8,5.8h2.9a2.9,2.9,0,1,1,5.8,0c0,2.9-4.35,2.538-4.35,7.25h2.9c0-3.263,4.35-3.625,4.35-7.25A5.8,5.8,0,0,0,16.5,7.8Z" transform="translate(-2 -2)" fill="#fff" />
                                </svg>
                            </div>
                        </div>

                    </div>

                    <div className='succesfully-reset'>

                        <span class='succesfully-reset-text-01'>Password</span>

                        <p1 class='succesfully-reset-text-01'>
                        has been reset,
                        </p1>

                        <p1 class='succesfully-reset-text-01'>
                            Successfully.
                        </p1>
                        
                    </div>



                    <div className='noteSuccessfullyReset-form-buttons'>
                        <button className='noteSuccessfullyReset-button-02'>Return to Sign in</button>
                    </div>

                </form>
            </div>

            <div className='plain-footer'>

            </div>
        </div>
    );
}

export default noteSuccessfullyReset