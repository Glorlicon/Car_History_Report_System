import React from 'react';
import { COLORS } from '../../../../utils/const/Colors';
import { Car } from '../../../../utils/Interfaces';

interface CarCharacteristicPageProps {
    action: "Add" | "Edit"
    model: Car
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarCharacteristicPage: React.FC<CarCharacteristicPageProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
  return (
      <>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>Engine Number</label>
                  <input type="text" name="engineNumber" value={model.engineNumber} onChange={handleInputChange} />
              </div>
              <div className="ad-car-form-column">
                  <label>Modified?</label>
                  <input type="checkbox" name="isModified" checked={model.isModified} onChange={handleInputChange}/>
              </div>
          </div>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>Color</label>
                  <select name="color" value={model.color} onChange={handleInputChange}>
                      <option value={COLORS.Beige}>Beige</option>
                      <option value={COLORS.Black}>Black</option>
                      <option value={COLORS.Blue}>Blue</option>
                      <option value={COLORS.Brown}>Brown</option>
                      <option value={COLORS.Gold}>Gold</option>
                      <option value={COLORS.Gray}>Gray</option>
                      <option value={COLORS.Green}>Green</option>
                      <option value={COLORS.Orange}>Orange</option>
                      <option value={COLORS.Purple}>Purple</option>
                      <option value={COLORS.Red}>Red</option>
                      <option value={COLORS.Silver}>Silver</option>
                      <option value={COLORS.White}>White</option>
                      <option value={COLORS.Yellow}>Yellow</option>
                  </select>
              </div>
              <div className="ad-car-form-column">
                  <label>Commercial Use?</label>
                  <input type="checkbox" name="isCommercialUse" checked={model.isCommercialUse} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default CarCharacteristicPage;