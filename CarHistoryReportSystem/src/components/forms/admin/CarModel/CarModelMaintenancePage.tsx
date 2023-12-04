import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, ModelMaintenance } from '../../../../utils/Interfaces';

interface CarModelMaintenancePageProps {
    model: CarModel,
    handleChangeOdometerPerMaintainance: (index: number, name: string) => void
    handleChangeDayPerMaintainance: (index: number, name: string) => void
}
const CarModelMaintenancePage: React.FC<CarModelMaintenancePageProps> = ({
    model,
    handleChangeOdometerPerMaintainance,
    handleChangeDayPerMaintainance
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="reg-inspec-form-columns-2">
          <div className="reg-inspec-form-column-2">
              <label>{t('Maintenance Recommendations')}: </label>
              <table className="reg-inspec-inspec-category-table">
                  <thead>
                      <tr>
                          <th>{t('Maintenance Part')}</th>
                          <th>{t('Odometer Per Maintainance')}</th>
                          <th>{t('Days Per Maintainance')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {model.modelOdometers && model.modelOdometers.length > 0 && (
                          model.modelOdometers.map((item: ModelMaintenance, index: number) => (
                              <tr key={index}>
                                  <td>
                                      {t(item.maintenancePart)}
                                  </td>
                                  <td>
                                      <input type="number" name={`odometerPerMaintainance${index}`} value={item.odometerPerMaintainance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeOdometerPerMaintainance(index, e.target.value)} min="0"/>
                                  </td>
                                  <td>
                                      <input type="number" name={`dayPerMaintainance${index}`} value={item.dayPerMaintainance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeDayPerMaintainance(index, e.target.value)} min="0" />
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );
}

export default CarModelMaintenancePage;