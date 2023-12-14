import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField'
import { RootState } from '../../../../store/State';
import { Car, CarModel } from '../../../../utils/Interfaces';

interface CarIdentificationPageProps {
    action: "Add" | "Edit"
    model: Car
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    carModels: CarModel[]
}
const CarIdentificationPage: React.FC<CarIdentificationPageProps> = ({
    action,
    model,
    handleInputChange,
    carModels
}) => {
    const edit = action === "Edit"
    const options = carModels.map(m => ({
        value: m.modelID,
        label: m.modelID
    }))
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
              <div className="pol-crash-form-column">
                  <label>{t('VIN')}</label>
                <TextField type="text" name="vinId" value={model.vinId} disabled={edit} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Model')}</label>
              <select disabled={edit} name="modelId" value={model.modelId ? model.modelId : "notChosen"} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                      <option value="notChosen">{t('Not chosen')}</option>
                      {carModels.map((m: any, index: number) => (
                          <option key={index} value={m.modelID}>{m.modelID} {m.manufacturerName}</option>
                      ))}
                  </select>
              </div>
      </>
  );
}

export default CarIdentificationPage;