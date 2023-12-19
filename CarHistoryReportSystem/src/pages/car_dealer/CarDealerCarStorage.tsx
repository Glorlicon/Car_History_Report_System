import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarCharacteristicPage from '../../components/forms/admin/Car/CarCharacteristicPage';
import CarIdentificationPage from '../../components/forms/admin/Car/CarIdentificationPage';
import { AddCar, AddOldCarToStorage, EditCar, ListDealerCarStorage } from '../../services/api/Car';
import { ListAllCarModels } from '../../services/api/CarModel';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarModel, CarModelSearchParams, CarStorageSearchParams, Manufacturer, Paging } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/ManufacturerCars.css'
import { useTranslation } from 'react-i18next';
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField'
import { ListManufacturer, ListManufacturerModel } from '../../services/api/CarForSale';

interface Column {
    id: 'vinId' | 'modelId' | 'colorName' | 'currentOdometer' | 'engineNumber' | 'isModified'
    | 'isCommercialUse' |  'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function CarDealerCarStorage() {
    const { t, i18n } = useTranslation()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const [page, setPage] = useState(0)
    const columns: readonly Column[] = [
        { id: 'vinId', label: t('VIN'), minWidth: 100 },
        { id: 'modelId', label: t('Model ID'), minWidth: 100 },
        { id: 'colorName', label: t('Color'), minWidth: 100 },
        { id: 'currentOdometer', label: t('Odometer'), minWidth: 100 },
        { id: 'engineNumber', label: t('Engine Number'), minWidth: 100 },
        { id: 'isModified', label: t('Modified'), minWidth: 100 },
        { id: 'isCommercialUse', label: t('Commercial Use'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [searchManufacturer, setSearchManufacturer] = useState('')
    const [searchVin, setSearchVin] = useState('')
    const [searchModel, setSearchModel] = useState('')
    const [searchOdometerMin, setSearchOdometerMin] = useState('')
    const [searchOdometerMax, setSearchOdometerMax] = useState('')
    const [searchReleaseDateMin, setSearchReleaseDateMin] = useState('')
    const [searchReleaseDateMax, setSearchReleaseDateMax] = useState('')
    const [searchModelList, setSearchModelList] = useState<CarModel[]>([])
    const [searchManuList, setSearchManuList] = useState<Manufacturer[]>([])
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalPage, setModalPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newCar, setNewCar] = useState<Car>({
        vinId: '',
        color: 0,
        currentOdometer: 0,
        engineNumber: '',
        isCommercialUse: false,
        isModified: false,
        modelId: ''
    });
    const [editCar, setEditCar] = useState<Car | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [oldCarVin, setOldCarVin] = useState('')
    const [isBrandNewCar, setBrandNewCar] = useState(false)
    const [selectedMake, setSelectedMake] = useState(0)
    const validateCar = (car: Car): boolean => {
        if (!isValidVIN(car.vinId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!car.vinId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!car.modelId || car.modelId === "notChosen") {
            setAddError(t('Model must be chosen'));
            return false;
        }
        if (!car.engineNumber) {
            setAddError(t('Engine Number must be filled out'));
            return false;
        }
        return true;
    };

    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editCar) handleEditCar();
            else handleAddCar();
        }
    };

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Number(e.target.value);
        setSelectedMake(selectedValue);
        let make = searchManuList.find(m => m.id === selectedValue)
        setSearchManufacturer(make ? make.name : '')
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const ManufacturerModelResponse: APIResponse = await ListManufacturerModel(connectAPIError, language, selectedValue);

        if (!ManufacturerModelResponse.error) {
            setSearchModelList(ManufacturerModelResponse.data);
        }
    };

    const handleAddCar = async () => {
        if (validateCar(newCar)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCar(newCar, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                const response2: APIResponse = await AddOldCarToStorage(id, newCar.vinId, token, connectAPIError, language)
                if (response2.error) {
                    setAddError(response2.error);
                } else {
                    setShowModal(false);
                    setModalPage(1);
                    setMessage(t('Added car to storage successfully'))
                    setOpenSuccess(true)
                    setNewCar({
                        vinId: '',
                        color: 0,
                        currentOdometer: 0,
                        engineNumber: '',
                        isCommercialUse: false,
                        isModified: false,
                        modelId: ''
                    })
                    setBrandNewCar(false)
                    fetchData();
                }
            }
        }
    }
    const handleAddOldCar = async () => {
        if (!isValidVIN(oldCarVin)) {
            setAddError(t('VIN is invalid'))
            return
        }
        if (!oldCarVin) {
            setAddError(t('VIN must be filled out'));
            return;
        }
        setAdding(true);
        setAddError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await AddOldCarToStorage(id, oldCarVin, token, connectAPIError, language)
        setAdding(false);
        if (response.error) {
            setAddError(response.error);
        } else {
            setShowModal(false);
            setModalPage(1);
            setOldCarVin('')
            setMessage(t('Added car to storage successfully'))
            setOpenSuccess(true)
            fetchData();
        }
    }

    const handleEditCar = async () => {
        if (editCar != null && validateCar(editCar)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCar(editCar, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditCar(null);
                setModalPage(1);
                setMessage(t('Edit car to storage successfully'))
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

    const handleBrandNewCarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (typeof value === "boolean") setBrandNewCar(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCar) {
            setEditCar({
                ...editCar,
                [e.target.name]: value
            })
        } else {
            setNewCar({
                ...newCar,
                [e.target.name]: value,
            });
        }
    };

    const handleOldCarVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldCarVin(e.target.value)
    }

    const handleResetFilters = () => {
        setSearchManufacturer('')
        setSearchModel('')
        setSearchOdometerMax('')
        setSearchOdometerMin('')
        setSearchReleaseDateMax('')
        setSearchReleaseDateMin('')
        setSearchVin('')
        setSearchModelList([])
        setSelectedMake(0)
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchCarModelParams: CarModelSearchParams = {
            manuName: '',
            modelId: '',
            releasedDateEnd: '',
            releasedDateStart: ''
        }
        let searchParams: CarStorageSearchParams = {
            vin: searchVin,
            manufacturer: searchManufacturer,
            model: searchModel,
            odometerMax: searchOdometerMax,
            odometerMin: searchOdometerMin,
            releaseDateMax: searchReleaseDateMax,
            releaseDateMin: searchReleaseDateMin
        }
        const carModelResponse: APIResponse = await ListAllCarModels(token, page+1, connectAPIError, unknownError, language, searchCarModelParams)
        if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            setModelList(carModelResponse.data)
            const carListResponse: APIResponse = await ListDealerCarStorage(token, page+1, connectAPIError, language, searchParams)
            if (carListResponse.error) {
                setError(carListResponse.error)
            } else {
                const manufacturerReponse: APIResponse = await ListManufacturer();
                setSearchManuList(manufacturerReponse.data)
                setCarList(carListResponse.data)
                setPaging(carListResponse.pages)
            }
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
                      <Typography style={{ fontWeight: 'bold' }}>+ {t('Add Car To Storage')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          {t('Add Manually')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>{t('Add Car To Storage')}</button>
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
                      <div className="reg-inspec-search-filter-container-3">
                          <div className="reg-inspec-search-filter-container-2">
                              <div className="reg-inspec-search-filter-item-2">
                                  <label>{t('Release Year')}</label>
                                  <div className="reg-inspec-search-filter-item-2-dates">
                                      <label>{t('From')}: </label>
                                      <input
                                          type="number"
                                          className="reg-inspec-search-bar"
                                          value={searchReleaseDateMin}
                                          onChange={(e) => setSearchReleaseDateMin(e.target.value)}
                                          min="1900"
                                          max="2099"
                                          step="1"
                                      />
                                      <label>{t('To')}: </label>
                                      <input
                                          type="number"
                                          className="reg-inspec-search-bar"
                                          value={searchReleaseDateMax}
                                          onChange={(e) => setSearchReleaseDateMax(e.target.value)}
                                          min="1900"
                                          max="2099"
                                          step="1"
                                      />
                                  </div>
                              </div>
                              <div className="reg-inspec-search-filter-item-2">
                                  <label>{t('Odometer')}</label>
                                  <div className="reg-inspec-search-filter-item-2-dates">
                                      <label>{t('From')}: </label>
                                      <input
                                          type="number"
                                          className="reg-inspec-search-bar"
                                          value={searchOdometerMin}
                                          onChange={(e) => setSearchOdometerMin(e.target.value)}
                                          min="0"
                                      />
                                      <label>{t('To')}: </label>
                                      <input
                                          type="number"
                                          className="reg-inspec-search-bar"
                                          value={searchOdometerMax}
                                          onChange={(e) => setSearchOdometerMax(e.target.value)}
                                          min="0"
                                      />
                                  </div>
                              </div>
                          </div>
                          <div className="reg-inspec-search-filter-container-2">
                              <div className="reg-inspec-search-filter-item">
                                  <label>{t('Car ID')}</label>
                                  <input
                                      type="text"
                                      className="reg-inspec-search-bar"
                                      placeholder={t('Search by Car ID')}
                                      value={searchVin}
                                      onChange={(e) => setSearchVin(e.target.value)}
                                  />
                              </div>
                              <div className="reg-inspec-search-filter-item">
                                  <label>{t('Manufacturer')}</label>
                                  <select onChange={handleSelectChange} value={selectedMake} className="reg-inspec-search-bar">
                                      <option value="">{t('Any Make')}</option>
                                      {searchManuList.length > 0 ? (
                                          searchManuList.map((manufacturer, index) => (
                                              <option key={index} value={manufacturer.id}>{manufacturer.name}</option>
                                          ))
                                      ) : (
                                          <option value="" disabled>{t('Loading')}...</option>
                                      )}
                                  </select>
                              </div>
                              <div className="reg-inspec-search-filter-item">
                                  <label>{t('Car Model')}</label>
                                  <select
                                      className="reg-inspec-search-bar"
                                      onChange={(e) => setSearchModel(e.target.value)}
                                      disabled={searchModelList.length === 0}
                                      value={searchModel}
                                  >
                                      <option value="">{t('Any Model')}</option>
                                      {searchModelList.length > 0 ? (
                                          searchModelList.map((model, index) => (
                                              <option key={index} value={model.modelID}>{model.modelID}</option>
                                          ))
                                      ) : (
                                          <option value="" disabled>{t('Loading')}...</option>
                                      )}
                                  </select>
                              </div>
                          </div>
                      </div>
                      <div className="reg-inspec-search-filter-item-4">
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
                      <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom:'15px',paddingTop:'15px' }}>
                          {t('Car Storage List')}
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
                                          <TableCell colSpan={8}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={8}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : carList.length > 0 ? carList
                                      .map((row, index1) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.vinId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions' && column.id !== 'isModified' && column.id !== 'isCommercialUse') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'isModified' || column.id === 'isCommercialUse') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value ? t('Yes') : t('No')}
                                                              </TableCell>
                                                          )
                                                      }  else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">
                                                                  <button onClick={() => { setEditCar(row); }} disabled={adding} className="pol-crash-action-button">
                                                                      {t('Edit1')} &#x270E;
                                                                  </button>
                                                              </TableCell>
                                                          )
                                                      }
                                                  })}
                                              </TableRow>
                                          );
                                      }) :
                                      <TableRow>
                                          <TableCell colSpan={8}>
                                              {t('No cars found')}
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
                          setShowModal(false); setModalPage(1); setBrandNewCar(false); setOldCarVin(''); setNewCar({
                              vinId: '',
                              color: 0,
                              currentOdometer: 0,
                              engineNumber: '',
                              isCommercialUse: false,
                              isModified: false,
                              modelId: ''
                          }); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add Car To Storage')}</h2>
                      <div className="pol-crash-modal-content-2">
                          <div className="pol-crash-form-column">
                              <div className="pol-crash-checkboxes-2">
                                  <input type="checkbox" name="isBrandNewCar" checked={isBrandNewCar} onChange={handleBrandNewCarChange} />
                                  <label>{t('Brand New Car')}?</label>
                              </div>
                          </div>
                          {isBrandNewCar ? (
                              <>
                                  {modalPage === 1 && (
                                      <CarCharacteristicPage
                                          action="Add"
                                          model={newCar}
                                          handleInputChange={handleInputChange}
                                      />
                                  )}
                                  {modalPage === 2 && (
                                      <CarIdentificationPage
                                          action="Add"
                                          model={newCar}
                                          handleInputChange={handleInputChange}
                                          carModels={modelList}
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
                              </>
                          ) : (
                              <>
                                      <div className="pol-crash-form-column">
                                          <label>{t('VIN')}</label>
                                          <TextField type="text" name="oldCarVin" value={oldCarVin} onChange={handleOldCarVinChange} style={{ width: '100%' }} size='small' />
                                      </div>
                                      {addError && (
                                          <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                              {addError}
                                          </MuiAlert>
                                      )}
                                      <button onClick={handleAddOldCar} disabled={adding} className="pol-stolen-model-add-btn">
                                          {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Finish')}
                                      </button>
                              </>
                          )}
                      </div>                     
                  </div>
              </div>
          )}
          {editCar && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setEditCar(null); setModalPage(1); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Edit Car')}</h2>
                      <div className="pol-crash-modal-content-2">
                          {modalPage === 1 && (
                              <CarCharacteristicPage
                                  action="Edit"
                                  model={editCar}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                          {modalPage === 2 && (
                              <CarIdentificationPage
                                  action="Edit"
                                  model={editCar}
                                  handleInputChange={handleInputChange}
                                  carModels={modelList}
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
      </div>
  );
}

export default CarDealerCarStorage;