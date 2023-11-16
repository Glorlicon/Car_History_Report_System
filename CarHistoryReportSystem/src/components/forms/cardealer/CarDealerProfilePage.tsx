import React, { useState } from 'react';
import { CarDealer, workingTimes, } from '../../../utils/Interfaces';
interface CarDealerProfilePageProps {
    action: "Add" | "Edit";
    User: CarDealer;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleScheduleChange: (index: number, field: string, value: string | boolean) => void; // Add this line
}
const CarDealerProfilePage: React.FC<CarDealerProfilePageProps> = ({
    action,
    User,
    handleInputChange,
    handleScheduleChange // Make sure to destructure this prop
}) => {
    const edit = action === "Edit"

    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    



    return (
        <>
            <div className="dealer-car-sales-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>Shop Name:</label>
                    <input type="text" name="description" value={User.userName} onChange={handleInputChange} />
                </div>
                <div className="dealer-car-sales-form-column">
                    <label>Phone Number:</label>
                    <input type="text" name="carId" value={User.userName} onChange={handleInputChange} />
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
                                    onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                                />
                                <p className="dealer-schedule-separator">-</p>
                                <input
                                    className="time-input"
                                    type="text"
                                    name="endTime"
                                    value={day.endTime}
                                    disabled={day.isClosed}
                                    onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                                />
                                <input
                                    id={`closed-${index}`}
                                    type="checkbox"
                                    checked={day.isClosed}
                                    onChange={(e) => handleScheduleChange(index, 'isClosed', e.target.checked)}
                                />
                                <label htmlFor={`closed-${index}`}>Closed</label>
                            </div>
                            
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default CarDealerProfilePage;