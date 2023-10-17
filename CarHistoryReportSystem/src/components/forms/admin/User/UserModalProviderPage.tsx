import React, { useState } from 'react';
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
  return (
      <>
          <div className="ad-user-form-columns">
              {edit ? (
                  <>
                      <div className="ad-user-form-column">
                          <label>Name</label>
                          <input type="text" name="name" value={model?.name} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Description</label>
                          <input type="text" name="description" value={model?.description} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Address</label>
                          <input type="text" name="address" value={model?.address} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Website Link</label>
                          <input type="text" name="websiteLink" value={model?.websiteLink} disabled />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Phone</label>
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
                                  New Data Provider?
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
                                      <label>Provider Name</label>
                                      <input type="text" name="name" value={model?.name} required onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>Provider Description</label>
                                      <input type="text" name="description" value={model?.description} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>Provider Address</label>
                                      <input type="text" name="address" value={model?.address} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>Provider Website Link</label>
                                      <input type="text" name="websiteLink" value={model?.websiteLink} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>Provider Phone</label>
                                      <input type="text" name="phoneNumber" value={model?.phoneNumber} onChange={handleInputDataProviderChange} />
                                  </div>
                                  <div className="ad-user-form-column">
                                      <label>Provider Email</label>
                                      <input type="text" name="email" value={model?.email} onChange={handleInputDataProviderChange} />
                                  </div>
                              </>
                          )}
                          {!isNew && (
                              <select name="dataProviderId" value={model?.id} disabled={edit} onChange={handleInputDataProviderSelect}>
                                  {providerList && (
                                      providerList.map((provider: DataProvider) => (
                                          <option value={provider.id}>{provider.name}</option>
                                      ))
                                  )}
                              </select>
                          )}
                      </>
              )}
          </div>
      </>
  );
}

export default UserModalProviderPage;