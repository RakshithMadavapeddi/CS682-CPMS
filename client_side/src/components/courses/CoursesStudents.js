import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationPopup from 'components/forms/ConfimationPopup';
import CSVUploader from 'components/forms/CSVUploader';
import "../../styles/index.css";

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
  IconButton, 
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { Delete } from '@mui/icons-material';
import InviteStudents from 'components/forms/InviteStudents';


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

const getDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based, so we need to add 1
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};


export default function CoursesStudents({ course }) {

    const [data, setData] = useState(course);
    const [students , setStudents] = React.useState(course.users);
    const navigate = useNavigate();
    const [popup, setPopup] = React.useState(false);


    const [selectedStudent , setSelectedStudent] = React.useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchName, setSearchName] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);


    const handleClick = (id) => {
      setPopup(true);
      setSelectedStudent(id);
    }

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
        const filtered = students.filter((student) => student.name.includes(searchName));
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents(students);
      }
    }

    useEffect(() => {
      setStudents(data.users);
      if (searchName) {
        const filtered = students.filter((project) => project.name.includes(searchName));
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents(students);
      }
    }, [students, searchName, course]);

    async function onYes() {
      try {
          await axios.delete("/api/courses/student", {
              data: { courseId: data._id, studentId: selectedStudent },
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          

          const updateUsers = data.users.filter(user => user._id !== selectedStudent);
          setStudents(updateUsers);
          const updatedData = { ...data, users: updateUsers };
          setData(updatedData);
          setPopup(false);
      } catch (err) {
          switch (err.response.status) {
              case 401 :
                  setPopup(false);
                  navigate("/sigin", {replace: true});
                  break;
              case 404: 
                  setPopup(false);
                  break;
              default:
                  setPopup(false);
                  break;
          }
      }
    }

    function onNo() {
      setPopup(false);
    }

    return (
      <div className='courses-students'>
        {popup && <ConfirmationPopup message="Are you sure you want to delete this student ?"  onNo={onNo} onYes={onYes}/>}
        
      <StyledPaper>
        <Toolbar sx={{height:"100px"}}>
         
         <Typography
           variant="h5"
           noWrap
           component="div"
           sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } , color: "#0097EB", fontFamily:"Poppins" }}
         >
           Student Administration
         </Typography>

         <Search >
           <SearchIconWrapper>
             <SearchOutlinedIcon sx={{color: "#9F9F9F"}} />
           </SearchIconWrapper>
           <StyledInputBase
             placeholder="Search by Student Name"
             inputProps={{ 'Poppins': 'search' }}
             value={searchName}
             onChange={handleSearchNameChange}
           />
         </Search>
         <CSVUploader data={data} setData={setData} setStudents={setStudents} />

         <InviteStudents data={data} setData={setData} setStudents={setStudents} />

         <Box sx={{ml:1.5}} ></Box>
        </Toolbar>
        <TableContainer >
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{height:"30px" }}>
                <HeaderTableCell sx={{width:"5%", paddingLeft:"25px"}} >S.No</HeaderTableCell>
                <HeaderTableCell sx={{width:"40%"}} >Student Name</HeaderTableCell>
                <HeaderTableCell sx={{width:"40%"}} >Email</HeaderTableCell>
                <HeaderTableCell sx={{width:"10%"}} >Created On</HeaderTableCell>
                <HeaderTableCell sx={{width:"5%", paddingRight:"42px" }} >Actions</HeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <HoverTableRow key={row._id}>
                      <StyledTableCell sx={{ width:"5%", paddingLeft:"25px"}} >{index + 1 + page * rowsPerPage}</StyledTableCell>
                      <StyledTableCell sx={{width:"40%"}} >{row.name}</StyledTableCell>
                      <StyledTableCell sx={{width:"40%"}} >{row.email}</StyledTableCell>
                      <StyledTableCell sx={{width:"10%"}} >{getDate(row.createdAt)}</StyledTableCell>
                      <StyledTableCell sx={{width:"5%", paddingRight:"42px"}} align="center">
                        <IconButton onClick={() => handleClick(row._id)} color="error">
                          <Delete />
                        </IconButton>
                      </StyledTableCell>
                    </HoverTableRow>
                  );
                })}
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
      </div>


    );
}
