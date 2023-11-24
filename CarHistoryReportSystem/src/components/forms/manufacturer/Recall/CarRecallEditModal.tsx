import React from 'react';
import { CarModel, CarRecalls } from '../../../../utils/Interfaces';

interface CarRecallEditModalCapacityProps {
    action: "Edit" | "Add"
    model: CarRecalls,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CarRecallEditModal: React.FC<CarRecallEditModalCapacityProps> = ({
    action,
    model,
    handleInputChange
}) => {
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>ModelId</label>
                    <input type="text" name="modelId" value={model.modelId} onChange={handleInputChange} required disabled />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Description</label>
                    <input type="text" name="description" value={model.description} onChange={handleInputChange} min="0" />
                </div>
                {/*ẩn vì date có thể lấy ngày hiện tại luôn*/}
                {/*<div className="ad-car-model-form-column">*/}
                {/*    <label>Date</label>*/}
                {/*    <input type="date" name="recallDate" onChange={handleInputChange} min="0" />*/}
                {/*</div>*/}
            </div>
      </>
  );
}

export default CarRecallEditModal;