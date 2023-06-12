import React, { useState } from "react";
import axios from "axios";
import "../../styles/preference-form.css";

function PreferenceForm({ course }) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(
    Array.from({ length: course.maxPreferences }, () => "")
  );
  const [error, setError] = useState(null);

  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  const handleChange = (event, index) => {
    const value = event.target.value;
    setPreferences((prevPreferences) => [
      ...prevPreferences.slice(0, index),
      value,
      ...prevPreferences.slice(index + 1),
    ]);
  };

  const getAvailableProjects = (index) => {
    return course.projects.filter((project, projectIndex) => {
      return !preferences.some((preference, prefIndex) => {
        return prefIndex !== index && preference === project._id;
      });
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (hasDuplicates(preferences)) {
      setError("Please ensure all selected projects are unique.");
      return;
    }

    try {
      const response = await axios.put("/api/preference", {
        course: course._id,
        projectPreferences: preferences.map((preference, index) => ({
            project: preference,
            rank: index + 1,
        })),
      });
      console.log(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting preferences:", error);
    }
  };

  if (course.stage !== 2) {
    return null;
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Set Preferences</button>
      {open && (
        <form onSubmit={handleSubmit}>
          {preferences.map((preference, index) => (
            <div key={index} className="preference-field">
              <label htmlFor={`preference${index + 1}`}>
                Preference {index + 1}:
              </label>
              <select
                name={`preference${index + 1}`}
                value={preference}
                onChange={(event) => handleChange(event, index)}
                className="preference-select"
              >
                <option value="">Select a project</option>
                {getAvailableProjects(index).map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <br />
            </div>
          ))}
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default PreferenceForm;
