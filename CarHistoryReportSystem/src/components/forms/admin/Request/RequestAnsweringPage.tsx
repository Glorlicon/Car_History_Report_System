import React from 'react';
import { COLORS } from '../../../../utils/const/Colors';
import { AdminRequest } from '../../../../utils/Interfaces';

interface RequestAnsweringPage {
    action: "Add" | "Edit"
    model: AdminRequest
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RequestAnsweringPage: React.FC<RequestAnsweringPage> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>Status</label>
                  <select name="status" onChange={handleInputChange}>
                      <option value="1">Approve</option>
                      <option value="2">Rejected</option>
                  </select>
              </div>
              <div className="ad-car-form-column">
                  <label>Response</label>
                  <input type="text" name="response" onChange={handleInputChange} className="TextField" />
              </div>
          </div>
          <div className="ad-car-form-columns">

          </div>
          <div className="ad-car-form-column">

          </div>

      </>
  );
}

export default RequestAnsweringPage;