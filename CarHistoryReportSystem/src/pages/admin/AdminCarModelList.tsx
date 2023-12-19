import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarModelCapacityPage from '../../components/forms/admin/CarModel/CarModelCapacityPage';
import CarModelModalEnginePage from '../../components/forms/admin/CarModel/CarModelModalEnginePage';
import CarModelModalIdentificationPage from '../../components/forms/admin/CarModel/CarModelModalIdentificationPage';
import CarModelModalPhysCharacteristicPage from '../../components/forms/admin/CarModel/CarModelModalPhysCharacteristicPage';
import { AddCarModel, EditCarModel, ListAdminCarModels } from '../../services/api/CarModel';
import { List, ListManu } from '../../services/api/DataProvider';
import { RootState } from '../../store/State';
import { BODY_TYPES } from '../../utils/const/BodyTypes';
import { FUEL_TYPES } from '../../utils/const/FuelTypes';
import { APIResponse, CarModel, CarModelSearchParams, ManufacturerSearchParams, ModelMaintenance, Paging } from '../../utils/Interfaces';
import '../../styles/AdminCarModels.css'
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mui/material';
import CarModelMaintenancePage from '../../components/forms/admin/CarModel/CarModelMaintenancePage';
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

interface Column {
    id: 'modelID' | 'manufacturerName' | 'wheelFormula' | 'wheelTread' | 'dimension' | 'wheelBase'
    | 'weight' | 'releasedDate' | 'country' | 'fuelType' | 'bodyType' | 'personCarriedNumber'
    | 'seatNumber' | 'layingPlaceNumber' | 'maximumOutput' | 'engineDisplacement' | 'rpm' | 'tireNumber' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function AdminCarModelList() {
    const { t, i18n } = useTranslation()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const [page, setPage] = useState(0)
    const columns: readonly Column[] = [
        { id: 'modelID', label: t('Model ID'), minWidth: 10 },
        { id: 'manufacturerName', label: t('Manufacturer Name'), minWidth: 100 },
        { id: 'wheelFormula', label: t('Wheel Formula'), minWidth: 100 },
        { id: 'wheelTread', label: t('Wheel Tread'), minWidth: 100 },
        { id: 'dimension', label: t('Dimension'), minWidth: 100 },
        { id: 'wheelBase', label: t('Wheel Base'), minWidth: 100 },
        { id: 'weight', label: t('Weight'), minWidth: 100 },
        { id: 'releasedDate', label: t('Released Date'), minWidth: 100 },
        { id: 'country', label: t('Country'), minWidth: 100 },
        { id: 'fuelType', label: t('Fuel Type'), minWidth: 100 },
        { id: 'bodyType', label: t('Body Type'), minWidth: 100 },
        { id: 'personCarriedNumber', label: t('Person Carried Number'), minWidth: 100 },
        { id: 'seatNumber', label: t('Seat Number'), minWidth: 100 },
        { id: 'layingPlaceNumber', label: t('Laying Place Number'), minWidth: 100 },
        { id: 'maximumOutput', label: t('Maximum Output'), minWidth: 100 },
        { id: 'engineDisplacement', label: t('Engine Displacement'), minWidth: 100 },
        { id: 'rpm', label: t('RPM'), minWidth: 100 },
        { id: 'tireNumber', label: t('Tire Number'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [searchModelId, setSearchModelId] = useState('')
    const [searchReleasedDateStart, setSearchReleasedDateStart] = useState('')
    const [searchReleasedDateEnd, setSearchReleasedDateEnd] = useState('')
    const [searchManuName, setSearchManuName] = useState('')
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [manufacturers, setManufacturers] = useState([])
    const [carModels, setCarModels] = useState<CarModel[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editModel, setEditModel] = useState<CarModel | null>(null)
    const [newModel, setNewModel] = useState<CarModel>({
        modelID: "",
        manufacturerId: 0,
        manufacturerName: "",
        wheelFormula: "",
        wheelTread: "",
        dimension: "",
        wheelBase: 0,
        weight: 0,
        releasedDate: "",
        country: "",
        fuelType: 0,
        bodyType: 0,
        ridingCapacity: 0,
        personCarriedNumber: 0,
        seatNumber: 0,
        layingPlaceNumber: 0,
        maximumOutput: 0,
        engineDisplacement: 0,
        rpm: 0,
        tireNumber: 0,
        modelOdometers: [
            {
                dayPerMaintainance: 0,
                maintenancePart: 'BrakeInspection',
                odometerPerMaintainance: 0,
                recommendAction: 'Inspect Brake System'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'ChangePart',
                odometerPerMaintainance: 0,
                recommendAction: 'Change Car Part'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'OilChange',
                odometerPerMaintainance: 0,
                recommendAction: 'Change Oil'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'RepairCarRecall',
                odometerPerMaintainance: 0,
                recommendAction: 'Repair Car Recall'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'TireRotation',
                odometerPerMaintainance: 0,
                recommendAction: 'Rotate Tire'
            }
        ]
    })


    const validateCarModel = (model: CarModel): boolean => {
        if (!model.modelID) {
            setAddError(t('Model ID must be filled out'));
            return false;
        }
        if (model.manufacturerId <= 0) {
            setAddError(t('Manufacturer must be chosen'));
            return false;
        }
        if (model.fuelType < 0) {
            setAddError(t('Fuel Type must be chosen'));
            return false;
        }
        if (model.bodyType < 0) {
            setAddError(t('Body Type must be chosen'));
            return false;
        }
        if (!model.country) {
            setAddError(t('Country must be filled out'));
            return false;
        }
        if (!model.releasedDate) {
            setAddError(t('Released Date must be chosen'));
            return false;
        }
        for (let i = 0; i < model.modelOdometers.length; i++) {
            const check = validateCarMaintenanceDetails(model.modelOdometers[i])
            if (!check) {
                return false
            }
        }
        return true;
    };

    const validateCarMaintenanceDetails = (detail: ModelMaintenance): boolean => {
        if (detail.dayPerMaintainance <= 0) {
            setAddError(t('Day Per Maintainance must be higher than 0'));
            return false;
        }
        if (detail.odometerPerMaintainance <= 0) {
            setAddError(t('Odometer Per Maintainance must be higher than 0'));
            return false;
        }

        return true
    }

    const handleNextPage = () => {
        if (modalPage < 5) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editModel) handleEditModel();
            else handleAddModel();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };

    const handleChangeDayPerMaintainance = (index: number, value: string) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                modelOdometers: editModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, dayPerMaintainance: Number.parseInt(value) } : detail)
            })
        } else {
            setNewModel({
                ...newModel,
                modelOdometers: newModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, dayPerMaintainance: Number.parseInt(value) } : detail)
            })
        }
    }
    const handleChangeOdometerPerMaintainance = (index: number, value: string) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                modelOdometers: editModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, odometerPerMaintainance: Number.parseInt(value) } : detail)
            })
        } else {
            setNewModel({
                ...newModel,
                modelOdometers: newModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, odometerPerMaintainance: Number.parseInt(value) } : detail)
            })
        }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                [e.target.name]: e.target.value
            })
        } else {
            setNewModel({
                ...newModel,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleAddModel = async () => {
        if (validateCarModel(newModel)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarModel(newModel, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setModalPage(1);
                setMessage(t('Add car model successfully'))
                setOpenSuccess(true)
                setNewModel({
                    modelID: "",
                    manufacturerId: 0,
                    manufacturerName: "",
                    wheelFormula: "",
                    wheelTread: "",
                    dimension: "",
                    wheelBase: 0,
                    weight: 0,
                    releasedDate: "",
                    country: "",
                    fuelType: 0,
                    bodyType: 0,
                    ridingCapacity: 0,
                    personCarriedNumber: 0,
                    seatNumber: 0,
                    layingPlaceNumber: 0,
                    maximumOutput: 0,
                    engineDisplacement: 0,
                    rpm: 0,
                    tireNumber: 0,
                    modelOdometers: [
                        {
                            dayPerMaintainance: 0,
                            maintenancePart: 'BrakeInspection',
                            odometerPerMaintainance: 0,
                            recommendAction: 'Inspect Brake System'
                        },
                        {
                            dayPerMaintainance: 0,
                            maintenancePart: 'ChangePart',
                            odometerPerMaintainance: 0,
                            recommendAction: 'Change Car Part'
                        },
                        {
                            dayPerMaintainance: 0,
                            maintenancePart: 'OilChange',
                            odometerPerMaintainance: 0,
                            recommendAction: 'Change Oil'
                        },
                        {
                            dayPerMaintainance: 0,
                            maintenancePart: 'RepairCarRecall',
                            odometerPerMaintainance: 0,
                            recommendAction: 'Repair Car Recall'
                        },
                        {
                            dayPerMaintainance: 0,
                            maintenancePart: 'TireRotation',
                            odometerPerMaintainance: 0,
                            recommendAction: 'Rotate Tire'
                        }
                    ]
                })
                fetchData();
            }
        }
    };

    const handleEditModel = async () => {
        if (editModel != null && validateCarModel(editModel)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarModel(editModel, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditModel(null);
                setModalPage(1);
                setMessage(t('Edit car model successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    };
    const handleDateChange = (date: string, type: string) => {
        if (type === 'releasedDate') {
            if (editModel) {
                setEditModel({
                    ...editModel,
                    releasedDate: date
                })
            } else {
                setNewModel({
                    ...newModel,
                    releasedDate: date,
                });
            }
        } 
    }
    const handleResetFilters = () => {
        setSearchManuName('')
        setSearchModelId('')
        setSearchReleasedDateEnd('')
        setSearchReleasedDateStart('')
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: CarModelSearchParams = {
            manuName: searchManuName,
            modelId: searchModelId,
            releasedDateEnd: searchReleasedDateEnd,
            releasedDateStart: searchReleasedDateStart
        }
        let searchManuParams: ManufacturerSearchParams = {
            name: '',
            email: ''
        }
        const manuListResponse: APIResponse = await ListManu(token, 1, connectAPIError, unknownError, language, searchManuParams);
        if (manuListResponse.error) {
            setError(manuListResponse.error);
        } else {
            setManufacturers(manuListResponse.data)
            const carModelResponse: APIResponse = await ListAdminCarModels(token, page+1, connectAPIError, unknownError, language, searchParams)
            if (carModelResponse.error) {
                setError(carModelResponse.error)
            } else {
                setCarModels(carModelResponse.data)
                setPaging(carModelResponse.pages)
            }
        }
        setLoading(false)
    };
    function getFuelTypeName(value: number): string | null {
        for (const [key, val] of Object.entries(FUEL_TYPES)) {
            if (val === value) {
                return key;
            }
        }
        return null; 
    }
    function getBodyTypeName(value: number): string | null {
        for (const [key, val] of Object.entries(BODY_TYPES)) {
            if (val === value) {
                return key;
            }
        }
        return null;
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
                      <Typography style={{ fontWeight: 'bold' }}>+ {t('Add Car Model')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          {t('Add Manually')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>{t('Add Car Model')}</button>
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
                              <label>{t('Model ID')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by Model ID')}
                                  value={searchModelId}
                                  onChange={(e) => setSearchModelId(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item">
                              <label>{t('Manufacturer Name')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by Manufacturer Name')}
                                  value={searchManuName}
                                  onChange={(e) => setSearchManuName(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item-2">
                              <label>{t('Released Date')}</label>
                              <div className="reg-inspec-search-filter-item-2-dates">
                                  <label>{t('From')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      value={searchReleasedDateStart}
                                      onChange={(e) => setSearchReleasedDateStart(e.target.value)}
                                  />
                                  <label>{t('To')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      value={searchReleasedDateEnd}
                                      onChange={(e) => setSearchReleasedDateEnd(e.target.value)}
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
                          {t('Car Models List')}
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
                                          <TableCell colSpan={19}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={19}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : carModels.length > 0 ? carModels
                                      .map((row, index1) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.modelID + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions' && column.id !== 'bodyType' && column.id !== 'fuelType') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'bodyType') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {t(getBodyTypeName(value))}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'fuelType') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {t(getFuelTypeName(value))}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">                                                        
                                                                  <button onClick={() => { setEditModel(row); }} disabled={adding} className="pol-crash-action-button">
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
                                          <TableCell colSpan={19}>
                                              {t('No car models found')}
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
                          setShowModal(false); setModalPage(1); setNewModel({
                              modelID: "",
                              manufacturerId: 0,
                              manufacturerName: "",
                              wheelFormula: "",
                              wheelTread: "",
                              dimension: "",
                              wheelBase: 0,
                              weight: 0,
                              releasedDate: "",
                              country: "",
                              fuelType: 0,
                              bodyType: 0,
                              ridingCapacity: 0,
                              personCarriedNumber: 0,
                              seatNumber: 0,
                              layingPlaceNumber: 0,
                              maximumOutput: 0,
                              engineDisplacement: 0,
                              rpm: 0,
                              tireNumber: 0,
                              modelOdometers: [
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'BrakeInspection',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Inspect Brake System'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'ChangePart',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Change Car Part'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'OilChange',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Change Oil'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'RepairCarRecall',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Repair Car Recall'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'TireRotation',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Rotate Tire'
                                  }
                              ]
                          }); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add Car Model')}</h2>
                      <div className="pol-crash-modal-content-2">
                          {modalPage === 1 && (
                              <CarModelModalIdentificationPage
                                  action="Add"
                                  model={newModel}
                                  manufacturers={manufacturers}
                                  handleInputChange={handleInputChange}
                                  handleDateChange={handleDateChange}
                              />
                          )}
                          {modalPage === 2 && (
                              <CarModelModalPhysCharacteristicPage
                                  model={newModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                          {modalPage === 3 && (
                              <CarModelModalEnginePage
                                  model={newModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                          {modalPage === 4 && (
                              <CarModelCapacityPage
                                  model={newModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                          {modalPage === 5 && (
                              <CarModelMaintenancePage
                                  model={newModel}
                                  handleChangeDayPerMaintainance={handleChangeDayPerMaintainance}
                                  handleChangeOdometerPerMaintainance={handleChangeOdometerPerMaintainance}
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
                                      {modalPage < 5 ? t('Next') : t('Finish')}
                                  </button>
                              </div>
                          )}
                      </div>                      
                  </div>
              </div>
          )}
          {editModel && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setEditModel(null); setModalPage(1)}}>&times;</span>
                      <h2>{t('Edit Car Model')}</h2>
                      <div className="pol-crash-modal-content-2">
                          {modalPage === 1 && (
                              <CarModelModalIdentificationPage
                                  action="Edit"
                                  model={editModel}
                                  manufacturers={manufacturers}
                                  handleInputChange={handleInputChange}
                                  handleDateChange={handleDateChange}
                              />
                          )}
                          {modalPage === 2 && (
                              <CarModelModalPhysCharacteristicPage
                                  model={editModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                          {modalPage === 3 && (
                              <CarModelModalEnginePage
                                  model={editModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                          {modalPage === 4 && (
                              <CarModelCapacityPage
                                  model={editModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                          {modalPage === 5 && (
                              <CarModelMaintenancePage
                                  model={editModel}
                                  handleChangeDayPerMaintainance={handleChangeDayPerMaintainance}
                                  handleChangeOdometerPerMaintainance={handleChangeOdometerPerMaintainance}
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
                                      {modalPage < 5 ? t('Next') : t('Finish')}
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

export default AdminCarModelList;