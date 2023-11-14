import React from 'react';
import { CarDealer, } from '../../../utils/Interfaces';
interface CarDealerProfilePageProps {
    action: "Add" | "Edit"
    User: CarDealer
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarDealerProfilePage: React.FC<CarDealerProfilePageProps> = ({
    action,
    User,
    handleInputChange
}) => {
    const edit = action === "Edit"
    return (
        <>
            <div className="dealer-car-sales-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>Description</label>
                    <input type="text" name="description" value={User.userName} onChange={handleInputChange} />
                </div>
                <div className="dealer-car-sales-form-column">
                    <label>Car VIN id</label>
                    <input type="text" name="carId" value={User.userName} onChange={handleInputChange} disabled={edit} />
                </div>
                <div className="dealer-car-sales-form-column">
                    <label>Price</label>
                    <input type="number" name="price" value={User.userName} onChange={handleInputChange} min="0" />
                </div>
                
            </div>
            <div className="dealer-car-sales-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>Working Schedule: </label>
                    <div className="dealer-schedule">
                        <input type="text" name="feature" />
                        <input type="text" name="feature" />
                        <input type="checkbox" />
                        <label>Closed</label>
                    </div>
                    <div className="dealer-schedule">
                        <input type="text" name="feature" />
                        <input type="text" name="feature" />
                        <input type="checkbox" />
                        <label>Closed</label>
                    </div>
                    <div className="dealer-schedule">
                        <input type="text" name="feature" />
                        <input type="text" name="feature" />
                        <input type="checkbox" />
                        <label>Closed</label>
                    </div>
                    <div className="dealer-schedule">
                        <input type="text" name="feature" />
                        <input type="text" name="feature" />
                        <input type="checkbox" />
                        <label>Closed</label>
                    </div>
                    <div className="dealer-schedule">
                        <input type="text" name="feature" />
                        <input type="text" name="feature" />
                        <input type="checkbox" />
                        <label>Closed</label>
                    </div>
                    <div className="dealer-schedule">
                        <input type="text" name="feature" />
                        <input type="text" name="feature" />
                        <input type="checkbox" />
                        <label>Closed</label>
                    </div>
                    <div className="dealer-schedule">
                        <input type="text" name="feature" />
                        <input type="text" name="feature" />
                        <input type="checkbox" />
                        <label>Closed</label>
                    </div>
                    
                    
                    {/*<input type="text" name="feature" value={feature} onChange={e => setFeature(e.target.value)} />*/}
                    {/*<button className="dealer-car-sales-add-feature-btn" type="button" onClick={handleAddFeature}>+Add Feature</button>*/}
                    {/*<ul className="dealer-car-sales-feature-list">*/}
                    {/*    {model.features.map((f, index) => (*/}
                    {/*        <li key={index} className="dealer-car-sales-feature-list-item">*/}
                    {/*            <span style={{ marginRight: '10px' }}>{f}</span>*/}
                    {/*            <button className="dealer-car-sales-remove-feature-btn" type="button" onClick={() => handleRemoveFeature(index)}>Remove Feature</button>*/}
                    {/*        </li>*/}
                    {/*    ))}*/}
                    {/*</ul>*/}
                </div>
            </div>
        </>
    );
}

export default CarDealerProfilePage;