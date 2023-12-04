import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../../../store/State';
import { UserReport } from '../../../utils/Interfaces';

interface UserReportListPageProps {
    list: UserReport[] 
}
const UserReportListPage: React.FC<UserReportListPageProps> = ({
    list
}) => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="reg-inspec-form-columns-2">
          <div className="reg-inspec-form-column-2">
              <table className="reg-inspec-inspec-category-table">
                  <thead>
                      <tr>
                          <th>{t('VIN')}</th>
                          <th>{t('Records up to')}</th>
                          <th>{t('Action')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {list.length > 0 ? (
                          list.map((item: UserReport, index: number) => (
                              <tr key={index}>
                                  <td>
                                      <label>{item.carId}</label>
                                  </td>
                                  <td>
                                      <label>{item.createdDate}</label>
                                  </td>
                                  <td>
                                      <button className="reg-inspec-remove-inspec-category-btn" type="button" onClick={() => { }}>{t('See Report')}</button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={4}>{t('You do not have any reports')}</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );
}

export default UserReportListPage;