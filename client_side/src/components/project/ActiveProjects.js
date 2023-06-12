import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationPopup from 'components/forms/ConfimationPopup';
import PublishProjectForm from 'components/forms/PublishProjectForm';
import ProjectPreview from './ProjectPreview';



// Import Material-UI components
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

// take these for search button
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: "1.5px solid #9F9F9F",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  marginRight:"3rem",
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
/// till here



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




// component starts from here


function ActiveProjects() {

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [popup, setPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [preview ,setPreview] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);


  // api call to get the table
  useEffect(() => {
    async function fetchTableData() {
      try {
        const response = await axios.get('/api/projects', {
          params: {
            pending: false
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTableData();
    }, []);

  useEffect(() => {
      if (searchName) {
        const filtered = projects.filter((project) => project.name.includes(searchName));
        setFilteredProjects(filtered);
      } else {
        setFilteredProjects(projects);
      }
  }, [projects, searchName]);
  

  const handleClick = (id) => {
      setPopup(true);
      setSelectedProject(id);
  }

  const handleClose = () => {
    setPreview(false);
  }

  const handleYes = async() => {
    try {
      console.log(selectedProject)
      const response = await axios.delete('/api/project/'+ selectedProject);
      
      switch (response.status) {
        case (200):
          console.log("Deleted successfully");
          setPopup(false);
          setProjects(projects.filter(p => p._id !== selectedProject));
          setSelectedProject("");
          break;
        case (401):
          console.log("Unauthorized to delete");
          navigate("/signin" , {replace: true});
          break;

        case(404):
          console.log("Cannot find the project");
          break;
        
        case(500):
          console.log("server error");
          break;
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleNo = (event) => {
    setPopup(false);
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
      const filtered = projects.filter((project) => project.name.includes(searchName));
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }  

  return (
    <>
      {popup && <ConfirmationPopup message="Are you sure you want to delete this item ?"  onNo={handleNo} onYes={handleYes}/>}
      {preview && <ProjectPreview projectId={selectedProject}  handleClose={handleClose} />}
      
      <StyledPaper>
        <Toolbar sx={{height:"100px"}}>
         
         <Typography
           variant="h5"
           noWrap
           component="div"
           sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } , color: "#0097EB", fontFamily:"Poppins" }}
         >
           Active Projects
         </Typography>


          {/*take this */}
         <Search >
           <SearchIconWrapper>
             <SearchOutlinedIcon sx={{color: "#9F9F9F"}} />
           </SearchIconWrapper>
           <StyledInputBase
             placeholder="Search by Project Name"
             inputProps={{ 'Poppins': 'search' }}
             value={searchName}
             onChange={handleSearchNameChange}
           />
         </Search>

         {/*till here */}
         
         <PublishProjectForm data={projects} setData={setProjects} />
         <Box sx={{ml:1.5}} ></Box>
        </Toolbar>
        <TableContainer >
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{height:"30px" }}>
                <HeaderTableCell sx={{width:"5%", paddingLeft:"25px"}} >S.No</HeaderTableCell>
                <HeaderTableCell sx={{width:"30%"}} >Project Name</HeaderTableCell>
                <HeaderTableCell sx={{width:"30%"}} >Skills</HeaderTableCell>
                <HeaderTableCell sx={{width:"10%"}} >Created On</HeaderTableCell>
                <HeaderTableCell sx={{width:"20%"}} >Created By</HeaderTableCell>
                <HeaderTableCell sx={{width:"5%", paddingRight:"42px" }} >Actions</HeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <HoverTableRow key={row._id}>
                      <StyledTableCell sx={{ width:"5%", paddingLeft:"25px"}} onClick={() => {setSelectedProject(row._id); setPreview(true);}} >{index + 1 + page * rowsPerPage}</StyledTableCell>
                      <StyledTableCell sx={{width:"30%"}} onClick={() => {setSelectedProject(row._id); setPreview(true);}} >{row.name}</StyledTableCell>
                      <StyledTableCell sx={{width:"30%"}} onClick={() => {setSelectedProject(row._id); setPreview(true);}} >{row.skills}</StyledTableCell>
                      <StyledTableCell sx={{width:"10%"}} onClick={() => {setSelectedProject(row._id); setPreview(true);}} >{getDate(row.createdAt)}</StyledTableCell>
                      <StyledTableCell sx={{width:"20%"}} onClick={() => {setSelectedProject(row._id); setPreview(true);}} >{row.createdBy}</StyledTableCell>
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
          count={projects.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </>
  );
}

export default ActiveProjects;
