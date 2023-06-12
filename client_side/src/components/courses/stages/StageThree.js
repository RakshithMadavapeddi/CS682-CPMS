import React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import {
    TablePagination, 
    Paper, 
    Toolbar, 
    Typography, 
    IconButton, 
  } from '@mui/material';
  import { styled, alpha } from '@mui/material/styles';
  import InputBase from '@mui/material/InputBase';
  
  
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    border: "1.5px solid #9F9F9F",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: "100%",
    marginRight:"1rem",
    marginLeft: 0,
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      marginLeft: theme.spacing(1),
      '&:focus': {
        width: '30ch', // Increase the focused width here
      },
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: "none",
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: "100%",
      height: '100%',
      boxShadow: 'none',
      [theme.breakpoints.up('sm')]: {
        width: '40ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
  
  const StyledPaper = styled(Paper)(({ theme }) => ({
    marginLeft: theme.spacing(7),
    background: "whitesmoke" ,
    borderRadius: "10px",
    marginRight : theme.spacing(7),
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(7),
  }));
  
  const HeaderTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: "#0097EB" ,
    fontSize: "16px",
    fontFamily : "Poppins",
    color: theme.palette.common.white,
    whiteSpace: "normal",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }));
  
  const HoverTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      cursor: 'pointer',
    },
  }));
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: "14.5px",
    fontFamily: "Poppins",
    whiteSpace: "normal",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "1px"
  }));


export default function StageThree({ data }) {
    console.log(data);
  const projects = data.projects;
  const students = data.users;
  const assignedProjects = data.assignedProject;

  function getProjectName(projectID) {
    const project = projects.find((proj) => proj._id === projectID);
    return project ? project.name : '';
  }
  
  function getStudentName(studentID) {
    const student = students.find((user) => user._id === studentID);
    return student ? student.email : '';
  }


  function getProjects(projectID) {
    const filtered = assignedProjects.filter((project) => project.project === projectID);
    return filtered.map((assignment, index) => (
      <TableRow sx={{height:"30px"}} key={index}>
        {index === 0 && (
          <StyledTableCell sx={{width:"50%", paddingLeft:"25px"}}  rowSpan={filtered.length}>{getProjectName(projectID)}</StyledTableCell>
        )}
        <StyledTableCell sx={{width:"40%"}} >{getStudentName(assignment.student)}</StyledTableCell>
      </TableRow>
    ));
  }

    const [selectedStudent , setSelectedStudent] = React.useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchName, setSearchName] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);



    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  

  return (
    
<StyledPaper>
<Toolbar sx={{height:"100px"}}>
         
         <Typography
           variant="h5"
           noWrap
           component="div"
           sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } , color: "#0097EB", fontFamily:"Poppins" }}
         >
           Assigned Projects
         </Typography>
</Toolbar>

<TableContainer >
  <Table sx={{ width: '100%' }}>
    <TableHead>
      <TableRow sx={{height:"30px" }}>
        <HeaderTableCell sx={{width:"50%", paddingLeft:"25px"}} >Project Name</HeaderTableCell>
        <HeaderTableCell sx={{width:"40%"}} >Student Email</HeaderTableCell>
      </TableRow>
    </TableHead>
    <TableBody>
          {projects.map((project) => getProjects(project._id))}
    </TableBody>
  </Table>
</TableContainer>
<TablePagination
  sx = {{marginRight:"1.5rem"}}
  component="div"
  count={students.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage} />
</StyledPaper>

  );
}
