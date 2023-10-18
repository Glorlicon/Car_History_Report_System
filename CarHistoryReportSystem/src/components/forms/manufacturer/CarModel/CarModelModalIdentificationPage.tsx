import React from 'react';
import { CarModel, Manufacturer } from '../../../../utils/Interfaces';
//fix later
interface CarModelModalIdentificationProps {
    action: "Add" | "Edit"
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarModelModalIdentificationPage: React.FC<CarModelModalIdentificationProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>Model ID</label>
                    <input type="text" name="modelID" value={model.modelID} onChange={handleInputChange} required disabled={edit} />
                </div>
                <div className="manu-car-model-form-column">
                    <label>Country</label>
                    <input type="text" name="country" value={model.country} onChange={handleInputChange} />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>Released Date</label>
                    <input type="date" name="releasedDate" value={model.releasedDate} onChange={handleInputChange} />
                </div>
            </div>
      </>    
  );
}

export default CarModelModalIdentificationPage;