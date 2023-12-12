import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PoliceCarStolenDetailsForm from '../../components/forms/police/PoliceCarStolenDetailsForm';
import { AddCarStolenHistory, DownloadStolenExcelFile, EditCarStolenHistory, GetStolenExcel, ImportStolenFromExcel, ListCarStolen } from '../../services/api/CarStolen';
import { RootState } from '../../store/State';
import { APIResponse, CarStolen, CarStolenExcel, CarStolenSearchParams, Paging } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/PoliceStolenCar.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { CAR_STOLEN_STATUS } from '../../utils/const/CarStolenStatus';
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
    id: 'id' | 'carId' | 'description' | 'status' |'odometer' | 'reportDate' | 'note' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function PoliceStolenCarList() {
    const { t, i18n } = useTranslation()
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'carId', label: t('VIN'), minWidth: 100 },
        { id: 'odometer', label: t('Odometer'), minWidth: 100 },
        { id: 'status', label: t('Status'), minWidth: 100 },
        { id: 'reportDate', label: t('Report Date'), minWidth: 100 },
        { id: 'note', label: t('Note'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [searchVinId, setSearchVinId] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carStolenList, setcarStolenList] = useState<CarStolen[]>([]);
    const [newCarStolenReport, setNewCarStolenReport] = useState<CarStolen>({
        description: '',
        carId: '',
        odometer: 0,
        status: 0,
        note: '',
        reportDate: ''
    });
    const [editCarStolenReport, setEditCarStolenReport] = useState<CarStolen | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [openImport, setOpenImport] = useState(false)
    const [template, setTemplate] = useState('')
    const [templateTrigger, setTemplateTrigger] = useState(0)
    const [importData, setImportData] = useState<FormData | null>(null)
    const [viewImportData, setViewImportData] = useState<CarStolenExcel[]>([])
    const isFirstRender = useRef(true);

    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const handleDownloadTemplate = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const res = await DownloadStolenExcelFile(token, connectAPIError, language)
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
            const response: APIResponse = await ImportStolenFromExcel(token, importData, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
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
    const validateCarStolenReport = (stolenReport: CarStolen): boolean => {
        if (!isValidVIN(stolenReport.carId)) {
            setAddError(t('VIN is invalid'));
            setOpenError(true)
            return false;
        }
        if (!stolenReport.carId) {
            setAddError(t('VIN must be filled out'));
            setOpenError(true)
            return false;
        }
        if (!stolenReport.description) {
            setAddError(t('Description must be filled out'));
            setOpenError(true)
            return false;
        }
        if (!stolenReport.odometer) {
            setAddError(t('Odometer must be chosen'));
            setOpenError(true)
            return false;
        }
        if (!stolenReport.note) {
            setAddError(t('Note must be filled out'));
            setOpenError(true)
            return false;
        }
        if (!stolenReport.reportDate) {
            setAddError(t('Report Date must be chosen'));
            setOpenError(true)
            return false;
        }
        return true;
    };
    const handleAddCarStolenReport = async () => {
        if (validateCarStolenReport(newCarStolenReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarStolenHistory(newCarStolenReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setNewCarStolenReport({
                    description: '',
                    carId: '',
                    odometer: 0,
                    status: 0,
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

    const handleEditCarStolenReport = async () => {
        if (editCarStolenReport && editCarStolenReport.id && validateCarStolenReport(editCarStolenReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarStolenHistory(editCarStolenReport.id, editCarStolenReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setEditCarStolenReport(null)
                setMessage(t('Edit car stolen report successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarStolenReport) {
            setEditCarStolenReport({
                ...editCarStolenReport,
                [e.target.name]: value
            })
        } else {
            setNewCarStolenReport({
                ...newCarStolenReport,
                [e.target.name]: value,
            });
        }
    };
    const handleDateChange = (date: string, type: string) => {
        if (type === 'reportDate') {
            if (editCarStolenReport) {
                setEditCarStolenReport({
                    ...editCarStolenReport,
                    reportDate: date
                })
            } else {
                setNewCarStolenReport({
                    ...newCarStolenReport,
                    reportDate: date,
                });
            }
        }
    }
    const handleResetFilters = () => {
        setSearchStatus('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarStolenSearchParams = {
            vinID: searchVinId,
            status: searchStatus
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carStolenReportResponse: APIResponse = await ListCarStolen(id, token, page+1, connectAPIError, language, searchParams)
        if (carStolenReportResponse.error) {
            setError(carStolenReportResponse.error)
        } else {
            setcarStolenList(carStolenReportResponse.data)
            setPaging(carStolenReportResponse.pages)
            const responseCsv: APIResponse = await GetStolenExcel(id, token, page+1, connectAPIError, language, searchParams)
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
                      <Typography style={{ fontWeight: 'bold' }}>+ {t('Add New Stolen Car Report')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          + {t('Add Manually')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>+ {t('Add New Stolen Car Report')}</button>
                  </AccordionDetails>
                  <AccordionDetails>
                      <Typography>
                          + {t('Add Using Excel')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => { handleDownloadTemplate() }}>&dArr; {t('Excel Template')}</button>
                      <a
                          href={`data:text/csv;charset=utf-8,${escape(template)}`}
                          download={`template.csv`}
                          hidden
                          id="template"
                      />
                      <button className="add-pol-crash-btn" onClick={() => { setOpenImport(true) }}>+ {t('Import From Excel')}</button>
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
                              <label>{t('Status')}</label>
                              <select className="reg-inspec-search-bar" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                  <option value=''>{t('All')}</option>
                                  <option value={CAR_STOLEN_STATUS.Stolen}>{t('Stolen')}</option>
                                  <option value={CAR_STOLEN_STATUS.Found}>{t('Found')}</option>
                              </select>
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
                  </AccordionDetails>
              </Accordion>
          </div>
          <div className="plate-search-page-row">
              <div className="plate-alert-page-item">
                  <div className="plate-search-page-item-3">
                      <TableContainer>
                          <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                              {t('Car Stolen List')}
                          </span>
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
                                          <TableCell colSpan={7}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={7}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : carStolenList.length > 0 ? carStolenList
                                      .map((row, index) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions' && column.id !== 'status') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'status') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {value === 1 ? t('Found') : t('Stolen')}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  <button onClick={() => { setEditCarStolenReport(row) }} disabled={adding} className="pol-crash-action-button">
                                                                      {t('Edit1')}
                                                                  </button>
                                                              </TableCell>
                                                          )
                                                      }
                                                  })}
                                              </TableRow>
                                          );
                                      }) :
                                      <TableRow>
                                          <TableCell colSpan={7}>
                                              {t('No stolen car reports found')}
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
          {showModal && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => {
                          setShowModal(false); setNewCarStolenReport({
                              description: '',
                              carId: '',
                              odometer: 0,
                              status: 0,
                              note: '',
                              reportDate: ''
                          }); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add Car Stolen Report')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <PoliceCarStolenDetailsForm
                              action="Add"
                              model={newCarStolenReport}
                              handleDateChange={handleDateChange}
                              handleInputChange={handleInputChange}
                          />
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                              /*<p className="pol-stolen-error">{addError}</p>*/
                          )}
                          <button onClick={handleAddCarStolenReport} disabled={adding} className="pol-stolen-model-add-btn">
                              {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
          {editCarStolenReport && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setEditCarStolenReport(null); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Edit Car Stolen Report')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <PoliceCarStolenDetailsForm
                              action="Edit"
                              model={editCarStolenReport}
                              handleInputChange={handleInputChange}
                              handleDateChange={handleDateChange}
                          />
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleEditCarStolenReport} disabled={adding} className="pol-stolen-model-add-btn">
                              {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Finish')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
          {openImport && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setOpenImport(false); setImportData(null); setViewImportData([]); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Import from csv')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <div className="reg-reg-form-column-2">
                              <input type="file" id="excel-file" accept=".csv" className="csv-input" onChange={handleAddDataFromFile} />
                              <button onClick={handleImportClick} className="dealer-car-sales-form-image-add-button"> {t('Choose file')}</button>
                          </div>
                          <span style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                              {t('Car Stolen List')}
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
                                                          if (column.id !== 'actions' && column.id !== 'status' && column.id !== 'id') {
                                                              let value = row[column.id]
                                                              return (
                                                                  <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                      {value}
                                                                  </TableCell>
                                                              )
                                                          } else if (column.id === 'status') {
                                                              let value = row[column.id];
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
                                              <TableCell colSpan={11}>
                                                  {t('No stolen car reports found')}
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
                              /*<p className="pol-crash-error">{addError}</p>*/
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
                      download={`stolen-${Date.now()}.csv`}
                      hidden
                      id="excel"
                  />
              </div>
          }
      </div>
  );
}

export default PoliceStolenCarList;