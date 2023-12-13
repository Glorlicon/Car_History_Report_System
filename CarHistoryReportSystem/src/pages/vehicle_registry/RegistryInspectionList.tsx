import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RegistryInspectionDetailsForm from '../../components/forms/registry/RegistryInspectionDetailsForm';
import RegistryInspectionInspectedCategoriesForm from '../../components/forms/registry/RegistryInspectionInspectedCategoriesForm';
import { AddCarInspection, EditCarInspection, GetInspectionExcel, ListCarInspection } from '../../services/api/CarInspection';
import { RootState } from '../../store/State';
import { APIResponse, CarInspectionDetail, CarInspectionHistory, CarInspectionSearchParams, Paging } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/RegistryCarInspection.css'
import { Pagination } from '@mui/material';
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
    id: 'id' | 'carId' | 'note' | 'odometer' | 'reportDate' | 'description' | 'inspectionNumber' | 'inspectDate' | 'carInspectionHistoryDetail' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function RegistryInspectionList() {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'carId', label: t('VIN'), minWidth: 100 },
        { id: 'inspectionNumber', label: t('Location'), minWidth: 100 },
        { id: 'inspectDate', label: t('Severity'), minWidth: 100 },
        { id: 'description', label: t('Description'), minWidth: 100 },
        { id: 'carInspectionHistoryDetail', label: t('Inspected Categories'), minWidth: 100 },
        { id: 'odometer', label: t('Odometer'), minWidth: 100 },
        { id: 'reportDate', label: t('Report Date'), minWidth: 100 },
        { id: 'note', label: t('Note'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [page, setPage] = useState(0)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [modalPage, setModalPage] = useState(1);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [inspectionList, setInspectionList] = useState<CarInspectionHistory[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [newInspection, setNewInspection] = useState<CarInspectionHistory>({
        carId: '',
        odometer: 0,
        note: '',
        reportDate: '',
        description: '',
        inspectionNumber: '',
        inspectDate: '',
        carInspectionHistoryDetail: []
    })
    const [editInspection, setEditInspection] = useState<CarInspectionHistory | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchCarID, setSearchCarId] = useState('')
    const [searchInspectionNumber, setSearchInspectionNumber] = useState('')
    const [searchInspectionStartDate, setSearchInspectionStartDate] = useState('')
    const [searchInspectionEndDate, setSearchInspectionEndDate] = useState('')
    const [resetTrigger, setResetTrigger] = useState(0);
    const [viewImportData, setViewImportData] = useState<CarInspectionHistory[]>([])
    const [data, setData] = useState("")
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const validateCarInspection = (inspection: CarInspectionHistory): boolean => {
        if (!isValidVIN(inspection.carId)) {
            setAddError(t('VIN is invalid'));
            setOpenError(true)
            return false;
        }
        if (!inspection.carId) {
            setAddError(t('VIN must be filled out'));
            setOpenError(true)
            return false;
        }
        if (inspection.odometer <= 0 ) {
            setAddError(t('Odometer must be higher than 0'));
            setOpenError(true)
            return false;
        }
        if (!inspection.reportDate) {
            setAddError(t('Report Date must be chosen'));
            setOpenError(true)
            return false;
        }
        if (!inspection.description) {
            setAddError(t('Description must be filled out'));
            setOpenError(true)
            return false;
        }
        if (!inspection.inspectionNumber) {
            setAddError(t('Inspection Number must be filled out'));
            setOpenError(true)
            return false;
        }
        if (!inspection.inspectDate) {
            setAddError(t('Inspect Date must be chosen'));
            setOpenError(true)
            return false;
        }
        if (inspection.carInspectionHistoryDetail.length === 0 ) {
            setAddError(t('Inspection must have details'));
            setOpenError(true)
            return false;
        }
        for (let i = 0; i < inspection.carInspectionHistoryDetail.length; i++) {
            const check = validateCarInsectionDetails(inspection.carInspectionHistoryDetail[i])
            if (!check) return false
        }
        return true;
    };

    const validateCarInsectionDetails = (detail: CarInspectionDetail): boolean => {
        if (!detail.inspectionCategory) {
            setAddError(t('Inspection Category must be filled out'));
            setOpenError(true)
            return false;
        }

        return true
    }
    const handleAddCarInspection = async () => {
        if (validateCarInspection(newInspection)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarInspection(newInspection, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setShowModal(false);
                setModalPage(1);
                setNewInspection({
                    carId: '',
                    odometer: 0,
                    note: '',
                    reportDate: '',
                    description: '',
                    inspectionNumber: '',
                    inspectDate: '',
                    carInspectionHistoryDetail: []
                })
                setMessage(t('Add car inspection successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }
    const handleEditCarInspection = async () => {
        if (editInspection != null && editInspection.id != null && validateCarInspection(editInspection)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarInspection(editInspection.id, editInspection, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setShowModal(false);
                setEditInspection(null);
                setModalPage(1);
                setMessage(t('Edit car inspection successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }
    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };
    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editInspection) handleEditCarInspection();
            else handleAddCarInspection();
        }
    };
    const handleAddInspectionCategory = () => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: [
                    ...editInspection.carInspectionHistoryDetail,
                    {
                        inspectionCategory: '',
                        isPassed: false,
                        note: ''
                    }
                ]
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: [
                    ...newInspection.carInspectionHistoryDetail,
                    {
                        inspectionCategory: '',
                        isPassed: false,
                        note:''
                    }
                ]
            })
        }
    }

    const handleDateChange = (date: string, type: string) => {
        if (type === 'inspectDate') {
            if (editInspection) {
                setEditInspection({
                    ...editInspection,
                    inspectDate: date
                })
            } else {
                setNewInspection({
                    ...newInspection,
                    inspectDate: date,
                });
            }
        } else if (type === 'reportDate') {
            if (editInspection) {
                setEditInspection({
                    ...editInspection,
                    reportDate: date
                })
            } else {
                setNewInspection({
                    ...newInspection,
                    reportDate: date,
                });
            }
        }
    }

    const handleResetFilters = () => {
        setSearchCarId('')
        setSearchInspectionEndDate('')
        setSearchInspectionNumber('')
        setSearchInspectionStartDate('')
        setResetTrigger(prev => prev + 1);
    }

    const handleRemoveInspectionCategory = (index: number) => {
        if (editInspection) {
            let carInspectionHistoryDetails = [...editInspection.carInspectionHistoryDetail];
            carInspectionHistoryDetails.splice(index, 1);
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: carInspectionHistoryDetails,
            });
        } else {
            let carInspectionHistoryDetails = [...newInspection.carInspectionHistoryDetail];
            carInspectionHistoryDetails.splice(index, 1);
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: carInspectionHistoryDetails,
            });
        }
    }

    const handleInspectionCategoryStatus = (index: number) => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: editInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, isPassed: !detail.isPassed } : detail)
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: newInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, isPassed: !detail.isPassed } : detail)
            })
        }
    }

    const handleChangeInspectionCategory = (index: number, name: string) => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: editInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, inspectionCategory: name } : detail)
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: newInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, inspectionCategory: name } : detail)
            })
        }
    }

    const handleChangeInspectionNote = (index: number, name: string) => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: editInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, note: name } : detail)
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: newInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, note: name } : detail)
            })
        }
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                [e.target.name]: value
            })
        } else {
            setNewInspection({
                ...newInspection,
                [e.target.name]: value,
            });
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarInspectionSearchParams = {
            carId: searchCarID,
            endDate: searchInspectionEndDate,
            inspectionNumber: searchInspectionNumber,
            startDate: searchInspectionStartDate
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carInspectionResponse: APIResponse = await ListCarInspection(id, token, page+1, connectAPIError, language, searchParams)
        if (carInspectionResponse.error) {
            setError(carInspectionResponse.error)
        } else {
            setInspectionList(carInspectionResponse.data)
            setPaging(carInspectionResponse.pages)
            const responseCsv: APIResponse = await GetInspectionExcel(id, token, page+1, connectAPIError, language, searchParams)
            setData(responseCsv.data)
        }
        setLoading(false)
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
                      <Typography style={{ fontWeight: 'bold' }}>{t('+ Add Car Inspection')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          + {t('Add Manually')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>{t('+ Add Car Inspection')}</button>
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
                                  value={searchCarID}
                                  onChange={(e) => setSearchCarId(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item">
                              <label>{t('Inspection Number')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by Inspection Number')}
                                  value={searchInspectionNumber}
                                  onChange={(e) => setSearchInspectionNumber(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item-2">
                              <label>{t('Inspection Date')}</label>
                              <div className="reg-inspec-search-filter-item-2-dates">
                                  <label>{t('From')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Inspection Start Date"
                                      value={searchInspectionStartDate}
                                      onChange={(e) => setSearchInspectionStartDate(e.target.value)}
                                  />
                                  <label>{t('To')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Inspection End Date"
                                      value={searchInspectionEndDate}
                                      onChange={(e) => setSearchInspectionEndDate(e.target.value)}
                                  />
                              </div>
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
                      <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                          {t('Car Inspection List')}
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
                                  ) : inspectionList.length > 0 ? inspectionList
                                      .map((row, index) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions' && column.id !== 'carInspectionHistoryDetail') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  <div className="pol-crash-modal-content-2-buttons">
                                                                  <button onClick={() => { setEditInspection(row) }} disabled={adding} className="pol-crash-action-button">
                                                                      {t('Edit1')} &#x270E;
                                                                  </button>
                                                                  <button onClick={() => { navigate(`/registry/car-report/${row.carId}`) }} className="pol-crash-action-button">
                                                                      {t('View Report For Car')}
                                                                      </button>
                                                                  </div>
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'carInspectionHistoryDetail') {
                                                          let details = row[column.id]
                                                          const detailElements = details.map((value, detailIndex) => (
                                                              <div key={detailIndex}>
                                                                  <a>{value.inspectionCategory}: {value.isPassed ? t('Passed') : t('Not passed')}. {t('Note')}:{value.note}</a>
                                                              </div>
                                                          ));
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {detailElements}
                                                              </TableCell>
                                                          )
                                                      }
                                                  })}
                                              </TableRow>
                                          );
                                      }) :
                                      <TableRow>
                                          <TableCell colSpan={10}>
                                              {t('No car inspections found')}
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
                      <span className="reg-inspec-close-btn" onClick={() => {
                          setShowModal(false); setModalPage(1); setNewInspection({
                              carId: '',
                              odometer: 0,
                              note: '',
                              reportDate: '',
                              description: '',
                              inspectionNumber: '',
                              inspectDate: '',
                              carInspectionHistoryDetail: []
                          }); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add Car Inspection')}</h2>
                      <div className="pol-crash-modal-content-2">
                          {modalPage === 1 && (
                              <RegistryInspectionDetailsForm
                                  action="Add"
                                  handleInputChange={handleInputChange}
                                  model={newInspection}
                                  handleDateChange={handleDateChange}
                              />
                          )}
                          {modalPage === 2 && (
                              <RegistryInspectionInspectedCategoriesForm
                                  action="Add"
                                  model={newInspection}
                                  handleAddInspectionCategory={handleAddInspectionCategory}
                                  handleChangeInspectionCategory={handleChangeInspectionCategory}
                                  handleRemoveInspectionCategory={handleRemoveInspectionCategory}
                                  handleInspectionCategoryStatus={handleInspectionCategoryStatus}
                                  handleChangeInspectionNote={handleChangeInspectionNote}
                              />
                          )}
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : (
                              <div className="pol-crash-modal-content-2-buttons">
                                  <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                                      {t('Previous')}
                                  </button>
                                  <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                      {modalPage < 2 ? t('Next') : t('Finish')}
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}
          {editInspection && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setEditInspection(null); setModalPage(1) }}>&times;</span>
                      <h2>{t('Edit Car Inspection')}</h2>
                      <div className="pol-crash-modal-content-2">
                          {modalPage === 1 && (
                              <RegistryInspectionDetailsForm
                                  action="Edit"
                                  handleInputChange={handleInputChange}
                                  model={editInspection}
                                  handleDateChange={handleDateChange}
                              />
                          )}
                          {modalPage === 2 && (
                              <RegistryInspectionInspectedCategoriesForm
                                  action="Edit"
                                  model={editInspection}
                                  handleAddInspectionCategory={handleAddInspectionCategory}
                                  handleChangeInspectionCategory={handleChangeInspectionCategory}
                                  handleRemoveInspectionCategory={handleRemoveInspectionCategory}
                                  handleInspectionCategoryStatus={handleInspectionCategoryStatus}
                                  handleChangeInspectionNote={handleChangeInspectionNote}
                              />
                          )}
                          {addError && (
                              /*<p className="pol-crash-error">{addError}</p>*/
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : (
                              <div className="pol-crash-modal-content-2-buttons">
                                  <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                                      {t('Previous')}
                                  </button>
                                  <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                      {modalPage < 2 ? t('Next') : t('Finish')}
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}
          {paging && paging.TotalPages > 0 &&
              <div className="plate-search-page-row">
              <button className="export-pol-crash-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
              <a
                  href={`data:text/csv;charset=utf-8,${escape(data)}`}
                  download={`inpection-${Date.now()}.csv`}
                  hidden
                  id="excel"
              />
              </div>
          }
      </div>
  );
}

export default RegistryInspectionList;