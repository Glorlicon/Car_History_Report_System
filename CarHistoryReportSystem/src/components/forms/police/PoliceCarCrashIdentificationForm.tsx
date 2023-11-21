import React from 'react';
import { CarCrash } from '../../../utils/Interfaces';
interface PoliceCarCrashIdentificationFormProps {
    action: "Add" | "Edit"
    model: CarCrash
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const PoliceCarCrashIdentificationForm: React.FC<PoliceCarCrashIdentificationFormProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="pol-crash-form-columns">
              {edit && (
                  <div className="pol-crash-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="pol-crash-form-column">
                  <label>Description</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="pol-crash-form-column">
                  <label>Car VIN id</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="pol-crash-form-column">
                  <label>Note</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="pol-crash-form-columns">
              <div className="pol-crash-form-column">
                  <label>Odometer</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="pol-crash-form-column">
                  <label>Accident Date</label>
                  <input type="date" name="accidentDate" value={model.accidentDate} onChange={handleInputChange} />
              </div>
              <div className="pol-crash-form-column">
                  <label>Report Date</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default PoliceCarCrashIdentificationForm;