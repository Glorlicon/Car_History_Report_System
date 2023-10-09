import React from 'react';
import { FUEL_TYPES } from '../../../../utils/const/FuelTypes';
import { CarModel } from '../../../../utils/Interfaces';

interface CarModelModalEngineProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarModelModalEnginePage: React.FC<CarModelModalEngineProps> = ({
    model,
    handleInputChange
}) => {
    return (
        <>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Fuel Type</label>
                    <select name="fuelType" value={model.fuelType} onChange={handleInputChange}>
                        <option value={FUEL_TYPES.BioDiesel}>BioDiesel</option>
                        <option value={FUEL_TYPES.Diesel}>Diesel</option>
                        <option value={FUEL_TYPES.Ethanol}>Ethanol</option>
                        <option value={FUEL_TYPES.Gasoline}>Gasoline</option>
                    </select>
                </div>
                <div className="ad-car-model-form-column">
                    <label>Maximum Output</label>
                    <input type="number" name="maximumOutput" value={model.maximumOutput} onChange={handleInputChange} min="0" />
                </div>
            </div>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Engine Displacement</label>
                    <input type="number" name="engineDisplacement" value={model.engineDisplacement} onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>RPM</label>
                    <input type="number" name="rpm" value={model.rpm} onChange={handleInputChange} min="0" />
                </div>
            </div>
      </>
  );
}

export default CarModelModalEnginePage;