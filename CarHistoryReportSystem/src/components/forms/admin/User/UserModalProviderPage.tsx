import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { DataProvider } from '../../../../utils/Interfaces';
import TextField from '@mui/material/TextField'
import Textarea from '@mui/joy/Textarea';

interface UserModalProviderPageProps {
    model: DataProvider | null
    isDataProvider: boolean
    action: "Add" | "Edit"
    providerList: DataProvider[] | null
    handleCheckboxToggle: () => void
    handleInputDataProviderChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleInputDataProviderSelect: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const UserModalProviderPage: React.FC<UserModalProviderPageProps> = ({
    model,
    action,
    providerList,
    handleCheckboxToggle,
    handleInputDataProviderChange,
    handleInputDataProviderSelect
}) => {
    const [isNew, setNew] = useState(false)
    const edit = action === "Edit"
    const handleCheckbox = () => {
        setNew(!isNew)
        handleCheckboxToggle()
    }
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
              {edit ? (
                  <>
                      <div className="pol-crash-form-column">
                      <label>{t('Provider Name')}</label>
                      <TextField type="text" name="name" value={model?.name}  disabled style={{ width: '100%' }} size='small' />
                      </div>
                      <div className="pol-crash-form-column">
                      <label>{t('Provider Description')}</label>
                      <Textarea name="description" value={model?.description} disabled />
                      </div>
                      <div className="pol-crash-form-column">
                      <label>{t('Provider Address')}</label>
                      <TextField type="text" name="address" value={model?.address} disabled style={{ width: '100%' }} size='small' />
                      </div>
                      <div className="pol-crash-form-column">
                      <label>{t('Provider Website Link')}</label>
                      <TextField type="text" name="websiteLink" value={model?.websiteLink} disabled style={{ width: '100%' }} size='small' />
                      </div>
                      <div className="pol-crash-form-column">
                      <label>{t('Provider Phone')}</label>
                      <TextField type="text" name="phoneNumber" value={model?.phoneNumber} disabled style={{ width: '100%' }} size='small' />
                      </div>
                      <div className="pol-crash-form-column">
                      <label>{t('Provider Email')}</label>
                      <TextField type="text" name="email" value={model?.email} disabled style={{ width: '100%' }} size='small' />
                      </div>
                  </>
              ) : (
                      <>
                          <div className="pol-crash-form-column">
                          <div className="pol-crash-checkboxes">
                              <label>
                                  <input
                                      type="checkbox"
                                      checked={isNew}
                                      onChange={handleCheckbox}
                                  />
                                  {t('New Data Provider')}?
                              </label>
                          </div>
                          </div>
                          {isNew && (
                              <>
                                  <div className="pol-crash-form-column">
                                      <label>{t('Provider Name')}</label>
                                  <TextField type="text" name="name" value={model?.name} onChange={handleInputDataProviderChange} style={{ width: '100%' }} size='small' />
                                  </div>
                                  <div className="pol-crash-form-column">
                                      <label>{t('Provider Description')}</label>
                                  <Textarea name="description" value={model?.description} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="pol-crash-form-column">
                                      <label>{t('Provider Address')}</label>
                                  <TextField type="text" name="address" value={model?.address} onChange={handleInputDataProviderChange} style={{ width: '100%' }} size='small' />
                                  </div>
                                  <div className="pol-crash-form-column">
                                      <label>{t('Provider Website Link')}</label>
                                  <TextField type="text" name="websiteLink" value={model?.websiteLink} onChange={handleInputDataProviderChange} style={{ width: '100%' }} size='small' />
                                  </div>
                                  <div className="pol-crash-form-column">
                                      <label>{t('Provider Phone')}</label>
                                  <TextField type="text" name="phoneNumber" value={model?.phoneNumber} onChange={handleInputDataProviderChange} style={{ width: '100%' }} size='small' />
                                  </div>
                                  <div className="pol-crash-form-column">
                                      <label>{t('Provider Email')}</label>
                                  <TextField type="text" name="email" value={model?.email} onChange={handleInputDataProviderChange} style={{ width: '100%' }} size='small' />
                                  </div>
                              </>
                          )}
                          {!isNew && (
                          <div className="pol-crash-form-column">
                                  <label>{t('Data Provider')}</label>
                              <select name="dataProviderId" value={model?.id ? model.id : -1} disabled={edit} onChange={handleInputDataProviderSelect} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                                      <option value={-1}>{t('Not chosen')}</option>
                                      {providerList && (
                                          providerList.map((provider: DataProvider) => (
                                              <option value={provider.id}>{provider.name}</option>
                                          ))
                                      )}
                                  </select>
                              </div>
                          )}
                      </>
              )}
      </>
  );
}

export default UserModalProviderPage;