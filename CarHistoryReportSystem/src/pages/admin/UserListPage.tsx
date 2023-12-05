import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import UserModalAccountPage from '../../components/forms/admin/User/UserModalAccountPage';
import UserModalDetailsPage from '../../components/forms/admin/User/UserModalDetailsPage';
import UserModalProviderPage from '../../components/forms/admin/User/UserModalProviderPage';
import { Add, Edit, GetDataProviders, List, SuspendUser, UnsuspendUser } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/AdminUsers.css'
import { USER_ROLE } from '../../utils/const/UserRole';
import { AdminUserSearchParams, APIResponse, DataProvider, Paging, User } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidEmail, isValidNumber } from '../../utils/Validators';

function UserListPage() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [users, setUsers] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [currentId, setCurrentId] = useState<string>("")
    const [newUser, setNewUser] = useState<User>({
        id: '',
        userName: '',
        email: '',
        firstName: '',
        phoneNumber: '',
        lastName: '',
        maxReportNumber: 0,
        role: 1,
        address: ''
    });
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchRole, setSearchRole] = useState('');
    const [searchUsername, setSearchUsername] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchDataProviderName, setSearchDataProviderName] = useState('');
    const [suspendTab, setSuspendTab] = useState(false);
    const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
    const [isDataProvider, setIsDataProvider] = useState(false)
    const [isNewDataProvider, setNewDataProvider] = useState(false)
    const [providersList, setProvidersList] = useState<DataProvider[] | null>(null)
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [resetTrigger, setResetTrigger] = useState(0);
    const validateUser = (user: User): boolean => {
        if (!isValidEmail(user.email)) {
            setAddError(t('Invalid email address'));
            return false;
        }
        if (!isValidNumber(user.phoneNumber)) {
            setAddError(t('Invalid phone number'));
            return false;
        }
        if (!user.email || !user.userName || !user.firstName || !user.lastName || !user.phoneNumber || !user.address) {
            setAddError(t('All fields must be filled out'));
            return false;
        }
        return true;
    };


    const handleCheckboxToggle = () => {
        setNewDataProvider(!isNewDataProvider)
    }



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editingUser) {
            setEditingUser({
                ...editingUser,
                [e.target.name]: e.target.value
            })
        } else {
            setNewUser({
                ...newUser,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleInputDataProviderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewUser({
            ...newUser,
            dataProvider: {
                ...newUser.dataProvider as DataProvider,
                [e.target.name]: e.target.value
            },
            dataProviderId: null
        })
    }

    const handleAddUser = async () => {
        if (validateUser(newUser)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await Add(newUser, token, connectAPIError, unknownError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setNewUser({
                    id: '',
                    userName: '',
                    email: '',
                    firstName: '',
                    phoneNumber: '',
                    lastName: '',
                    maxReportNumber: 0,
                    role: 1,
                    address: ''
                });
                fetchData();
            }
        }
    };
    const handleResetFilters = () => {
        setSearchDataProviderName('')
        setSearchEmail('')
        setSearchRole('')
        setSearchUsername('')
        setResetTrigger(prev => prev + 1);
    }
    const handleEditUser = async () => {
        if (!editingUser) return
        if (validateUser(editingUser)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await Edit(currentId, editingUser, token, connectAPIError, unknownError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditingUser(null);
                fetchData();
            }
        }
    };

    const handleSuspendClick = (user: User) => {
        setError(null);
        setAddError(null)
        setUserToSuspend(user);
        setSuspendTab(true);
    };
    const handleCancel = () => {
        setSuspendTab(false);
        setError(null);
        setAddError(null)
        setUserToSuspend(null);
    };

    const handleInputDataProviderSelect = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewUser({
            ...newUser,
            dataProviderId: e.target.value as unknown as number,
            dataProvider: undefined
        })
    }

    const handleConfirmSuspend = async () => {
        let response: APIResponse
        if (userToSuspend) {
            setAdding(true)
            setAddError(null)
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            if (userToSuspend.isSuspended) response = await UnsuspendUser(userToSuspend.id, token, connectAPIError, unknownError, language)
            else response = await SuspendUser(userToSuspend.id, token, connectAPIError, unknownError, language)
            setAdding(false)
            if (response.error) {
                setAddError(response.error)
            } else {
                setSuspendTab(false);
                setUserToSuspend(null);
                fetchData();
            }
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: AdminUserSearchParams = {
            username: searchUsername,
            dataProviderName: searchDataProviderName,
            email: searchEmail,
            role: searchRole
        }
        const response: APIResponse = await List(token, page, connectAPIError, unknownError, language, searchParams);
        setLoading(false);
        if (response.error) {
            setError(response.error);
        } else {
            setUsers(response.data);
            setPaging(response.pages)
        }
    };

    const getProviders = async () => {
        if (newUser.role == USER_ROLE.DEALER ||
            newUser.role == USER_ROLE.INSURANCE ||
            newUser.role == USER_ROLE.MANUFACTURER ||
            newUser.role == USER_ROLE.POLICE ||
            newUser.role == USER_ROLE.REGISTRY ||
            newUser.role == USER_ROLE.SERVICE
        ) {
            const temp = setIsDataProvider(true)
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response = await GetDataProviders(newUser.role - 2, token, connectAPIError, unknownError, language)
            if (response.data) setProvidersList(response.data)
            else console.log("Cannot get providers list")
        }
        else {
            const temp = setIsDataProvider(false)
        }
    }

    const changeSize = () => {
        const element = document.querySelector('.ad-user-modal-content')
        if (element instanceof HTMLElement) {
            if (isDataProvider) {
                element.style.width = '570px'
            } else {
                element.style.width = '400px'
            }
        }
    }

    const editChangeSize = () => {
        const element = document.querySelector('.ad-user-modal-content')
        if (element instanceof HTMLElement) {
            if (editingUser?.dataProvider) {
                element.style.width = '570px'
            } else {
                element.style.width = '400px'
            }
        }
    }

    useEffect(() => {
         changeSize()
    }, [isDataProvider])

    useEffect(() => {
        if (editingUser?.dataProvider) editChangeSize()
    }, [editingUser])

    useEffect(() => {
        getProviders()
    }, [newUser.role])
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, [page])
    useEffect(() => {
        fetchData();
    }, [resetTrigger]);
  return (
        <div className="ad-user-list-page">
          <div className="ad-user-top-bar">
              <button className="add-ad-account-btn" onClick={() => setShowModal(true)}>+ {t('Add Account')}</button>
          </div>
          <div className="ad-user-top-bar">
              <div className="ad-user-search-filter-container">
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Username')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Username')}
                          value={searchUsername}
                          onChange={(e) => setSearchUsername(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item">
                      <label>Email</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Email')}
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Role')}</label>
                      <select className="reg-inspec-search-bar" value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
                          <option value=''>{t('All')}</option>
                          <option value={USER_ROLE.ADMIN}>{t('Admin')}</option>
                          <option value={USER_ROLE.USER}>{t('User')}</option>
                          <option value={USER_ROLE.DEALER}>{t('Car Dealer')}</option>
                          <option value={USER_ROLE.INSURANCE}>{t('Insurance Company')}</option>
                          <option value={USER_ROLE.MANUFACTURER}>{t('Manufacturer')}</option>
                          <option value={USER_ROLE.POLICE}>{t('Police')}</option>
                          <option value={USER_ROLE.REGISTRY}>{t('Vehicle Registry Department')}</option>
                          <option value={USER_ROLE.SERVICE}>{t('Service Shop')}</option>
                      </select>
                  </div>
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Data Provider Name')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Data Provider Name')}
                          value={searchDataProviderName}
                          onChange={(e) => setSearchDataProviderName(e.target.value)}
                      />
                  </div>
                  <button
                      className="search-reg-inspec-btn"
                      onClick={fetchData}
                  >
                      {t('Search...')}
                  </button>
                  <button
                      className="reset-reg-inspec-btn"
                      onClick={handleResetFilters}
                  >
                      {t('Reset Filters')}
                  </button>
                </div>
            </div>
            <table className="ad-user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>{t('Username')}</th>
                        <th>{t('Email Address')}</th>
                        <th>{t('Role')}</th>
                        <th>{t('Action')}</th>
                    </tr>
                </thead>
                <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="ad-user-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                                  <button onClick={fetchData} className="ad-user-retry-btn">{t('Retry')}</button>
                          </td>
                          </tr>
                      ) : users.length > 0 ? (
                          users.map((user: any, index: number) => (
                              <tr key={index}>
                                  <td onClick={() => { setEditingUser(user); setCurrentId(user.id)}}>{user.id}</td>
                              <td>{user.userName}</td>
                              <td>{user.email}</td>
                              <td>{user.roleName}</td>
                              <td>
                                      {user.isSuspended ? (
                                          <button className="ad-user-unsuspend-btn" onClick={() => handleSuspendClick(user)}>{t('Unsuspend')}</button>
                                      ) : (
                                          <button className="ad-user-suspend-btn" onClick={() => handleSuspendClick(user)}>{t('Suspend')}</button>
                                      )}
                              </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>{t('No users found')}</td>
                      </tr>
                  )}
                </tbody>
          </table>
          {/*Pop-up add window*/ }
          {showModal && (
              <div className="ad-user-modal">
                  <div className="ad-user-modal-content">
                      <span className="ad-user-close-btn" onClick={() => {
                          setShowModal(false); setNewUser({
                              id: '',
                              userName: '',
                              email: '',
                              firstName: '',
                              phoneNumber: '',
                              lastName: '',
                              maxReportNumber: 0,
                              role: 1,
                              address: ''
                          }) }}>&times;</span>
                      <h2>{t('Add Account')}</h2>
                      <UserModalDetailsPage
                          model={newUser}
                          handleInputChange={handleInputChange}
                      />
                      <UserModalAccountPage
                          model={newUser}
                          handleInputChange={handleInputChange}
                          action="Add"
                      />
                      {isDataProvider && providersList && (
                          < UserModalProviderPage
                              model={newUser.dataProvider as DataProvider}
                              action="Add"
                              isDataProvider={isDataProvider}
                              providerList={providersList}
                              handleCheckboxToggle={handleCheckboxToggle}
                              handleInputDataProviderChange={handleInputDataProviderChange}
                              handleInputDataProviderSelect={handleInputDataProviderSelect}
                          />
                      )}
                      <button onClick={handleAddUser} disabled={adding} className="ad-user-add-btn">
                          {adding ? (
                              <div className="ad-user-inline-spinner"></div>
                          ) : t('Finish') }
                      </button>
                      {addError && (
                          <p className="ad-user-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editingUser && (
              <div className="ad-user-modal">
                  <div className="ad-user-modal-content">
                      <span className="ad-user-close-btn" onClick={() => { setEditingUser(null); }}>&times;</span>
                      <h2>{t('Edit Account')}</h2>
                      <UserModalDetailsPage
                          model={editingUser}
                          handleInputChange={handleInputChange}
                      />
                      <UserModalAccountPage
                          model={editingUser}
                          handleInputChange={handleInputChange}
                          action="Edit"
                      />
                      {editingUser.dataProvider && (
                          <UserModalProviderPage
                              model={editingUser.dataProvider as DataProvider}
                              action="Edit"
                              isDataProvider={true}
                              providerList={null}
                              handleCheckboxToggle={handleCheckboxToggle}
                              handleInputDataProviderChange={handleInputDataProviderChange}
                              handleInputDataProviderSelect={handleInputDataProviderSelect}
                          />
                      )}
                      <button onClick={handleEditUser} disabled={adding} className="ad-user-add-btn">
                          {adding ? (
                              <div className="ad-user-inline-spinner"></div>
                          ) : t('Finish') }
                      </button>
                      {addError && (
                          <p className="ad-user-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {suspendTab && (
              <div className="ad-user-modal">
                  <div className="ad-user-modal-content">
                      <h2>Confirmation</h2>
                      <p>Are you sure you want to {(userToSuspend && userToSuspend.isSuspended) ? 'unsuspend' : 'suspend'} user {userToSuspend?.userName} ?</p>
                      {adding ? (
                          <div className="ad-user-inline-spinner"></div>
                      ) : (
                              <>
                                  <button onClick={handleConfirmSuspend} className="ad-user-add-btn">Yes</button>
                                  <button onClick={handleCancel} className="ad-user-add-btn">No</button>
                              </>
                      )}
                      {addError && (
                          <p className="ad-user-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {paging && paging.TotalPages > 0 &&
              <>
                  <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
              </>
          }
        </div>
  );
}

export default UserListPage;