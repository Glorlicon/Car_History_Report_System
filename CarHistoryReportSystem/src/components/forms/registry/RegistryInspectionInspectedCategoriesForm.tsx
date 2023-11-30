import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarInspectionDetail, CarInspectionHistory } from '../../../utils/Interfaces';
interface RegistryInspectionInspectedCategoriesFormProps {
    action: "Add" | "Edit"
    model: CarInspectionHistory
    handleAddInspectionCategory: () => void
    handleRemoveInspectionCategory: (index: number) => void
    handleInspectionCategoryStatus: (index: number) => void
    handleChangeInspectionCategory: (index: number, name: string) => void
    handleChangeInspectionNote: (index: number, name: string) => void
}
const RegistryInspectionInspectedCategoriesForm: React.FC<RegistryInspectionInspectedCategoriesFormProps> = ({
    action,
    model,
    handleAddInspectionCategory,
    handleRemoveInspectionCategory,
    handleInspectionCategoryStatus,
    handleChangeInspectionCategory,
    handleChangeInspectionNote
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const edit = action === "Edit"
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="reg-inspec-form-columns-2">
          <div className="reg-inspec-form-column-2">
              <label>{t('Inspected Categories')}: </label>
              <button className="reg-inspec-add-inspec-category-btn" type="button" onClick={handleAddInspectionCategory}>+Add Inspection Category</button>
              <table className="reg-inspec-inspec-category-table">
                  <thead>
                      <tr>
                          <th>{t('Inspection Category')}</th>
                          <th>{t('Status')}</th>
                          <th>{t('Note')}</th>
                          <th>{t('Action')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {model.carInspectionHistoryDetail.length > 0 ? (
                          model.carInspectionHistoryDetail.map((item: CarInspectionDetail, index: number) => (
                          <tr key={index}>
                              <td>
                                  <input type="text" name={`category${index}`} value={item.inspectionCategory} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInspectionCategory(index, e.target.value)} />
                              </td>
                              <td>
                                  <input type="checkbox" name={`passed${index}`} checked={item.isPassed} onChange={() => handleInspectionCategoryStatus(index)} />
                                  <label>{item.isPassed ? t('Passed') : t('Not passed')}</label>
                              </td>
                              <td>
                                  <input type="text" name={`note${index}`} value={item.note} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInspectionNote(index, e.target.value)} />
                              </td>
                              <td>
                              <button className="reg-inspec-remove-inspec-category-btn" type="button" onClick={() => handleRemoveInspectionCategory(index)}>Remove</button>
                              </td>
                          </tr>
                          ))
                      ):(
                      <tr>
                          <td colSpan={4}>{t('No inspection categories')}</td>
                      </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );
}

export default RegistryInspectionInspectedCategoriesForm;