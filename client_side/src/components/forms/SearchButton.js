import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import "../../styles/searchButton.css"

const SearchBar = ({completeData, setFilteredData, filterParameter }) => {
  
const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (!searchTerm) {
        setFilteredData(completeData);
    } else {
        const filteredData = completeData.filter(
            (item) => item[filterParameter].toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filteredData);
    } 
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredData(completeData);
  };

  return (
    <div>
      <TextField
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyPress={handleKeyPress}
        label="Search"
      />
      <Button onClick={handleSearch} variant="contained" color="primary">
        Search
      </Button>
      <Button onClick={handleClear} variant="contained" color="secondary">
        Clear
      </Button>
    </div>
  );
};

SearchBar.propTypes = {
  completeData: PropTypes.array.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  filterParameter: PropTypes.string.isRequired,
};

export default SearchBar;
