import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationPopup from "components/forms/ConfimationPopup";
import InviteClient from "components/forms/InviteClients";

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
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { Delete } from "@mui/icons-material";


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

const getDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based, so we need to add 1
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

function PublishProjects() {
  const navigate = useNavigate();
  const [popup, setPopup] = React.useState(false);
  const [clients, setClients] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  const handleChange = (client) => {
    setClients([client, ...clients]);
  };

  useEffect(() => {
    async function fetchTableData() {
      try {
        const response = await axios.get("/api/users?role=CLIENT");
        setClients(response.data);
        console.log(response.data);
        console.log(clients);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTableData();
  }, []);

  useEffect(() => {
    if (searchName) {
      const filtered = clients.filter((client) =>
        client.name.includes(searchName)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [clients, searchName]);

  const handleClick = (id) => {
    setPopup(true);
    setSelectedClient(id);
  };

  const handleYes = async () => {
    try {
      const response = await axios.delete("/api/user/" + selectedClient);
      switch (response.status) {
        case 200:
          console.log("Deleted successfully");
          setPopup(false);
          setClients(clients.filter((p) => p.email !== selectedClient));
          setSelectedClient("");
          break;
        case 401:
          console.log("Unauthorized to delete");
          navigate("/signin", { replace: true });
          break;

        case 404:
          console.log("Cannot find the client");
          break;

        case 409:
          console.log("Cannot delete self");
          break;

        default:
          console.log("server error");
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNo = (event) => {
    setPopup(false);
  };

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
      const filtered = clients.filter((client) =>
        client.name.includes(searchName)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  };

  return (
    <div>
      {popup && (
        <ConfirmationPopup
          message="Are you sure you want to delete this client ?"
          onNo={handleNo}
          onYes={handleYes}
        />
      )}

      {/* table goes here */}

      <StyledPaper>
        <Toolbar sx={{ height: "100px" }}>
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
            Client Administration
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchOutlinedIcon sx={{ color: "#9F9F9F" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by Client Name"
              inputProps={{ Poppins: "search" }}
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </Search>

          <InviteClient handleChange={handleChange} />

          <Box sx={{ ml: 1.5 }}></Box>
        </Toolbar>
        <TableContainer>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow sx={{ height: "30px" }}>
                <HeaderTableCell sx={{ width: "5%", paddingLeft: "25px" }}>
                  S.No
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "40%" }}>
                  Client Name
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "40%" }}>Email</HeaderTableCell>
                <HeaderTableCell sx={{ width: "10%" }}>
                  Created On
                </HeaderTableCell>
                <HeaderTableCell sx={{ width: "5%", paddingRight: "42px" }}>
                  Actions
                </HeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <HoverTableRow key={row._id}>
                      <StyledTableCell
                        sx={{ width: "5%", paddingLeft: "25px" }}
                      >
                        {index + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "40%" }}>
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "40%" }}>
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "10%" }}>
                        {getDate(row.createdAt)}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ width: "5%", paddingRight: "42px" }}
                        align="center"
                      >
                        <IconButton
                          onClick={() => handleClick(row._id)}
                          color="error"
                        >
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
          sx={{ marginRight: "1.5rem" }}
          component="div"
          count={clients.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </div>
  );
}

export default PublishProjects;
