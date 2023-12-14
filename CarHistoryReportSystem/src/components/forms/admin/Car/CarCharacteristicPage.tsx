import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { COLORS } from '../../../../utils/const/Colors';
import { Car } from '../../../../utils/Interfaces';
import TextField from '@mui/material/TextField'
interface CarCharacteristicPageProps {
    action: "Add" | "Edit"
    model: Car
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
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
              <div className="pol-crash-form-column">
                  <label>{t('Engine Number')}</label>
                  <TextField type="text" name="engineNumber" value={model.engineNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Color')}</label>
              <select name="color" value={model.color} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
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
              <div className="pol-crash-form-column">
                  <div className="pol-crash-checkboxes-2">
                  <input type="checkbox" name="isCommercialUse" checked={model.isCommercialUse} onChange={handleInputChange} />
                  <label>{t('Commercial Use')}?</label>
                  </div>
              </div>
              <div className="pol-crash-form-column">
                  <div className="pol-crash-checkboxes-2">
                  <input type="checkbox" name="isModified" checked={model.isModified} onChange={handleInputChange} />
                  <label>{t('Modified')}?</label>
                  </div>
              </div>
      </>
  );
}

export default CarCharacteristicPage;