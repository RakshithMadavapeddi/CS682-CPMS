import React from 'react';
import "../../styles/confirmationForm.css"

export default function ErrorMessagePopup({ message }) {

    const [open , setOpen] = React.useState(true);

    return (
    
      <div>
      { open && 
        <div className="ConfirmationPopupContainer">
        <div className="ConfirmationPopup">
          <p>{message}</p>
          <div className="ConfirmationButtons">
            <button onClick={()=>setOpen(false)}>Ok</button>
          </div>
        </div>
        </div>
      }
      </div>
    );
  }