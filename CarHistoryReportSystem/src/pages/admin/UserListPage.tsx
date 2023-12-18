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
import { isValidEmail, isValidNumber } from '../../utils/Validators';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Papa from 'papaparse';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface Column {
    id: 'id' | 'userName' | 'email' | 'firstName' | 'lastName' | 'phoneNumber' | 'address' | 'roleName' | 'isSuspended' | 'dataProvider' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: number) => string;
}
function UserListPage() {
    const { t, i18n } = useTranslation()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10, align:'left' },
        { id: 'userName', label: t('Username'), minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 100 },
        { id: 'firstName', label: t('First Name'), minWidth: 100 },
        { id: 'lastName', label: t('Last Name'), minWidth: 100 },
        { id: 'phoneNumber', label: t('Phone Number'), minWidth: 100 },
        { id: 'address', label: t('Address'), minWidth: 100 },
        { id: 'roleName', label: t('Role'), minWidth: 100 },
        { id: 'dataProvider', label: t('Data Provider'), minWidth: 100 },
        { id: 'isSuspended', label: t('Status'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [users, setUsers] = useState<User[]>([]);
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
        if (!user.email) {
            setAddError(t('Please enter email'));
            return false;
        }
        if (!user.userName) {
            setAddError(t('Please enter username'));
            return false;
        }
        if (!user.firstName) {
            setAddError(t('Please enter first name'));
            return false;
        }
        if (!user.lastName) {
            setAddError(t('Please enter last name'));
            return false;
        }
        if (!user.phoneNumber) {
            setAddError(t('Please enter phone number'));
            return false;
        }
        console.log("Validate last")
        console.log(user.dataProviderId == -1)
        if (user.dataProviderId && user.dataProviderId == -1) {
            setAddError(t('Data provider must be chosen'))
        }
        return true;
    };


    const handleCheckboxToggle = () => {
        setNewDataProvider(!isNewDataProvider)
    }



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    const handleInputDataProviderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                setMessage(t('Create user successfully'))
                setOpenSuccess(true)
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
            const response: APIResponse = await Edit(editingUser.id, editingUser, token, connectAPIError, unknownError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditingUser(null);
                setMessage(t('Edit user successfully'))
                setOpenSuccess(true)
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
        console.log("tarr",e.target.value)
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
                setMessage(userToSuspend.isSuspended ? t('User unsuspended successfully') : t('User suspended successfully'))
                setOpenSuccess(true)
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
        const response: APIResponse = await List(token, page+1, connectAPIError, unknownError, language, searchParams);
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
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [message, setMessage] = useState('')
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openError, setOpenError] = useState(false)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };
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
      <div className="pol-crash-list-page">
          <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop: '200px' }}>
              <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                  {message}
              </MuiAlert>
          </Snackbar>
          <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop: '200px' }}>
              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%', zIndex: '2000' }}>
                  {error ? error : addError}
              </MuiAlert>
          </Snackbar>
          <div className="pol-alert-action">
              <Accordion>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                      <Typography style={{ fontWeight: 'bold' }}>+ {t('Add Account')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          + {t('Add Manually')}
                      </Typography>
                      <button className="add-ad-account-btn" onClick={() => setShowModal(true)}>+ {t('Add Account')}</button>
                  </AccordionDetails>
              </Accordion>
          </div>
          <div className="pol-alert-action">
              <Accordion>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                      <Typography style={{ fontWeight: 'bold' }}>{t('Search Bars and Filters')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <div className="reg-inspec-search-filter-container">
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
                              onClick={() => { setPage(0); fetchData(); }}
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
                  </AccordionDetails>
              </Accordion>
          </div>
          <div className="plate-search-page-row">
              <div className="plate-alert-page-item">
                  <div className="plate-search-page-item-3">
                      <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom:'15px',paddingTop:'15px' }}>
                          {t('Users List')}
                      </span>
                      <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                  <TableRow>
                                      {columns.map((column, index) => {
                                          if (column.id !== 'actions') {
                                              return (
                                                  <TableCell
                                                      key={column.id + '-' + index}
                                                      align={column.align}
                                                      style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'left' }}
                                                  >
                                                      {column.label}
                                                  </TableCell>
                                              )
                                          } else {
                                              return (
                                                  <TableCell
                                                      sx={stickyCellStyle}
                                                      key={column.id + '-' + index}
                                                      align={column.align}
                                                      style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'left' }}
                                                  >
                                                      {column.label}
                                                  </TableCell>
                                              )
                                          }
                                      })}
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {loading ? (
                                      <TableRow>
                                          <TableCell colSpan={11}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={11}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : users.length > 0 ? users
                                      .map((row, index1) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions' && column.id !== 'dataProvider' && column.id !== 'isSuspended' && column.id !== 'roleName') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'isSuspended') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left', color: value ? 'red' : 'green' }}>
                                                                  {value ? t('Suspended') : t('Not Suspended')}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'roleName') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {t(value)}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'dataProvider') {
                                                          let value = row[column.id]?.name;
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">
                                                                  <div className="pol-crash-modal-content-2-buttons">
                                                                      {row.isSuspended ? (
                                                                          <button className="ad-user-unsuspend-btn" onClick={() => handleSuspendClick(row)}>{t('Unsuspend')}</button>
                                                                      ) : (
                                                                              <button className="ad-user-suspend-btn" onClick={() => handleSuspendClick(row)}>{t('Suspend')}</button>
                                                                      )}
                                                                      <button onClick={() => { setEditingUser(row) }} disabled={adding} className="pol-crash-action-button">
                                                                          {t('Edit1')} &#x270E;
                                                                      </button>
                                                                  </div>
                                                              </TableCell>
                                                          )
                                                      }
                                                  })}
                                              </TableRow>
                                          );
                                      }) :
                                      <TableRow>
                                          <TableCell colSpan={11}>
                                              {t('No users found')}
                                          </TableCell>
                                      </TableRow>
                                  }
                              </TableBody>
                          </Table>
                      </TableContainer>
                      <TablePagination
                          style={{backgroundColor:'white', borderBottomLeftRadius:'10px', borderBottomRightRadius:'10px'}}
                          rowsPerPageOptions={[15]}
                          component="div"
                          count={paging ? paging.TotalCount : 0}
                          rowsPerPage={15}
                          page={page}
                          onPageChange={handleChangePage}
                          labelDisplayedRows={
                              ({ from, to, count }) => {
                                  return '' + from + '-' + to + ' ' + t('of') + ' ' + count
                              }
                          }
                      />
                  </div>
              </div>
          </div>
          {/*Pop-up add window*/ }
          {showModal && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => {
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
                          }); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add Account')}</h2>
                      <div className="pol-crash-modal-content-2">
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
                                  providerId={newUser.dataProviderId as unknown as number}
                                  action="Add"
                                  isDataProvider={isDataProvider}
                                  providerList={providersList}
                                  handleCheckboxToggle={handleCheckboxToggle}
                                  handleInputDataProviderChange={handleInputDataProviderChange}
                                  handleInputDataProviderSelect={handleInputDataProviderSelect}
                              />
                          )}
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleAddUser} disabled={adding} className="ad-user-add-btn">
                              {adding ? (
                                  <div className="ad-user-inline-spinner"></div>
                              ) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
          {editingUser && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setEditingUser(null); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Edit Account')}</h2>
                      <div className="pol-crash-modal-content-2">
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
                                  providerId={editingUser.dataProviderId as unknown as number}
                                  action="Edit"
                                  isDataProvider={true}
                                  providerList={null}
                                  handleCheckboxToggle={handleCheckboxToggle}
                                  handleInputDataProviderChange={handleInputDataProviderChange}
                                  handleInputDataProviderSelect={handleInputDataProviderSelect}
                              />
                          )}
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleEditUser} disabled={adding} className="ad-user-add-btn">
                              {adding ? (
                                  <div className="ad-user-inline-spinner"></div>
                              ) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
          {suspendTab && (
              <div className="pol-crash-modal">
                  <div className="ad-user-modal-content">
                      <h2>{t('Confirmation')}</h2>
                      <p>{t('Are you sure you want to')} {(userToSuspend && userToSuspend.isSuspended) ? t('unsuspend') : t('suspend')} {t('user')} {userToSuspend?.userName} ?</p>
                      {addError && (
                          <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                              {addError}
                          </MuiAlert>
                      )}
                      {adding ? (
                          <div className="ad-user-inline-spinner"></div>
                      ) : (
                              <>
                                  <button onClick={handleConfirmSuspend} className="ad-user-add-btn">{t('Confirm')}</button>
                                  <button onClick={handleCancel} className="ad-user-add-btn">{t('Cancel')}</button>
                              </>
                      )}
                  </div>
              </div>
          )}
        </div>
  );
}

export default UserListPage;