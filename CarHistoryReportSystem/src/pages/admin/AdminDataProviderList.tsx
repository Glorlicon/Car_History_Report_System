import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/AdminManus.css';
import { AddDataProvider, EditDataProvder, List, ListDataProviderTypes } from '../../services/api/DataProvider';
import { RootState } from '../../store/State';
import { APIResponse, DataProvider, DataProviderSearchParams, Paging } from '../../utils/Interfaces';
import { isValidEmail, isValidNumber } from '../../utils/Validators';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField'
import Textarea from '@mui/joy/Textarea';
import { USER_ROLE } from '../../utils/const/UserRole';
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
    id: 'id' | 'name' | 'description' | 'address' | 'websiteLink' | 'phoneNumber' | 'email' | 'typeName' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

function AdminDataProviderList() {
    const { t, i18n } = useTranslation()
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'name', label: t('Name'), minWidth: 100 },
        { id: 'description', label: t('Description'), minWidth: 100 },
        { id: 'address', label: t('Address'), minWidth: 100 },
        { id: 'websiteLink', label: t('Website Link'), minWidth: 100 },
        { id: 'phoneNumber', label: t('Phone number'), minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 100 },
        { id: 'typeName', label: t('Role'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [searchName, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [searchRole, setSearchRole] = useState('');
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [dataProviders, setDataProviders] = useState<string[]>([])
    const [list, setList] = useState<DataProvider[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [editDp, setEditDp] = useState<DataProvider | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const emptyDataProvider: DataProvider = {
        name: "",
        description: "",
        address: "",
        email: "",
        phoneNumber: "",
        websiteLink: "",
        imageLink:"",
        type: -1
    }
    const [newDp, setNewDp] = useState<DataProvider>(emptyDataProvider)

    const validateManu = (dp: DataProvider): boolean => {
        if (dp.email && !isValidEmail(dp.email)) {
            setAddError(t('Invalid email address'));
            setOpenError(true)
            return false;
        }
        if (dp.phoneNumber && !isValidNumber(dp.phoneNumber)) {
            setAddError(t('Invalid phone number'));
            setOpenError(true)
            return false;
        }
        if (!dp.description || !dp.name || !dp.email || !dp.phoneNumber || !dp.address || !dp.websiteLink) {
            setAddError(t('All fields must be filled out'));
            setOpenError(true)
            return false;
        }
        if (dp.type < 0) {
            setAddError(t('Role is not chosen'));
            setOpenError(true)
            return false;
        }
        return true;
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (editDp) {
            setEditDp({
                ...editDp,
                [e.target.name]: e.target.value
            })
        } else {
            setNewDp({
                ...newDp,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleAddManu = async () => {
        if (validateManu(newDp)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddDataProvider(newDp, token, connectAPIError, unknownError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setShowModal(false);
                setNewDp(emptyDataProvider)
                setMessage(t('Add new data provider successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    };

    const handleEditManu = async () => {
        if (!editDp) return
        if (validateManu(editDp)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditDataProvder(editDp, token, connectAPIError, unknownError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setShowModal(false);
                setEditDp(null);
                setMessage(t('Edit data provider successfully'))
                setOpenSuccess(true)
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
        let searchParams: DataProviderSearchParams = {
            email: searchEmail,
            name: searchName,
            role: searchRole
        }
        const dataProviderResponse: APIResponse = await ListDataProviderTypes(token, connectAPIError, unknownError, language);
        if (dataProviderResponse.error) {
            setError(dataProviderResponse.error);
        } else {
            setDataProviders(dataProviderResponse.data)
            const response: APIResponse = await List(token, page+1, connectAPIError, unknownError, language, searchParams)
            if (response.error) {
                setError(response.error)
            } else {
                setList(response.data)
                setPaging(response.pages)
            }
        }
        setLoading(false)
    };
    const handleResetFilters = () => {
        setSearchEmail('')
        setSearchName('')
        setSearchRole('')
        setResetTrigger(prev => prev + 1);
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
          <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                  {message}
              </MuiAlert>
          </Snackbar>
          <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
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
                      <Typography style={{ fontWeight: 'bold' }}>+ {t('Add Data Provider')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          + {t('Add Manually')}
                      </Typography>
                      <button className="add-ad-account-btn" onClick={() => setShowModal(true)}>+ {t('Add Data Provider')}</button>
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
                              <label>{t('Name')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by Name')}
                                  value={searchName}
                                  onChange={(e) => setSearchName(e.target.value)}
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
                                  <option value={USER_ROLE.DEALER-2}>{t('Car Dealer')}</option>
                                  <option value={USER_ROLE.INSURANCE-2}>{t('Insurance Company')}</option>
                                  <option value={USER_ROLE.MANUFACTURER-2}>{t('Manufacturer')}</option>
                                  <option value={USER_ROLE.POLICE-2}>{t('Police')}</option>
                                  <option value={USER_ROLE.REGISTRY-2}>{t('Vehicle Registry Department')}</option>
                                  <option value={USER_ROLE.SERVICE-2}>{t('Service Shop')}</option>
                              </select>
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
                      <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                          {t('Data Providers List')}
                      </span>
                      <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                  <TableRow>
                                      {columns.map((column, index) => (
                                          <TableCell
                                              key={column.id + '-' + index}
                                              align={column.align}
                                              style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
                                          >
                                              {column.label}
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {loading ? (
                                      <TableRow>
                                          <TableCell colSpan={9}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={9}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : list.length > 0 ? list
                                      .map((row, index1) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions' && column.id !== 'typeName') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      }  else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'center' }}>
                                                                  <button onClick={() => { setEditDp(row) }} disabled={adding} className="pol-crash-action-button">
                                                                          {t('Edit1')} &#x270E;
                                                                      </button>
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'typeName') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'center' }}>
                                                                  
                                                                      {t(value)}
                                                                 
                                                              </TableCell>
                                                          )
                                                      }
                                                  })}
                                              </TableRow>
                                          );
                                      }) :
                                      <TableRow>
                                          <TableCell colSpan={9}>
                                              {t('No data providers found')}
                                          </TableCell>
                                      </TableRow>
                                  }
                              </TableBody>
                          </Table>
                      </TableContainer>
                      <TablePagination
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
          {/*<table className="ad-manu-table">*/}
          {/*    <thead>*/}
          {/*        <tr>*/}
          {/*            <th>ID</th>*/}
          {/*            <th>{t('Name')}</th>*/}
          {/*            <th>{t('Description')}</th>*/}
          {/*        </tr>*/}
          {/*    </thead>*/}
          {/*    <tbody>*/}
          {/*        {loading ? (*/}
          {/*            <tr>*/}
          {/*                <td colSpan={5} style={{ textAlign: 'center' }}>*/}
          {/*                    <div className="ad-manu-spinner"></div>*/}
          {/*                </td>*/}
          {/*            </tr>*/}
          {/*        ) : error ? (*/}
          {/*            <tr>*/}
          {/*                <td colSpan={5} style={{ textAlign: 'center' }}>*/}
          {/*                    {error}*/}
          {/*                    <button onClick={fetchData} className="ad-manu-retry-btn">{t('Retry')}</button>*/}
          {/*                </td>*/}
          {/*            </tr>*/}
          {/*            ) : manufactureres.length > 0 ? (*/}
          {/*                manufactureres.map((manu: any, index: number) => (*/}
          {/*                    <tr key={index}>*/}
          {/*                    <td onClick={() => { setEditManu(manu); setCurrentId(manu.id) }}>{manu.id}</td>*/}
          {/*                    <td>{manu.name}</td>*/}
          {/*                    <td>{manu.description}</td>*/}
          {/*                </tr>*/}
          {/*            ))*/}
          {/*        ) : (*/}
          {/*            <tr>*/}
          {/*                <td colSpan={5}>{t('No manufacturers added by admin')}</td>*/}
          {/*            </tr>*/}
          {/*        )}*/}
          {/*    </tbody>*/}
          {/*</table>*/}
          {/*Pop-up add window*/}
          {showModal && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setNewDp(emptyDataProvider); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add Manufacturer')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <div className="pol-crash-form-column">
                              <label>{t('Name')}</label>
                              <TextField type="text" name="name" value={newDp.name} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Description')}</label>
                              <Textarea name="description" value={newDp.description} onChange={handleInputChange} />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Address')}</label>
                              <TextField type="text" name="address" value={newDp.address} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Website Link')}</label>
                              <TextField type="text" name="websiteLink" value={newDp.websiteLink} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Phone')}</label>
                              <TextField type="text" name="phoneNumber" value={newDp.phoneNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>Email</label>
                              <TextField type="text" name="email" value={newDp.email} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Data Provider')}</label>
                              <select name="type" value={newDp.type ? newDp.type : -1} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                                  <option value={-1}>{t('Not chosen')}</option>
                                  <option value={USER_ROLE.DEALER-2}>{t('Car Dealer')}</option>
                                  <option value={USER_ROLE.INSURANCE-2}>{t('Insurance Company')}</option>
                                  <option value={USER_ROLE.MANUFACTURER-2}>{t('Manufacturer')}</option>
                                  <option value={USER_ROLE.POLICE-2}>{t('Police')}</option>
                                  <option value={USER_ROLE.REGISTRY-2}>{t('Vehicle Registry Department')}</option>
                                  <option value={USER_ROLE.SERVICE-2}>{t('Service Shop')}</option>
                              </select>
                          </div>
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleAddManu} disabled={adding} className="ad-manu-add-btn">
                              {adding ? (
                                  <div className="ad-manu-inline-spinner"></div>
                              ) : t('Finish')}
                          </button>
                      </div>                          
                  </div>
              </div>
          )}
          {editDp && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setEditDp(null); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Edit Manufacturer')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <div className="pol-crash-form-column">
                              <label>ID</label>
                              <TextField type="text" name="id" value={editDp.id} disabled style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Name')}</label>
                              <TextField type="text" name="name" value={editDp.name} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Description')}</label>
                              <Textarea name="description" value={editDp.description} onChange={handleInputChange} />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Address')}</label>
                              <TextField type="text" name="address" value={editDp.address} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Website Link')}</label>
                              <TextField type="text" name="websiteLink" value={editDp.websiteLink} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Phone')}</label>
                              <TextField type="text" name="phoneNumber" value={editDp.phoneNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>Email</label>
                              <TextField type="text" name="email" value={editDp.email} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Data Provider')}</label>
                              <select name="type" value={editDp.type ? editDp.type : -1} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }} disabled>
                                  <option value={-1}>{t('Not chosen')}</option>
                                  <option value={USER_ROLE.DEALER-2}>{t('Car Dealer')}</option>
                                  <option value={USER_ROLE.INSURANCE-2}>{t('Insurance Company')}</option>
                                  <option value={USER_ROLE.MANUFACTURER-2}>{t('Manufacturer')}</option>
                                  <option value={USER_ROLE.POLICE-2}>{t('Police')}</option>
                                  <option value={USER_ROLE.REGISTRY-2}>{t('Vehicle Registry Department')}</option>
                                  <option value={USER_ROLE.SERVICE-2}>{t('Service Shop')}</option>
                              </select>
                          </div>
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleEditManu} disabled={adding} className="ad-manu-add-btn">
                              {adding ? (
                                  <div className="ad-manu-inline-spinner"></div>
                              ) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
}

export default AdminDataProviderList;