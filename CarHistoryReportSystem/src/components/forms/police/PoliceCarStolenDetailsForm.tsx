import React from 'react';
import { CAR_STOLEN_STATUS } from '../../../utils/const/CarStolenStatus';
import { CarStolen } from '../../../utils/Interfaces';

interface PoliceCarStolenDetailsFormProps {
    action: "Add" | "Edit"
    model: CarStolen
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const PoliceCarStolenDetailsForm: React.FC<PoliceCarStolenDetailsFormProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="pol-stolen-form-columns">
              {edit && (
                  <div className="pol-stolen-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="pol-stolen-form-column">
                  <label>Description</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="pol-stolen-form-column">
                  <label>Car VIN id</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="pol-stolen-form-column">
                  <label>Note</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange}/>
              </div>
          </div>
          <div className="pol-stolen-form-columns">
              <div className="pol-stolen-form-column">
                  <label>Odometer</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0"/>
              </div>
              <div className="pol-stolen-form-column">
                  <label>Report Date</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
              <div className="pol-stolen-form-column">
                  <label>Status</label>
                  <select name="status" value={model.status ? model.status : CAR_STOLEN_STATUS.Stolen} onChange={handleInputChange}>
                      <option value={CAR_STOLEN_STATUS.Stolen}>Stolen</option>
                      <option value={CAR_STOLEN_STATUS.Found}>Found</option>
                  </select>
              </div>
          </div>
      </>
  );
}

export default PoliceCarStolenDetailsForm;