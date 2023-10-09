import React from 'react';
import { CarModel, Manufacturer } from '../../../../utils/Interfaces';
//fix later
interface CarModelModalIdentificationProps {
    action: "Add" | "Edit",
    model: CarModel,
    manufacturers: Manufacturer[],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarModelModalIdentificationPage: React.FC<CarModelModalIdentificationProps> = ({
    action,
    model,
    handleInputChange,
    manufacturers
}) => {
    const edit = action === "Edit"
    return (
        <>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Model ID</label>
                    <input type="text" name="modelID" value={model.modelID} onChange={handleInputChange} required />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Manufacturer</label>
                    <select disabled={edit} name="manufacturerId" value={model.manufacturerId} onChange={handleInputChange}>
                        {manufacturers.map((manu: any, index: number) => (
                            <option key={index} value={manu.id}>{manu.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Released Date</label>
                    <input type="date" name="releasedDate" value={model.releasedDate} onChange={handleInputChange} />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Country</label>
                    <input type="text" name="country" value={model.country} onChange={handleInputChange} />
                </div>
            </div>
      </>    
  );
}

export default CarModelModalIdentificationPage;