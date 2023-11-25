import React, { useState } from 'react';
import { CarDealer, DataProvider, EditDataProvider, workingTimes, } from '../../../utils/Interfaces';
interface CarDealerProfilePageProps {
    action: "Add" | "Edit";
    userDetails: EditDataProvider;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number, field?: string) => void;
}
const CarDealerProfilePage: React.FC<CarDealerProfilePageProps> = ({
    action,
    userDetails,
    handleInputChange,
}) => {
    const edit = action === "Edit"

    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    



    return (
        <>
            <div className="dealer-car-sales-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>Shop Name:</label>
                    <input type="text" name="name" value={userDetails.name} onChange={handleInputChange} />
                </div>
                <div className="dealer-car-sales-form-column">
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={userDetails.phoneNumber} onChange={handleInputChange} />
                </div>
                
            </div>
            <div className="dealer-car-sales-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>Working Schedule: </label>
                    {userDetails?.workingTimes?.map((day, index) => (
                        <div className="dealer-schedule" key={index}>
                            <div className="label">
                                <label className="dayofweek">{daysOfWeek[day.dayOfWeek]}:</label>
                            </div>
                            <div className="input">
                                <input
                                    className="time-input"
                                    type="time"
                                    name="startHour"
                                    value={day.isClosed ? '' : `${String(day.startHour).padStart(2, '0')}:${String(day.startMinute).padStart(2, '0')}`}
                                    disabled={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'startHour')}
                                />
                                <p className="dealer-schedule-separator">-</p>
                                <input
                                    className="time-input"
                                    type="time"
                                    name="endHour"
                                    value={day.isClosed ? '' : `${String(day.endHour).padStart(2, '0')}:${String(day.endMinute).padStart(2, '0')}`}
                                    disabled={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'endHour')}
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