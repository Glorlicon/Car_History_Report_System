import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import InsuranceCompanyInsuranceDetailsForm from '../../components/forms/insurance/InsuranceCompanyInsuranceDetailsForm';
import { AddCarInsurance, DownloadInsuranceExcelFile, EditCarInsurance, GetInsuranceExcel, ImportInsuranceFromExcel, ListCarInsurance } from '../../services/api/CarInsurance';
import { RootState } from '../../store/State';
import { APIResponse, CarInsurance, CarInsuranceSearchParams, Paging } from '../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/InsuranceCompanyInsurance.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
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
import { useNavigate } from 'react-router-dom';
interface Column {
    id: 'id' | 'carId' | 'description' | 'insuranceNumber' | 'startDate' | 'endDate' | 'odometer' | 'reportDate' | 'note' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function InsuranceCompanyInsuranceList() {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'carId', label: t('VIN'), minWidth: 100 },
        { id: 'odometer', label: t('Odometer'), minWidth: 100 },
        { id: 'description', label: t('Description'), minWidth: 100 },
        { id: 'insuranceNumber', label: t('Insurance Number'), minWidth: 100 },
        { id: 'reportDate', label: t('Report Date'), minWidth: 100 },
        { id: 'startDate', label: t('Insurance Start Date'), minWidth: 100 },
        { id: 'endDate', label: t('Insurance End Date'), minWidth: 100 },
        { id: 'note', label: t('Note'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [searchVinId, setSearchVinId] = useState('')
    const [searchInsuranceNumber, setSearchInsuranceNumber] = useState('')
    const [searchStartInsuranceDateMin, setSearchStartInsuranceDateMin] = useState('')
    const [searchStartInsuranceDateMax, setSearchStartInsuranceDateMax] = useState('')
    const [searchEndInsuranceDateMin, setSearchEndInsuranceDateMin] = useState('')
    const [searchEndInsuranceDateMax, setSearchEndInsuranceDateMax] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carInsuranceList, setCarInsuranceList] = useState<CarInsurance[]>([]);
    const [newCarInsurance, setNewCarInsurance] = useState<CarInsurance>({
        insuranceNumber: '',
        carId: '',
        startDate: '',
        endDate: '',
        description: '',
        odometer: 0,
        note: '',
        reportDate: ''
    });
    const [editCarInsurance, setEditCarInsurance] = useState<CarInsurance | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [openImport, setOpenImport] = useState(false)
    const [template, setTemplate] = useState('')
    const [templateTrigger, setTemplateTrigger] = useState(0)
    const [importData, setImportData] = useState<FormData | null>(null)
    const [viewImportData, setViewImportData] = useState<CarInsurance[]>([])
    const isFirstRender = useRef(true);

    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const handleDownloadTemplate = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const res = await DownloadInsuranceExcelFile(token, connectAPIError, language)
        if (res.data) {
            setTemplate(res.data)
            setTemplateTrigger(prev => prev + 1)
        }
    }
    const handleDownloadTemplateClick = () => {
        const element = document.getElementById('template')
        element?.click()
    }
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            handleDownloadTemplateClick();
        }
    }, [templateTrigger])

    const handleImportExcel = async () => {
        if (importData) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await ImportInsuranceFromExcel(token, importData, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setOpenImport(false)
                setImportData(null)
                setViewImportData([])
                setMessage(t('Add car stolen report successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleImportClick = () => {
        document.getElementById('excel-file')?.click()
    }

    const handleAddDataFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files[0]) {
            const file = files[0]
            Papa.parse(file, {
                complete: (result: any) => {
                    const transformedData = result.data.map((row: any) => {
                        const newRow: { [key: string]: any } = {};
                        Object.keys(row).forEach((key) => {
                            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
                            newRow[newKey] = row[key];
                        });
                        return newRow;
                    });
                    setViewImportData(transformedData);
                },
                header: true,
            });
            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    const fileContent = e.target.result
                    const formData = new FormData()
                    formData.append('file', file)
                    setImportData(formData)
                }
            }
            reader.readAsText(file);
        }
    }

    const validateCarInsurance = (insurance: CarInsurance): boolean => {
        if (!isValidVIN(insurance.carId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!insurance.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!insurance.insuranceNumber) {
            setAddError(t('Insurance Number must be filled out'));
            return false;
        }
        if (!insurance.odometer) {
            setAddError(t('Odometer must be chosen'));
            return false;
        }
        if (!insurance.startDate) {
            setAddError(t('Start Date must be chosen'));
            return false;
        }
        if (!insurance.endDate) {
            setAddError(t('End Date must be chosen'));
            return false;
        }
        if (!insurance.description) {
            setAddError(t('Description must be filled out'));
            return false;
        }
        if (!insurance.note) {
            setAddError(t('Note must be filled out'));
            return false;
        }
        if (!insurance.reportDate) {
            setAddError(t('Report Date must be chosen'));
            return false;
        }
        return true;
    };
    const handleAddCarInsurance = async () => {
        if (validateCarInsurance(newCarInsurance)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarInsurance(newCarInsurance, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setNewCarInsurance({
                    insuranceNumber: '',
                    carId: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    odometer: 0,
                    note: '',
                    reportDate: ''
                })
                setMessage(t('Add car stolen report successfully'))
                setOpenSuccess(true)
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarInsurance = async () => {
        if (editCarInsurance && editCarInsurance.id && validateCarInsurance(editCarInsurance)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarInsurance(editCarInsurance.id, editCarInsurance, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditCarInsurance(null)
                setMessage(t('Add car stolen report successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarInsurance) {
            setEditCarInsurance({
                ...editCarInsurance,
                [e.target.name]: value
            })
        } else {
            setNewCarInsurance({
                ...newCarInsurance,
                [e.target.name]: value,
            });
        }
    };

    const handleDateChange = (date: string, type: string) => {
        if (type === 'reportDate') {
            if (editCarInsurance) {
                setEditCarInsurance({
                    ...editCarInsurance,
                    reportDate: date
                })
            } else {
                setNewCarInsurance({
                    ...newCarInsurance,
                    reportDate: date,
                });
            }
        } else if (type === 'startDate') {
            if (editCarInsurance) {
                setEditCarInsurance({
                    ...editCarInsurance,
                    startDate: date
                })
            } else {
                setNewCarInsurance({
                    ...newCarInsurance,
                    startDate: date,
                });
            }
        } else if (type === 'endDate') {
            if (editCarInsurance) {
                setEditCarInsurance({
                    ...editCarInsurance,
                    endDate: date
                })
            } else {
                setNewCarInsurance({
                    ...newCarInsurance,
                    endDate: date,
                });
            }
        }
    }

    const handleResetFilters = () => {
        setSearchEndInsuranceDateMax('')
        setSearchEndInsuranceDateMin('')
        setSearchInsuranceNumber('')
        setSearchStartInsuranceDateMax('')
        setSearchStartInsuranceDateMin('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarInsuranceSearchParams = {
            vinID: searchVinId,
            insuranceNumber: searchInsuranceNumber,
            startInsuranceDateMax: searchStartInsuranceDateMax,
            startInsuranceDateMin: searchStartInsuranceDateMin,
            endInsuranceDateMax: searchEndInsuranceDateMax,
            endInsuranceDateMin: searchEndInsuranceDateMin
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carInsuranceResponse: APIResponse = await ListCarInsurance(id, token, page+1, connectAPIError, language, searchParams)
        if (carInsuranceResponse.error) {
            setError(carInsuranceResponse.error)
        } else {
            setCarInsuranceList(carInsuranceResponse.data)
            setPaging(carInsuranceResponse.pages)
            const responseCsv: APIResponse = await GetInsuranceExcel(id, token, page+1, connectAPIError, language, searchParams)
            setData(responseCsv.data)
        }
        setLoading(false)
    }
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
      <div className="pol-stolen-list-page">
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
                      <Typography style={{ fontWeight: 'bold' }}>+ {t('Add New Car Insurance')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          {t('Add Manually')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>{t('Add New Car Insurance')}</button>
                  </AccordionDetails>
                  <AccordionDetails>
                      <Typography>
                          {t('Add Using Excel')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => { handleDownloadTemplate() }}>&dArr; {t('Excel Template')}</button>
                      <a
                          href={`data:text/csv;charset=utf-8,${escape(template)}`}
                          download={`template.csv`}
                          hidden
                          id="template"
                      />
                      <button className="add-pol-crash-btn" onClick={() => { setOpenImport(true) }}>{t('Import From Excel')}</button>
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
                              <label>{t('Car ID')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by Car ID')}
                                  value={searchVinId}
                                  onChange={(e) => setSearchVinId(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item">
                              <label>{t('Insurance Number')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by Insurance Number')}
                                  value={searchInsuranceNumber}
                                  onChange={(e) => setSearchInsuranceNumber(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item-2">
                              <label>{t('Insurance Start Date')}</label>
                              <div className="reg-inspec-search-filter-item-2-dates">
                                  <label>{t('From')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Insurance Start Date"
                                      value={searchStartInsuranceDateMin}
                                      onChange={(e) => setSearchStartInsuranceDateMin(e.target.value)}
                                  />
                                  <label>{t('To')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Insurance Start Date"
                                      value={searchStartInsuranceDateMax}
                                      onChange={(e) => setSearchStartInsuranceDateMax(e.target.value)}
                                  />
                              </div>
                          </div>
                          <div className="reg-inspec-search-filter-item-2">
                              <label>{t('Insurance End Date')}</label>
                              <div className="reg-inspec-search-filter-item-2-dates">
                                  <label>{t('From')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Insurance End Date"
                                      value={searchEndInsuranceDateMin}
                                      onChange={(e) => setSearchEndInsuranceDateMin(e.target.value)}
                                  />
                                  <label>{t('To')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Insurance End Date"
                                      value={searchEndInsuranceDateMax}
                                      onChange={(e) => setSearchEndInsuranceDateMax(e.target.value)}
                                  />
                              </div>
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
                          {t('Car Insurance List')}
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
                                          <TableCell colSpan={10}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={10}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : carInsuranceList.length > 0 ? carInsuranceList
                                      .map((row, index1) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">
                                                                  <div className="pol-crash-modal-content-2-buttons">
                                                                  <button onClick={() => { setEditCarInsurance(row) }} disabled={adding} className="pol-crash-action-button">
                                                                      {t('Edit1')} &#x270E;
                                                                  </button>
                                                                  <button onClick={() => { navigate(`/insurance/car-report/${row.carId}`) }} disabled={adding} className="pol-crash-action-button-2">
                                                                      {t('View Report For Car')}
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
                                          <TableCell colSpan={10}>
                                              {t('No car insurances found')}
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
          {showModal && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => {
                          setShowModal(false); setNewCarInsurance({
                              insuranceNumber: '',
                              carId: '',
                              startDate: '',
                              endDate: '',
                              description: '',
                              odometer: 0,
                              note: '',
                              reportDate: ''
                          }); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add New Car Insurance')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <InsuranceCompanyInsuranceDetailsForm
                              action="Add"
                              model={newCarInsurance}
                              handleInputChange={handleInputChange}
                              handleDateChange={handleDateChange}
                          />
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleAddCarInsurance} disabled={adding} className="pol-stolen-model-add-btn">
                              {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
          {editCarInsurance && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setEditCarInsurance(null) }}>&times;</span>
                      <h2>{t('Edit Car Insurance')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <InsuranceCompanyInsuranceDetailsForm
                              action="Edit"
                              model={editCarInsurance}
                              handleInputChange={handleInputChange}
                              handleDateChange={handleDateChange}
                          />
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleEditCarInsurance} disabled={adding} className="pol-stolen-model-add-btn">
                              {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
          {openImport && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setOpenImport(false); setImportData(null) }}>&times;</span>
                      <h2>{t('Import from csv')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <div className="reg-reg-form-column-2">
                              <input type="file" id="excel-file" accept=".csv" className="csv-input" onChange={handleAddDataFromFile} />
                              <button onClick={handleImportClick} className="dealer-car-sales-form-image-add-button"> {t('Choose file')}</button>
                          </div>
                          <span style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                              {t('Car Insurance List')}
                          </span>
                          <TableContainer>
                              <Table stickyHeader aria-label="sticky table">
                                  <TableHead>
                                      <TableRow>
                                          {columns.map((column, index) => {
                                              if (column.id !== 'id' && column.id !== 'actions')
                                                  return (
                                                      <TableCell
                                                          key={column.id + '-' + index}
                                                          align={column.align}
                                                          style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}
                                                      >
                                                          {column.label}
                                                      </TableCell>
                                                  )
                                          })}
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {viewImportData.length > 0 ? viewImportData
                                          .map((row, index) => {
                                              return (
                                                  <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                      {columns.map((column, index) => {
                                                          if (column.id !== 'actions' && column.id !== 'id') {
                                                              let value = row[column.id]
                                                              return (
                                                                  <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                      {value}
                                                                  </TableCell>
                                                              )
                                                          } 
                                                      })}
                                                  </TableRow>
                                              );
                                          }) :
                                          <TableRow>
                                              <TableCell colSpan={8}>
                                                  {t('No car insurances found')}
                                              </TableCell>
                                          </TableRow>
                                      }
                                  </TableBody>
                              </Table>
                          </TableContainer>
                          <MuiAlert elevation={6} variant="filled" severity="warning" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                              {t('Import file must have all data correct to be able to import')} !
                          </MuiAlert>
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleImportExcel} disabled={adding} className="reg-reg-model-add-btn">
                              {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
          {paging && paging.TotalPages > 0 &&
              <div className="plate-search-page-row">
                  <button className="export-pol-crash-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                  <a
                      href={`data:text/csv;charset=utf-8,${escape(data)}`}
                      download={`insurance-${Date.now()}.csv`}
                      hidden
                      id="excel"
                  />
              </div>
          }
      </div>
  );
}

export default InsuranceCompanyInsuranceList;