import React from 'react';
import { CarSalesInfo } from '../../../utils/Interfaces';

interface CarForSaleDetailsPageProps {
    action: "Add" | "Edit"
    model: CarSalesInfo
    feature: string
    setFeature: React.Dispatch<React.SetStateAction<string>>
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleAddFeature: () => void
    handleRemoveFeature: (index: number) => void
}
const CarForSaleDetailsPage: React.FC<CarForSaleDetailsPageProps> = ({
    action,
    model,
    feature,
    setFeature,
    handleInputChange,
    handleAddFeature,
    handleRemoveFeature
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="dealer-car-sales-form-columns">
              <div className="dealer-car-sales-form-column">
                  <label>Description</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="dealer-car-sales-form-column">
                  <label>Car VIN id</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="dealer-car-sales-form-column">
                  <label>Price</label>
                  <input type="number" name="price" value={model.price} onChange={handleInputChange} min="0" />
              </div>
          </div>
          <div className="dealer-car-sales-form-columns">
              <div className="dealer-car-sales-form-column">
                  <label>Features: </label>
                  <input type="text" name="feature" value={feature} onChange={e => setFeature(e.target.value)} />
                  <button className="dealer-car-sales-add-feature-btn" type="button" onClick={handleAddFeature}>+Add Feature</button>
                  <ul className="dealer-car-sales-feature-list">
                      {model.features.map((f, index) => (
                          <li key={index} className="dealer-car-sales-feature-list-item">
                              <span style={{ marginRight: '10px' }}>{f}</span>
                              <button className="dealer-car-sales-remove-feature-btn" type="button" onClick={() => handleRemoveFeature(index)}>Remove Feature</button>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </>
  );
}

export default CarForSaleDetailsPage;