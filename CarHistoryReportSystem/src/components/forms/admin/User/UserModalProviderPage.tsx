import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { DataProvider } from '../../../../utils/Interfaces';

interface UserModalProviderPageProps {
    model: DataProvider | null
    isDataProvider: boolean
    action: "Add" | "Edit"
    providerList: DataProvider[] | null
    handleCheckboxToggle: () => void
    handleInputDataProviderChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
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
          <div className="ad-user-form-columns">
              {edit ? (
                  <>
                      <div className="ad-user-form-column">
                          <label>{t('Name')}</label>
                          <input type="text" name="name" value={model?.name} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>{t('Description')}</label>
                          <input type="text" name="description" value={model?.description} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>{t('Address')}</label>
                          <input type="text" name="address" value={model?.address} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>{t('Website Link')}</label>
                          <input type="text" name="websiteLink" value={model?.websiteLink} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>{t('Phone')}</label>
                          <input type="text" name="phoneNumber" value={model?.phoneNumber} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Email</label>
                          <input type="text" name="email" value={model?.email} disabled/>
                      </div>
                  </>
              ) : (
                      <>
                          <div className="ad-user-form-column">
                              <label>
                                  {t('New Data Provider')}?
                                  <input
                                      type="checkbox"
                                      checked={isNew}
                                      onChange={handleCheckbox}
                                  />
                              </label>
                          </div>
                          {isNew && (
                              <>
                                  <div className="ad-user-form-column">
                                      <label>{t('Provider Name')}</label>
                                      <input type="text" name="name" value={model?.name} required onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>{t('Provider Description')}</label>
                                      <input type="text" name="description" value={model?.description} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>{t('Provider Address')}</label>
                                      <input type="text" name="address" value={model?.address} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>{t('Provider Website Link')}</label>
                                      <input type="text" name="websiteLink" value={model?.websiteLink} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>{t('Provider Phone')}</label>
                                      <input type="text" name="phoneNumber" value={model?.phoneNumber} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>{t('Provider Email')}</label>
                                      <input type="text" name="email" value={model?.email} onChange={handleInputDataProviderChange} />
                                  </div>
                              </>
                          )}
                          {!isNew && (
                              <>
                                  <label>{t('Data Provider')}</label>
                                  <select name="dataProviderId" value={model?.id} disabled={edit} onChange={handleInputDataProviderSelect}>
                                      <option value={-1}>{t('Not chosen')}</option>
                                      {providerList && (
                                          providerList.map((provider: DataProvider) => (
                                              <option value={provider.id}>{provider.name}</option>
                                          ))
                                      )}
                                  </select>
                              </>
                          )}
                      </>
              )}
          </div>
      </>
  );
}

export default UserModalProviderPage;