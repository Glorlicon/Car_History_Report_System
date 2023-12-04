import React from 'react';
import Select from 'react-select/dist/declarations/src/Select';
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
    const options = carModels.map(m => ({
        value: m.modelID,
        label: m.modelID
    }))
  return (
      <>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>VIN</label>
                  <input type="text" name="vinId" value={model.vinId} onChange={handleInputChange} disabled={edit} />
              </div>
          </div>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>Model</label>
                  <select disabled={edit} name="modelId" value={model.modelId} onChange={handleInputChange}>
                      <option value="-1">Not chosen</option>
                      {carModels.map((m: any, index: number) => (
                          <option key={index} value={m.modelID}>{m.modelID} {m.manufacturerName}</option>
                      ))}
                  </select>
              </div>
          </div>
      </>
  );
}

export default CarIdentificationPage;