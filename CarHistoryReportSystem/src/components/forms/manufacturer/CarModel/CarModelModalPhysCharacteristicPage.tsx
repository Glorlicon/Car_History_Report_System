import React from 'react';
import { BODY_TYPES } from '../../../../utils/const/BodyTypes';
import { CarModel } from '../../../../utils/Interfaces';

interface CarModelModalPhysCharacteristicProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarModelModalPhysCharacteristicPage: React.FC<CarModelModalPhysCharacteristicProps> = ({
    model,
    handleInputChange
}) => {
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>Dimension</label>
                    <input type="text" name="dimension" value={model.dimension} onChange={handleInputChange} />
                </div>
                <div className="manu-car-model-form-column">
                    <label>Wheel Formula</label>
                    <input type="text" name="wheelFormula" value={model.wheelFormula} onChange={handleInputChange} />
                </div>
                <div className="manu-car-model-form-column">
                    <label>Wheel Tread</label>
                    <input type="text" name="wheelTread" value={model.wheelTread} onChange={handleInputChange} />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>Wheel Base</label>
                    <input type="number" name="wheelBase" value={model.wheelBase} onChange={handleInputChange} min="0" />
                </div>
                <div className="manu-car-model-form-column">
                    <label>Weight</label>
                    <input type="number" name="weight" value={model.weight} onChange={handleInputChange} min="0" />
                </div>
                <div className="manu-car-model-form-column">
                    <label>Body Type</label>
                    <select name="bodyType" value={model.bodyType} onChange={handleInputChange}>
                        <option value={BODY_TYPES.Convertible}>Convertible</option>
                        <option value={BODY_TYPES.Coupe}>Coupe</option>
                        <option value={BODY_TYPES.Crossovers}>Crossovers</option>
                        <option value={BODY_TYPES.Hatchback}>Hatchback</option>
                        <option value={BODY_TYPES.Limousine}>Limousine</option>
                        <option value={BODY_TYPES.MPVs}>MPVs</option>
                        <option value={BODY_TYPES.Pickup}>Pickup</option>
                        <option value={BODY_TYPES.Sedan}>Sedan</option>
                        <option value={BODY_TYPES.SUV}>SUV</option>
                        <option value={BODY_TYPES.Van}>Van</option>
                    </select>
                </div>
                <div className="manu-car-model-form-column">
                    <label>Tire Number</label>
                    <input type="number" name="tireNumber" value={model.tireNumber} onChange={handleInputChange} min="0" />
                </div>
            </div>
        </>
  );
}

export default CarModelModalPhysCharacteristicPage;