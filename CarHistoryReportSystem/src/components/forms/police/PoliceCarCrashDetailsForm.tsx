import React, { useEffect } from 'react';
import { CarCrash } from '../../../utils/Interfaces';
import car from '../../../images/car.jpg'
import { CAR_SIDES } from '../../../utils/const/CarSides';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
interface PoliceCarCrashDetailsFormProps {
    action: "Add" | "Edit"
    model: CarCrash
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleDamageLocationChange: (sideValue: number) => void
    handleSeverityChange: (value: number) => void
}
const PoliceCarCrashDetailsForm: React.FC<PoliceCarCrashDetailsFormProps> = ({
    action,
    model,
    handleInputChange,
    handleDamageLocationChange,
    handleSeverityChange
}) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const isSideColored = (sideValue: number): boolean => {
        return (model.damageLocation & sideValue) === sideValue;
    };
    function valuetext(value: number) {
        return `${value}%`;
    }
    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            handleSeverityChange(newValue/100);
        }
    };
    const edit = action === "Edit"
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
              <div className="pol-crash-form-column">
                  <label>{t('Location')}</label>
              <TextField type="text" name="location" value={model.location} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Severity')} (%)</label>
                <Slider defaultValue={model.serverity * 100} aria-label="Always visible" valueLabelDisplay="on" min={0} max={100} marks={[{ value: 0, label: t('Low') }, { value: 50, label: t('Medium') }, { value: 100, label: t('High') }]} getAriaValueText={valuetext} size='medium' onChange={handleChange} />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Damage Location')}</label>
                  <div className="pol-crash-car-container" style={{justifyContent:'space-between'}}>
                    {/* invisible div to push image to center*/}
                  <div className="pol-crash-checkboxes" style={{visibility:'hidden'}}>
                  {Object.entries(CAR_SIDES).map(([key, value]) => (
                          <label key={key}>
                              <input
                                  type="checkbox"
                                  checked={isSideColored(value)}
                                  onChange={() => handleDamageLocationChange(value)}
                              />
                              {t(key.charAt(0).toUpperCase() + key.slice(1))}
                          </label>
                      ))}
                  </div>
                      <img src={car} alt="Car" className="pol-crash-car-image" style={{
                          borderTop: `5px solid ${isSideColored(CAR_SIDES.Front) ? 'red' : 'black'}`,
                          borderBottom: `5px solid ${isSideColored(CAR_SIDES.Rear) ? 'red' : 'black'}`,
                          borderLeft: `5px solid ${isSideColored(CAR_SIDES.Left) ? 'red' : 'black'}`,
                          borderRight: `5px solid ${isSideColored(CAR_SIDES.Right) ? 'red' : 'black'}`,
                      }} />
                  <div className="pol-crash-checkboxes">
                      {Object.entries(CAR_SIDES).map(([key, value]) => (
                          <label key={key}>
                              <input
                                  type="checkbox"
                                  checked={isSideColored(value)}
                                  onChange={() => handleDamageLocationChange(value)}
                              />
                              {t(key.charAt(0).toUpperCase() + key.slice(1))}
                          </label>
                      ))}
                  </div>
                  </div>
              </div>
      </>
  );
}

export default PoliceCarCrashDetailsForm;