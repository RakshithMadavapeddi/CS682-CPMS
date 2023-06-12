import React from 'react';
import ConfirmationPopup from './ConfimationPopup';
import axios from 'axios';
import ErrorMessagePopup from './ErrorMessagePopup';
import { useNavigate } from 'react-router-dom';

function DeleteCourseForm({_id , setData , data}) {

    const [errorMessage, setErrorMessage] = React.useState('');
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const message = "Are you sure you want to delete this course ?"

    async function onYes() {
        try {
          await axios.delete(`/api/course/${_id}`);
          const updatedData = data.filter(course => course._id !== _id);
          setData(updatedData);
          setOpen(false);
        } catch (error) {
          setOpen(false);
          if (error.response) {
            switch (error.response.status) {
              case 401:
                navigate("/signin", { replace: true });
                break;
              case 404:
                setErrorMessage("Course doesn't exist.");
                break;
              case 400:
                setErrorMessage("Missing Course id.");
                break;
              default:
                setErrorMessage("Internal server error. Please try again.");
                break;
            }
          } else {
            console.log(error);
            setErrorMessage("An unknown error occurred. Please try again.");
          }
        }
    }
      

    function onNo() {
        setOpen(false);
    }

    return (
        <div>
            {errorMessage && 
                <ErrorMessagePopup message={errorMessage} /> }
            <button onClick={()=>setOpen(true)} >Delete</button>
            {open && <ConfirmationPopup message={message}  onYes={onYes} onNo={onNo} />}
        </div>
    )
}

export default DeleteCourseForm;