import React, { useState } from 'react';
import { CarDealer, DataProvider, workingTimes, } from '../../../utils/Interfaces';
interface CarDealerProfilePageProps {
    action: "Add" | "Edit";
    User: DataProvider;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number, field?: string) => void;
}
const CarDealerProfilePage: React.FC<CarDealerProfilePageProps> = ({
    action,
    User,
    handleInputChange,
}) => {
    const edit = action === "Edit"

    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    



    return (
        <>
            <div className="dealer-car-sales-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>Shop Name:</label>
                    <input type="text" name="name" value={User.name} onChange={handleInputChange} />
                </div>
                <div className="dealer-car-sales-form-column">
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={User.phoneNumber} onChange={handleInputChange} />
                </div>
                
            </div>
            <div className="dealer-car-sales-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>Working Schedule: </label>
                    {User.workingTimes && User.workingTimes.map((day, index) => (
                        <div className="dealer-schedule" key={index}>
                            <div className="label">
                                <label className="dayofweek">{daysOfWeek[day.dayOfWeek - 1]}:</label>
                            </div>
                            <div className="input">
                                <input
                                    className="time-input"
                                    type="text"
                                    name="startTime"
                                    value={day.startTime}
                                    disabled={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'startTime')}
                                />
                                <p className="dealer-schedule-separator">-</p>
                                <input
                                    className="time-input"
                                    type="text"
                                    name="endTime"
                                    value={day.endTime}
                                    disabled={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'endTime')}
                                />
                                <input
                                    id={`closed-${index}`}
                                    type="checkbox"
                                    checked={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'isClosed')}
                                />
                            </div>
                            
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default CarDealerProfilePage;