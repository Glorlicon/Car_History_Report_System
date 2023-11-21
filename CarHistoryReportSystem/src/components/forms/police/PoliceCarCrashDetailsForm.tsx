import React from 'react';
import { CarCrash } from '../../../utils/Interfaces';
import car from '../../../car.jpg'
interface PoliceCarCrashDetailsFormProps {
    action: "Add" | "Edit"
    model: CarCrash
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleDamageLocationChange: (sideValue: number) => void
}
const PoliceCarCrashDetailsForm: React.FC<PoliceCarCrashDetailsFormProps> = ({
    action,
    model,
    handleInputChange,
    handleDamageLocationChange
}) => {
    const sides = {
        front: 1,  
        rear: 2,   
        left: 4,   
        right: 8, 
    };
    const isSideColored = (sideValue: number): boolean => {
        return (model.damageLocation & sideValue) === sideValue;
    };
    const edit = action === "Edit"
  return (
      <>
          <div className="pol-crash-form-columns">
              <div className="pol-crash-form-column">
                  <label>Location</label>
                  <input type="text" name="location" value={model.location} onChange={handleInputChange} />
              </div>
              <div className="pol-crash-form-column">
                  <label>Severity</label>
                  <input type="number" name="serverity" value={model.serverity} onChange={handleInputChange} min="0" step="0.01" />
              </div>
          </div>
          <div className="pol-crash-form-columns">
              <div className="pol-crash-form-column">
                  <label>Damage Location</label>
                  <div className="pol-crash-car-container">
                      <img src={car} alt="Car" className="pol-crash-car-image" style={{
                          borderTop: `5px solid ${isSideColored(sides.front) ? 'red' : 'black'}`,
                          borderBottom: `5px solid ${isSideColored(sides.rear) ? 'red' : 'black'}`,
                          borderLeft: `5px solid ${isSideColored(sides.left) ? 'red' : 'black'}`,
                          borderRight: `5px solid ${isSideColored(sides.right) ? 'red' : 'black'}`,
                      }} />
                  </div>
              </div>
              <div className="pol-crash-form-column">
                  <div className="pol-crash-checkboxes">
                      {Object.entries(sides).map(([key, value]) => (
                          <label key={key}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                              <input
                                  type="checkbox"
                                  checked={isSideColored(value)}
                                  onChange={() => handleDamageLocationChange(value)}
                              />
                          </label>
                      ))}
                  </div>
              </div>
          </div>
      </>
  );
}

export default PoliceCarCrashDetailsForm;