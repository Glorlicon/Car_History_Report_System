import React from 'react';
import { CarInsurance } from '../../../utils/Interfaces';
interface InsuranceCompanyInsuranceDetailsFormProps {
    action: "Add" | "Edit"
    model: CarInsurance
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const InsuranceCompanyInsuranceDetailsForm: React.FC<InsuranceCompanyInsuranceDetailsFormProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="ins-ins-form-columns">
              {edit && (
                  <div className="ins-ins-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="ins-ins-form-column">
                  <label>Insurance Number</label>
                  <input type="text" name="insuranceNumber" value={model.insuranceNumber} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="ins-ins-form-column">
                  <label>Car VIN id</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="ins-ins-form-column">
                  <label>Description</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="ins-ins-form-column">
                  <label>Note</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="ins-ins-form-columns">
              <div className="ins-ins-form-column">
                  <label>Odometer</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="ins-ins-form-column">
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={model.startDate} onChange={handleInputChange} />
              </div>
              <div className="ins-ins-form-column">
                  <label>End Date</label>
                  <input type="date" name="endDate" value={model.endDate} onChange={handleInputChange} />
              </div>
              <div className="ins-ins-form-column">
                  <label>Report Date</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default InsuranceCompanyInsuranceDetailsForm;