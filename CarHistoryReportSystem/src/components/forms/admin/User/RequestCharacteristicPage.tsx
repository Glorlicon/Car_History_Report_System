import React from 'react';
import { COLORS } from '../../../../utils/const/Colors';
import { AdminRequest, Car, UsersRequest } from '../../../../utils/Interfaces';

interface RequestCharacteristicPage {
    action: "Add" | "Edit"
    model: AdminRequest | UsersRequest,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RequestCharacteristicPage: React.FC<RequestCharacteristicPage> = ({
    action,
    model,
    handleInputChange
}) => {
    const add = action === "Add"
  return (
      <>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>type</label>
                  <select name="type" onChange={handleInputChange}>
                      <option value="0">Data Correction</option>
                      <option value="1">Technical Support</option>
                      <option value="2">Report Inaccuracy</option>
                      <option value="3">Feedback</option>
                      <option value="4">General</option>
                  </select>
              </div>
              <div className="ad-car-form-column">
                  <label>Description</label>
                  <input type="text" name="description" onChange={handleInputChange} className="TextField" />
              </div>
          </div>
          <div className="ad-car-form-columns">
              
          </div>
          <div className="ad-car-form-column">
              
          </div>
          
      </>
  );
}



export default RequestCharacteristicPage;