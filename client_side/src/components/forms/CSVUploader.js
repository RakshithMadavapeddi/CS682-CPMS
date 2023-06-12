import React, { useRef, useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "../../styles/InviteLink.css";

export default function CSVUploader({ data, setData, setStudents }) {
  const fileInput = useRef();
  const [errorPairs, setErrorPairs] = useState([]);
  const [open, setOpen] = useState(false);

  function handleButtonClick() {
    setOpen(true);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Data:", results.data);
        console.log("Errors:", results.errors);
        console.log("Meta:", results.meta);

        const hasNameAndEmail =
          "name" in results.data[0] && "email" in results.data[0];

        if (!hasNameAndEmail) {
          console.log("error in the csv file");
          console.log(results);
          return;
        }

        processData(results.data);
      },
    });
  }

  function processData(data) {
    const errorData = [];

    for (const row of data) {
      if (
        !("name" in row) ||
        !("email" in row) ||
        Object.keys(row).length !== 2
      ) {
        errorData.push(row);
      }
    }

    setErrorPairs(errorData);
  }

  function handleClose() {
    setOpen(false);
  }

  async function saveData() {
    const failedData = [];
    for (const row of errorPairs) {
      try {
        // Replace with your actual API request
        const response = await axios.post("/api/course/student", {
          _id: data._id,
          name: row.name,
          email: row.email,
          password: "testing",
        });
        setData(response.data);
        setStudents(response.data.users);
      } catch (error) {
        failedData.push(row);
      }
    }

    // Export the failed data as a CSV file
    exportToCSV(failedData, "failed_data.csv");
  }

  function exportToCSV(data, filename) {
    if (data) {
      const csvData = Papa.unparse(data);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setOpen(false);
  }

  return (
    <div>
      <button className="csv-form-save-button" onClick={handleButtonClick}>
        Add Multiple Students
      </button>

      {open && (
        <div>
          <div className="attachment-wrapper">
             <div className="attachment-wrapper-modal-content">


                    <div className='attachment-top'>
                            
                            {/* Title goes here */}
                    
                              <div className='attachment-title'> 
                                  <span class='attachment-title-01'>Add Multiple Students</span>
                              </div>
              

                            {/* Close icon goes here */}
                            <div className='attachment-close' onClick={handleClose}>
                                <div className='attachment-close-button'> 
                                  <svg className='cSvg' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                      <path id="ic_close_24px" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                  </svg>
                                </div>
                            </div>

                    </div>

                      <div className="attachment-container">
                        <div className="uploadFile">
                          <svg
                            className="uploadSvg"
                            xmlns="http://www.w3.org/2000/svg"
                            width="155.48"
                            height="115.653"
                            viewBox="0 0 119.48 79.653"
                          >
                            <path
                              id="ic_cloud_upload_24px"
                              d="M96.331,34.069a37.3,37.3,0,0,0-69.7-9.957A29.858,29.858,0,0,0,29.87,83.653H94.588a24.82,24.82,0,0,0,1.742-49.584ZM69.7,48.8V68.718H49.783V48.8H34.848L59.74,23.913,84.632,48.8Z"
                              transform="translate(0 -4)"
                              fill="#2b6d95"
                              opacity="0.403"
                            />
                          </svg>
                        </div>

                        <div className="uploadFile-instructions">
                          <span className="instructions-01">Drag & drop a CSV file here</span>
                          <span className="instructions-02">
                            (Make sure the file has two columns "name" & "email")
                          </span>
                        </div>

                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            accept=".csv"
                            ref={fileInput}
                            style={{ display: "none" }}
                            onChange={handleFileUpload}
                          />
                          <label htmlFor="upload-csv">
                            <button
                              className="custom-file-button"
                              onClick={() => fileInput.current.click()}
                            >
                              Choose File
                            </button>
                          </label>
                        </div>

                      </div>
                            {/* save-button */}
                            <div className="attachment-button-group">
                                    <button className="attachment-save-button" onClick={saveData}>Save</button>
                      </div>  
                </div>
              </div>
        </div>
      )}

      {/* 
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".csv"
            ref={fileInput}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-csv">
            <Button
              variant="contained"
              color="primary"
              component="span"
              onClick={() => fileInput.current.click()}
            >
              Choose File
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveData}>Save</Button>
        </DialogActions>
      </Dialog>
      */}
      
    </div>
  );
}
