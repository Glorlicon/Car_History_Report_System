import React from 'react';
import { CarModel } from '../../../../utils/Interfaces';

interface CarModelModalCapacityProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CarModelCapacityPage: React.FC<CarModelModalCapacityProps> = ({
    model,
    handleInputChange
}) => {
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Riding Capacity</label>
                    <input type="number" name="ridingCapacity" value={model.ridingCapacity} onChange={handleInputChange} min="0" />
                </div>
                <div className="manu-car-model-form-column">
                    <label>Person Carried Number</label>
                    <input type="number" name="personCarriedNumber" value={model.personCarriedNumber} onChange={handleInputChange} min="0" />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Seat Number</label>
                    <input type="number" name="seatNumber" value={model.seatNumber} onChange={handleInputChange} min="0" />
                </div>
                <div className="manu-car-model-form-column">
                    <label>Laying Place Number</label>
                    <input type="number" name="layingPlaceNumber" value={model.layingPlaceNumber} onChange={handleInputChange} min="0" />
                </div>
            </div>
      </>
  );
}

export default CarModelCapacityPage;