import React from 'react';
import { CarInsurance } from '../../../utils/Interfaces';
interface SearchDealerFormProps {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleSearch: () => void
}
const SearchDealerForm: React.FC<SearchDealerFormProps> = ({
    handleInputChange,
    handleSearch
}) => {
  return (
      <>
          <div className="dealer-search-bar">
              <select onChange={handleInputChange} name="services" id="services">
                  {/* Populate with options */}
                  <option value="service1">Service 1</option>
                  <option value="service2">Service 2</option>
                  {/* ... */}
              </select>

              <select onChange={handleInputChange} name="makes" id="makes">
                  {/* Populate with options */}
                  <option value="make1">Make 1</option>
                  <option value="make2">Make 2</option>
                  {/* ... */}
              </select>

              <select onChange={handleInputChange} name="radius" id="radius">
                  {/* Populate with options */}
                  <option value="10km">10km</option>
                  <option value="20km">20km</option>
                  {/* ... */}
              </select>

              <input type="text" placeholder="Search Shops" />
              <button onClick={handleSearch}>Search</button>

              <select onChange={handleInputChange} name="sort" id="sort">
                  {/* Populate with options */}
                  <option value="distance">Sort By: Distance</option>
                  <option value="rating">Sort By: Rating</option>
                  {/* ... */}
              </select>
          </div>
      </>
  );
}

export default SearchDealerForm;