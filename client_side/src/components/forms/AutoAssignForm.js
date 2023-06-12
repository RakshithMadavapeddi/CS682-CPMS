import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function AutoAssignForm({data, setData, enabled}) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [projectCapacities, setProjectCapacities] = React.useState({});
  const [projects, setProjects] = React.useState([]);

  React.useEffect(()=>{
    setProjects(data.projects);
  }, [data])

  const handleCapacityChange = (project, capacity) => {
    setProjectCapacities({ ...projectCapacities, [project]: capacity });
  };

  const handleSave = async() => {
    if (Object.keys(projectCapacities).length === projects.length) {
      try {
        const response = await axios.post(`/api/courses/assign/${data.name}`, 
          {projectCapacities : projectCapacities},
          {headers:{credentials : true}});
        console.log(response.data);
        setData(response.data);
        setOpen(false);
      } catch (err) {
        switch(err.response.status) {
          case 401:
            alert("User not Authorized");
            setOpen(false);
            navigate('/signin', {replace:true});
            break;
          case 400:
            alert("Some student Preferences missing");
            setOpen(false);
            break;
          case 404:
            alert("Cannot perform auto assign");
            setOpen(false);
            break;
          default:
            alert("Internal server error. Try again");
            setOpen(false);
            break;
        }
      }
    } else {
      alert("Cannot leave any project capacity as empty");
    }
  }

  return (
    <div>
      <button disabled={!enabled()} onClick={() => setOpen(true)}>Auto Assign</button>
      {open && (
        <div>
          <button onClick={()=>{setOpen(false)}} >Close</button>
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.name}</td>
                  <td>
                    <select
                      value={projectCapacities[project._id] || ""}
                      onChange={(e) =>
                        handleCapacityChange(project._id, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
}
