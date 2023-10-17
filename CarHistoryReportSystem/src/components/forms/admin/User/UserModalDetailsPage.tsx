import React from 'react';
import { User } from '../../../../utils/Interfaces';

interface UserModalDetailsPageProps {
    model: User
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const UserModalDetailsPage: React.FC<UserModalDetailsPageProps> = ({
    model,
    handleInputChange
}) => {
  return (
      <div className="ad-user-form-columns">
          <div className="ad-user-form-column">
              <label>First Name</label>
              <input type="text" name="firstName" value={model.firstName} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>Last Name</label>
              <input type="text" name="lastName" value={model.lastName} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>Phone</label>
              <input type="text" name="phoneNumber" value={model.phoneNumber} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>Address</label>
              <input type="text" name="address" value={model.address} onChange={handleInputChange} required />
          </div>
      </div>
  );
}

export default UserModalDetailsPage;