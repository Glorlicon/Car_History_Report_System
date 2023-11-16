import React from 'react';
import { CarModel, CarRecalls } from '../../../../utils/Interfaces';

interface CarRecallModalCapacityProps {
    action: "Add"
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CarRecallModal: React.FC<CarRecallModalCapacityProps> = ({
    action,
    model,
    handleInputChange
}) => {
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>ModelId</label>
                    <input type="text" name="modelId" value={model.modelID} onChange={handleInputChange} disabled min="0" />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Description</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
                </div>
            </div>
      </>
  );
}

export default CarRecallModal;