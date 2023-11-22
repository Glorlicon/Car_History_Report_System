import React from 'react';
import { CarModel, CarRecalls } from '../../../../utils/Interfaces';

interface CarRecallAddModalCapacityProps {
    action: "Add" | "Edit"
    recall: CarRecalls,
    models?: CarModel[],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CarRecallAddModal: React.FC<CarRecallAddModalCapacityProps> = ({
    action,
    recall,
    models,
    handleInputChange
}) => {
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>Model</label>
                    <select name="modelId" value={recall.modelId} onChange={handleInputChange}>
                        {models?.map((m: any, index: number) => (
                            <option key={index} value={m.modelID}>{m.modelID}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Description</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
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

export default CarRecallAddModal;