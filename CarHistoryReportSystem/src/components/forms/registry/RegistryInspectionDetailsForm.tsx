import React from 'react';
import { CarInspectionHistory } from '../../../utils/Interfaces';
interface RegistryInspectionDetailsFormProps {
    action: "Add" | "Edit"
    model: CarInspectionHistory
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RegistryInspectionDetailsForm: React.FC<RegistryInspectionDetailsFormProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="reg-inspec-form-columns">
              {edit && (
                  <div className="reg-inspec-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="reg-inspec-form-column">
                  <label>Car ID</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>Description</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>Odometer</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="reg-inspec-form-column">
                  <label>Note</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="reg-inspec-form-columns">
              <div className="reg-inspec-form-column">
                  <label>Inspection Number</label>
                  <input type="text" name="inspectionNumber" value={model.inspectionNumber} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>Report Date</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>Inspect Date</label>
                  <input type="date" name="inspectDate" value={model.inspectDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default RegistryInspectionDetailsForm;