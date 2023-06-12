import React, { useState } from 'react';
import "../../styles/confirmationForm.css"

function ConfirmationPopup({ message, onYes, onNo }) {

  return (
    <div className="ConfirmationPopupContainer">
      <div className="ConfirmationPopup">
        <div className='confirm-message'>{message}</div>
        <div className="ConfirmationButtons">
          <div className='yes'>
            <button className='confirm-yes' onClick={onYes}>Yes</button>
          </div>
          <div className='no'>
            <button className='confirm-no' onClick={onNo}>No</button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;