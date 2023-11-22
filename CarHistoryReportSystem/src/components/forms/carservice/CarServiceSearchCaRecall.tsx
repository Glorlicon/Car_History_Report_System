import React from 'react';
import { CarModel, CarRecalls, CarServices, Services } from '../../../utils/Interfaces';

interface CarServiceSearchCarRecallCapacityProps {
    action: "Add" | "Edit"
    searchQuery: string,
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}
const CarServiceSearchCarRecall: React.FC<CarServiceSearchCarRecallCapacityProps> = ({
    action,
    searchQuery,
    handleSearchChange,
}) => {
    return (
        <>
            <div className="manu-car-model-form-columns">
                    <div className="ad-car-model-form-column">
                        <label>Car ID</label>
                    <input type="text" value={searchQuery}
                        onChange={handleSearchChange} min="0" />
                    </div>
            </div>
            <div> </div>
        </>
    );
}

export default CarServiceSearchCarRecall;