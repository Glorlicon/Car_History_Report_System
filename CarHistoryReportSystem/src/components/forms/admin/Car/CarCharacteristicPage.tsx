import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
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
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>{t('Engine Number')}</label>
                  <input type="text" name="engineNumber" value={model.engineNumber} onChange={handleInputChange} />
              </div>
              <div className="ad-car-form-column">
                  <label>{t('Modified')}?</label>
                  <input type="checkbox" name="isModified" checked={model.isModified} onChange={handleInputChange}/>
              </div>
          </div>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>{t('Color')}</label>
                  <select name="color" value={model.color} onChange={handleInputChange}>
                      <option value={COLORS.Beige}>{t('Beige')}</option>
                      <option value={COLORS.Black}>{t('Black')}</option>
                      <option value={COLORS.Blue}>{t('Blue')}</option>
                      <option value={COLORS.Brown}>{t('Brown')}</option>
                      <option value={COLORS.Gold}>{t('Gold')}</option>
                      <option value={COLORS.Gray}>{t('Gray')}</option>
                      <option value={COLORS.Green}>{t('Green')}</option>
                      <option value={COLORS.Orange}>{t('Orange')}</option>
                      <option value={COLORS.Purple}>{t('Purple')}</option>
                      <option value={COLORS.Red}>{t('Red')}</option>
                      <option value={COLORS.Silver}>{t('Silver')}</option>
                      <option value={COLORS.White}>{t('White')}</option>
                      <option value={COLORS.Yellow}>{t('Yellow')}</option>
                  </select>
              </div>
              <div className="ad-car-form-column">
                  <label>{t('Commercial Use')}?</label>
                  <input type="checkbox" name="isCommercialUse" checked={model.isCommercialUse} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default CarCharacteristicPage;