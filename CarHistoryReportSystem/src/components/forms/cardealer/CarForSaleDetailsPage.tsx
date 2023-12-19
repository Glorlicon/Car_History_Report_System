import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarSalesInfo } from '../../../utils/Interfaces';
import TextField from '@mui/material/TextField'
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";

interface CarForSaleDetailsPageProps {
    action: "Add" | "Edit"
    model: CarSalesInfo
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleAddFeature: () => void
    handleRemoveFeature: (index: number) => void
    handleSetFeature: (index: number, value: string) => void
}
const CarForSaleDetailsPage: React.FC<CarForSaleDetailsPageProps> = ({
    action,
    model,
    handleInputChange,
    handleAddFeature,
    handleRemoveFeature,
    handleSetFeature
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
                  <label>{t('Description')}</label>
                <TextField type="text" name="description" value={model.description} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('VIN')}</label>
              <TextField type="text" name="carId" value={model.carId} disabled={edit} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Price')}</label>
                <TextField type="number" name="price" value={model.price} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Features')}: </label>
                  {model.features.map((field, index) => (
                      <div key={index}>
                          <TextField
                              style={{ width: '80%' }}
                              value={field}
                              onChange={(e) => handleSetFeature(index, e.target.value)}
                          />
                          <IconButton onClick={() => handleRemoveFeature(index)} style={{ width: '20%' }}>
                              <DeleteIcon />
                          </IconButton>
                      </div>
                  ))}
                  <Button variant="contained" onClick={handleAddFeature} sx={{ mt: 2 }}>
                      +{t('Add Feature')}
                  </Button>
              </div>
      </>
  );
}

export default CarForSaleDetailsPage;