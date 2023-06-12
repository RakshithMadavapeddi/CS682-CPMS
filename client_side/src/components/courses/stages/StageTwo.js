import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { styled, alpha } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import AutoAssignForm from "components/forms/AutoAssignForm";


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1.5px solid #9F9F9F",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  marginRight: "1rem",
  marginLeft: 0,
  boxShadow: "none",
  [theme.breakpoints.up("sm")]: {
    width: "40ch",
    marginLeft: theme.spacing(1),
    "&:focus": {
      width: "30ch", // Increase the focused width here
    },
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "none",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    height: "100%",
    boxShadow: "none",
    [theme.breakpoints.up("sm")]: {
      width: "40ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginLeft: theme.spacing(7),
  background: "whitesmoke",
  borderRadius: "10px",
  marginRight: theme.spacing(7),
  marginTop: theme.spacing(7),
  marginBottom: theme.spacing(7),
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#0097EB",
  fontSize: "16px",
  fontFamily: "Poppins",
  color: theme.palette.common.white,
  whiteSpace: "normal",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const HoverTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    cursor: "pointer",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "14.5px",
  fontFamily: "Poppins",
  whiteSpace: "normal",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "1px",
}));

export default function StageTwo({ data, setData }) {
  const navigate = useNavigate();
  const assignedProjects = data.assignedProject;
  const students = data.users;

  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [preferences, setPreferences] = React.useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  React.useEffect(() => {
    async function getPreferences() {
      try {
        const response = await axios.get(`/api/preference/${data._id}`);
        setPreferences(response.data);
      } catch (err) {
        console.log({ err });
      }
    }
    getPreferences();
  }, [data]);

  // pagination and search related features

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
    if (searchName) {
      const filtered = students.filter((student) =>
        student.name.includes(searchName)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  useEffect(() => {
    if (searchName) {
      const filtered = students.filter((student) => student.name.includes(searchName));
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [students, searchName]);

  //

  const assignedProjectToStudent = (userId) => {
    if (!Array.isArray(assignedProjects)) {
      return "-";
    }
    const assignedProject = assignedProjects.find(
      (ap) => ap.student.toString() === userId.toString()
    );
    return assignedProject ? assignedProject.project.name : "-";
  };

  const isPreferenceSet = (userId) => {
    if (!Array.isArray(preferences)) {
      return "NO";
    }
    const studentPreferences = preferences.find(
      (preference) => preference.student._id === userId
    );
    if (
      studentPreferences &&
      studentPreferences.projectPreferences.length > 0
    ) {
      return "Yes";
    }
    return "No";
  };

  const isAssignButtonEnabled = (userId) => {
    if (!Array.isArray(preferences)) {
      return false;
    }

    const studentPreferences = preferences.find(
      (preference) => preference.student._id === userId
    );
    if (
      studentPreferences &&
      studentPreferences.projectPreferences.length > 0
    ) {
      return true;
    }
    return false;
  };

  const renderPopup = () => {
    if (!preferences) {
      return <div></div>;
    }
    const selectedStudentPreferences = preferences.find(
      (preference) => preference.student._id === selectedStudent
    )?.projectPreferences;
    return (
      <div className="popup">
        <div className="popup-content">
          <h3>
            Assign Project to{" "}
            {students.find((student) => student._id === selectedStudent)?.name}
          </h3>
          {selectedStudentPreferences &&
            selectedStudentPreferences.map((preference) => (
              <div key={preference.project._id}>
                <p>{preference.project.name}</p>
                <p>Rank: {preference.rank}</p>
              </div>
            ))}
          <div>
            <select name="project" id="project-select">
              {data.projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                handleSavePopup(document.getElementById("project-select").value)
              }
            >
              Save
            </button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const handleClick = (studentId) => {
    setSelectedStudent(studentId);
  };

  const handleSavePopup = (projectId) => {
    // Do something with the selected project and studentId
    console.log(projectId, selectedStudent);
    setSelectedStudent(null);
  };

  const handleClose = () => {
    setSelectedStudent(null);
  };

  const isAutoAssignEnabled = () => {
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const studentPreferences = preferences.find(
        (preference) => preference.student._id === student._id
      );
      if (
        !studentPreferences ||
        studentPreferences.projectPreferences.length === 0
      ) {
        return false;
      }
    }
    return true;
  };
  

  return (
    <div>

      {selectedStudent && renderPopup()}   
      <StyledPaper>
        <Toolbar sx={{ height: "100px" }}>

            {/*    title of the table   */}

          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              color: "#0097EB",
              fontFamily: "Poppins",
            }}
          >
            Assign Projects
          </Typography>

            {/*    search button   */}

          <Search>
            <SearchIconWrapper>
              <SearchOutlinedIcon sx={{ color: "#9F9F9F" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by Student Name"
              inputProps={{ Poppins: "search" }}
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </Search>

          {/*    action buttons goes here   */}
            <AutoAssignForm data={data} setData={setData} enabled={isAutoAssignEnabled}/>

          <Box sx={{ ml: 1.5 }}></Box>
        </Toolbar>
        <TableContainer>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow sx={{ height: "30px" }}>
                <HeaderTableCell sx={{ width: "5%", paddingLeft: "25px" }}>
                  S.No
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "25%" }}>
                  Student Name
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "25%" }}>
                  Email
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "10%"}}>
                  Preferences Set
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "30%", paddingRight: "42px" }}>
                  Assigned Project
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "5%", paddingRight: "42px" }}>
                  Actions
                </HeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <HoverTableRow key={row._id}>
                      <StyledTableCell
                        sx={{ width: "5%", paddingLeft: "25px" }}
                      >
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "25%" }}>
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "25%" }}>
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "10%" }}>
                        {isPreferenceSet(row._id)}
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "30%" }}>
                        {assignedProjectToStudent(row._id)}
                      </StyledTableCell> 
                      <StyledTableCell
                        sx={{ width: "5%", paddingRight: "42px" }}
                        align="center"
                      >
                        <button
                          onClick={() => handleClick(row._id)}
                          disabled={!isAssignButtonEnabled(row._id)}
                        >
                        Assign
                        </button>
                      </StyledTableCell>
                    </HoverTableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ marginRight: "1.5rem" }}
          component="div"
          count={students.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </div>
  );
}
