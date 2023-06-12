import React, { useState } from "react";
import "../../../styles/StageOne.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StageOne({ data, setData }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [maxPreferences, setMaxPreferences] = useState("");
  const [numStudentsPerProject, setNumStudentsPerProject] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async () => {
    // Save data and close the form
    if (!data.projects) {
      console.log("Please add projects into the course");
      return;
    }

    if (maxPreferences && numStudentsPerProject && deadline) {
      try {
        const response = await axios.post(
          "/api/courses/assign",
          {
            name: data.name,
            maxPreferences: maxPreferences,
            maxStudentsPerProject: numStudentsPerProject,
            preferencesDeadline: deadline,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setData(response.data);
        handleClose();
      } catch (err) {
        switch (err.response.status) {
          case 401:
            navigate("/signin", { replace: true });
            handleClose();
            break;
          case 400:
            console.log("course couldnt be found");
            break;
          case 500:
            console.log("internal error");
            break;
        }
      }
    } else {
      console.log("missing course details");
    }
  };

  const handleClose = () => {
    // Reset form data and close the form
    setMaxPreferences("");
    setNumStudentsPerProject("");
    setDeadline("");
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Form</button>
      {open && (
        <div className="form-popup">
          <div className="form-container">
            <h2>Project Preferences</h2>
            <label htmlFor="maxPreferences">
              Max Preferences for a Student:
              <input
                type="text"
                id="maxPreferences"
                value={maxPreferences}
                onChange={(e) => setMaxPreferences(e.target.value)}
              />
            </label>
            <label htmlFor="numStudentsPerProject">
              Maximum Number of Students per Project:
              <input
                type="text"
                id="numStudentsPerProject"
                value={numStudentsPerProject}
                onChange={(e) => setNumStudentsPerProject(e.target.value)}
              />
            </label>
            <label htmlFor="deadline">
              Deadline:
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </label>
            <div className="form-buttons">
              <button onClick={handleSubmit}>Save</button>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
