import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import { GetDataProviders } from '../../../../services/api/Users';
import { USER_ROLE } from '../../../../utils/const/UserRole';
import { DataProvider, User } from '../../../../utils/Interfaces';

interface UserModalAccountPageProps {
    model: User
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    isDataProvider: boolean
    isNewDataProvider: boolean
    handleCheckboxToggle: () => void
    action: "Add" | "Edit"
    providerList: DataProvider[] | null
}
const UserModalAccountPage: React.FC<UserModalAccountPageProps> = ({
    model,
    handleInputChange,
    isDataProvider,
    handleCheckboxToggle,
    action,
    isNewDataProvider,
    providerList
}) => {
    const edit = action === "Edit"
  return (
      <div className="ad-user-form-columns">
          <div className="ad-user-form-column">
              <label>Email Address</label>
              <input type="text" name="email" value={model.email} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>Username</label>
              <input type="text" name="userName" value={model.userName} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>Role: </label>
              <select name="role" value={model.role} onChange={handleInputChange} disabled={edit}>
                  <option value={USER_ROLE.ADMIN}>Admin</option>
                  <option value={USER_ROLE.USER}>User</option>
                  <option value={USER_ROLE.DEALER}>Car Dealer</option>
                  <option value={USER_ROLE.INSURANCE}>Insurance Company</option>
                  <option value={USER_ROLE.MANUFACTURER}>Manufacturer</option>
                  <option value={USER_ROLE.POLICE}>Police</option>
                  <option value={USER_ROLE.REGISTRY}>Vehicle Registry Department</option>
                  <option value={USER_ROLE.SERVICE}>Service Shop</option>
              </select>
          </div>
          {isDataProvider && edit && (
              <>
                 <div className="ad-user-form-columns">
                      <div className="ad-user-form-column">
                          <label>Name</label>
                          <input type="text" name="name" value={model.dataProvider?.name} onChange={handleInputChange} required />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Description</label>
                          <input type="text" name="description" value={model.dataProvider?.description} onChange={handleInputChange} required />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Address</label>
                          <input type="text" name="address" value={model.dataProvider?.address} onChange={handleInputChange} />
                      </div>
                  </div>
                  <div className="ad-user-form-columns">
                      <div className="ad-user-form-column">
                          <label>Website Link</label>
                          <input type="text" name="websiteLink" value={model.dataProvider?.websiteLink} onChange={handleInputChange} />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Phone</label>
                          <input type="text" name="phoneNumber" value={model.dataProvider?.phoneNumber} onChange={handleInputChange} />
                      </div>
                      <div className="ad-user-form-column">
                          <label>Email</label>
                          <input type="text" name="email" value={model.dataProvider?.email} onChange={handleInputChange} />
                      </div>
                  </div>
              </>
          )}
          {isDataProvider && !edit && isNewDataProvider && (
              <select name="type" value={model.dataProvider?.type} onChange={handleInputChange} disabled={edit}>
                  {providerList && (
                      providerList.map((provider: DataProvider) => (
                          <option value={provider.id}>{provider.name}</option>
                      ))
                  )}
              </select>
          )}
          {isDataProvider && !edit && !isNewDataProvider && (
              <div className="ad-user-form-column">
                  <label>
                      New Data Provider?
                      <input
                          type="checkbox"
                          checked={isNewDataProvider}
                          onChange={handleCheckboxToggle}
                      />
                  </label>
              </div>
          )}
      </div>
  );
}

export default UserModalAccountPage;

