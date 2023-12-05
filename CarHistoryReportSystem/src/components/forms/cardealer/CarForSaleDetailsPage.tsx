import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
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
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="dealer-car-sales-form-columns-2">
              <div className="dealer-car-sales-form-column">
                  <label>{t('Description')}</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="dealer-car-sales-form-column">
                  <label>{t('VIN')}</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="dealer-car-sales-form-column">
                  <label>{t('Price')}</label>
                  <input type="number" name="price" value={model.price} onChange={handleInputChange} min="0" />
              </div>
          </div>
          <div className="dealer-car-sales-form-columns-2">
              <div className="dealer-car-sales-form-column">
                  <label>{t('Features')}: </label>
                  <input type="text" name="feature" value={feature} onChange={e => setFeature(e.target.value)} />
                  <button className="dealer-car-sales-add-feature-btn" type="button" onClick={handleAddFeature}>+{t('Add Feature')}</button>
                  <ul className="dealer-car-sales-feature-list">
                      {model.features.map((f, index) => (
                          <li key={index} className="dealer-car-sales-feature-list-item">
                              <span style={{ marginRight: '10px' }}>{f}</span>
                              <button className="dealer-car-sales-remove-feature-btn" type="button" onClick={() => handleRemoveFeature(index)}>{t('Remove Feature')}</button>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </>
  );
}

export default CarForSaleDetailsPage;