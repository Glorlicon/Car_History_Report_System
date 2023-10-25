import React from 'react';
import { Car, CarModel } from '../../../../utils/Interfaces';

interface CarIdentificationPageProps {
    action: "Add" | "Edit"
    model: Car
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    carModels: CarModel[]
}
const CarIdentificationPage: React.FC<CarIdentificationPageProps> = ({
    action,
    model,
    handleInputChange,
    carModels
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>VIN</label>
                  <input type="text" name="vinId" value={model.vinId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="ad-car-form-column">
                  <label>License Plate Number</label>
                  <input type="text" name="licensePlateNumber" value={model.licensePlateNumber} onChange={handleInputChange} />
              </div>
          </div>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>Model</label>
                  <select disabled={edit} name="modelId" value={model.modelId} onChange={handleInputChange}>
                      {carModels.map((manu: any, index: number) => (
                          <option key={index} value={manu.modelID}>{manu.modelID}</option>
                      ))}
                  </select>
              </div>
          </div>
      </>
  );
}

export default CarIdentificationPage;