import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "./ConfimationPopup";
import ErrorMessagePopup from "./ErrorMessagePopup";
import React from "react";
import axios from "axios";

export default function DeleteStudentForm({student, data, setData}) {

    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    async function onYes() {
        try {
            console.log(data._id);
            console.log(student._id);
            const response = await axios.delete("/api/courses/student", {
                data: { courseId: data._id, studentId: student._id },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            

            const updateUsers = data.users.filter(user => user._id !== student._id);
            const updatedData = { ...data, users: updateUsers };
            setData(updatedData);
        } catch (err) {
            switch (err.response.status) {
                case 401 :
                    setOpen(false);
                    navigate("/sigin", {replace: true});
                    break;
                case 404: 
                    setOpen(false);
                    <ErrorMessagePopup message={"Student/ course not found"} />
                    break;
                default:
                    setOpen(false);
                    <ErrorMessagePopup message={""} />
                    break;
            }
        }
    }

    function onNo() {
        setOpen(false);
    }

    return (
        <div>
            <button onClick={()=>setOpen(true)}>Delete</button>
            {open && <ConfirmationPopup  message={"Are you sure you want to delete this student ?"}  onYes={onYes} onNo={onNo} />}
        </div>
    )
}