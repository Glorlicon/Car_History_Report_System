import React from 'react';
import { CarRegistration } from '../../../utils/Interfaces';
interface RegistryRegistrationDetailsFormProps {
    action: "Add" | "Edit"
    model: CarRegistration
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RegistryRegistrationDetailsForm: React.FC<RegistryRegistrationDetailsFormProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="reg-reg-form-columns">
              <div className="reg-reg-form-column">
                  <label>Car ID</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-reg-form-column">
                  <label>Owner Name</label>
                  <input type="text" name="ownerName" value={model.ownerName} onChange={handleInputChange} />
              </div>
              <div className="reg-reg-form-column">
                  <label>Odometer</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="reg-reg-form-column">
                  <label>Note</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="reg-reg-form-columns">
              <div className="reg-reg-form-column">
                  <label>Registration Number</label>
                  <input type="text" name="registrationNumber" value={model.registrationNumber} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-reg-form-column">
                  <label>License Plate Number</label>
                  <input type="text" name="licensePlateNumber" value={model.licensePlateNumber} onChange={handleInputChange}/>
              </div>
              <div className="reg-reg-form-column">
                  <label>Report Date</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
              <div className="reg-reg-form-column">
                  <label>Expirt Date</label>
                  <input type="date" name="expireDate" value={model.expireDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default RegistryRegistrationDetailsForm;