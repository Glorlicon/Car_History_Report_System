import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateCarForSale, EditCarForSale, ListCarDealerCarForSale, SaleCar } from '../../services/api/Car';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarImages, CarModel, CarSaleDetails, CarSaleSearchParams, CarSalesInfo, Manufacturer, Paging } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/CarDealerCars.css'
import { useNavigate } from 'react-router-dom';
import CarForSaleDetailsPage from '../../components/forms/cardealer/CarForSaleDetailsPage';
import CarForSaleImagesPage from '../../components/forms/cardealer/CarForSaleImagesPage';
import { UploadMultipleImages } from '../../services/azure/Images';
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
import { ListManufacturerModel } from '../../services/api/CarForSale';

interface Column {
    id: 'vinId' | 'modelId' | 'price' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function CarDealerCarList() {
    const { t, i18n } = useTranslation()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const columns: readonly Column[] = [
        { id: 'vinId', label: t('VIN'), minWidth: 100 },
        { id: 'modelId', label: t('Model ID'), minWidth: 100 },
        { id: 'price', label: t('Price'), minWidth: 100 },
        { id: 'action', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
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
    const [searchPriceMin, setSearchPriceMin] = useState('')
    const [searchPriceMax, setSearchPriceMax] = useState('')
    const [searchModelList, setSearchModelList] = useState<CarModel[]>([])
    const [searchManuList, setSearchManuList] = useState<Manufacturer[]>([])
    const [selectedMake, setSelectedMake] = useState(0)
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const dealerId = JWTDecoder(token).dataprovider
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalPage, setModalPage] = useState(1);
    const basicCarSale = {
        carId: '',
        description: '',
        features: [""],
        price: 0,
        carImages: [] as any
    }
    const [newImages, setNewImages] = useState<File[]>([])
    const [removedImages, setRemovedImages] = useState<string[]>([])
    const [newCarSales, setNewCarSales] = useState<CarSalesInfo>(basicCarSale);
    const [feature, setFeature] = useState<string>('');
    const [editCarSales, setEditCarSales] = useState<CarSalesInfo|null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const validateCarSales = (carSales: CarSalesInfo): boolean => {
        if (!isValidVIN(carSales.carId as unknown as string)) {
            setAddError(t('VIN is invalid'));
            setOpenError(true)
            return false;
        }
        if (!carSales.carId) {
            setAddError(t('VIN must be filled out'));
            setOpenError(true)
            return false;
        }
        if (carSales.price <=0) {
            setAddError(t('Price must be larger than 0'));
            setOpenError(true)
            return false;
        }
        return true;
    };
    const [saleDetails, setSaleDetails] = useState<CarSaleDetails|null>();

    const handleSetFeature = (index: number, value: string) => {
        if (editCarSales) {
            let features = [...editCarSales.features]
            features[index] = value
            setEditCarSales({
                ...editCarSales,
                features: features
            });
        } else {
            let features = [...newCarSales.features]
            features[index] = value
            setNewCarSales({
                ...newCarSales,
                features: features
            });
        }
    }

    const handleAddFeature = () => {
        if (editCarSales) {
            setEditCarSales({
                ...editCarSales,
                features: [...editCarSales.features, ""],
            });
        } else {
            setNewCarSales({
                ...newCarSales,
                features: [...newCarSales.features, ""],
            });
        }
        //if (!feature || feature === '') return
        //if (editCarSales) {
        //    setEditCarSales({
        //        ...editCarSales,
        //        features: [...editCarSales.features, feature],
        //    });
        //} else {
        //    setNewCarSales({
        //        ...newCarSales,
        //        features: [...newCarSales.features, feature],
        //    });
        //}
        //setFeature('');
    };

    const handleRemoveFeature = (index: number) => {
        if (editCarSales) {
            let editFeatures = [...editCarSales.features];
            editFeatures.splice(index, 1);
            setEditCarSales({
                ...editCarSales,
                features: editFeatures,
            });
        } else {
            let newFeatures = [...newCarSales.features];
            newFeatures.splice(index, 1);
            setNewCarSales({
                ...newCarSales,
                features: newFeatures,
            });
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
    const handleAddCarSales = async () => {
        if (validateCarSales(newCarSales)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            let notFoundError = t('No image was found')
            const addImages = await UploadMultipleImages([], newImages, notFoundError)
            const response: APIResponse = await CreateCarForSale({
                ...newCarSales,
                carImages: addImages.data
            }, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setShowModal(false);
                setNewCarSales(basicCarSale)
                setModalPage(1)
                setMessage(t('Started selling car successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleEditCarSales = async () => {
        if (editCarSales != null && validateCarSales(editCarSales)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            let notFoundError = t('No image was found')
            const addImages = await UploadMultipleImages(removedImages, newImages, notFoundError)
            const response: APIResponse = await EditCarForSale({
                ...editCarSales,
                carImages: [
                    ...(editCarSales.carImages as CarImages[]).filter(image => image.id !== -1),
                    ... addImages.data
                ]
            }, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setEditCarSales(null)
                setModalPage(1)
                setMessage(t('Edit selling car information successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editCarSales) handleEditCarSales();
            else handleAddCarSales();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarSales) {
            setEditCarSales({
                ...editCarSales,
                [e.target.name]: value
            })
        } else {
            setNewCarSales({
                ...newCarSales,
                [e.target.name]: value,
            });
        }
    };

    const handleSoldClick = (id: string) => {
        setSaleDetails({
            carId: id,
            address: '',
            name: '',
            note: '',
            phoneNumber: '',
            startDate: '',
            dob:''
        })
    }
    const handleDetailsClick = (id: string) => {
        navigate(`/sales/details/${id}`)
    }
    const handleCarSale = async() => {
        if (saleDetails!=null && validateSaleDetails(saleDetails)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await SaleCar(saleDetails, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setSaleDetails(null);
                setMessage(t('Car is sold successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const addedImages: CarImages[] = []
        const imageFiles: File[] = []
        if (event.target.files) {
            for (var i = 0; i < event.target.files.length; i++) {
                addedImages.push({
                    id: -1,
                    imageLink: URL.createObjectURL(event.target.files[i])
                })
                imageFiles.push(event.target.files[i])
            }
            setNewImages([...newImages, ...imageFiles])
        }
        if (editCarSales) {
            setEditCarSales({
                ...editCarSales,
                carImages: [
                    ...editCarSales.carImages as CarImages[],
                    ...addedImages
                ]
            })
        } else {
            setNewCarSales({
                ...newCarSales,
                carImages: [
                    ...newCarSales.carImages as CarImages[],
                    ...addedImages
                ]
            })
        }
    }

    const handleRemoveImage = (index: number) => {
        if (editCarSales) {
            const currentImages: CarImages[] = [...editCarSales.carImages as CarImages[]]
            const removedImage = currentImages.splice(index, 1)
            setEditCarSales({
                ...editCarSales,
                carImages: currentImages
            })
            if (removedImage[0].id != -1) setRemovedImages([...removedImages, removedImage[0].imageLink])
        } else {
            const currentImages: CarImages[] = [...newCarSales.carImages as CarImages[]]
            const removedImage = currentImages.splice(index, 1)
            setNewCarSales({
                ...newCarSales,
                carImages: currentImages
            })
            if (removedImage[0].id != -1) setRemovedImages([...removedImages, removedImage[0].imageLink])
        }
    }
    const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (saleDetails)
        setSaleDetails({
            ...saleDetails,
            [e.target.name]: e.target.value
        })
    }

    const validateSaleDetails = (d: CarSaleDetails) => {
        if (!isValidNumber(d.phoneNumber)) {
            setAddError(t('Customer number is not valid'));
            setOpenError(true)
            return false;
        }
        if (!d.address || !d.dob || !d.name || !d.note || !d.phoneNumber || !d.startDate) {
            setAddError(t('All fields must be filled out'));
            setOpenError(true)
            return false;
        }
        return true;
    }

    const handleResetFilters = () => {
        setSearchManufacturer('')
        setSearchModel('')
        setSearchOdometerMax('')
        setSearchOdometerMin('')
        setSearchReleaseDateMax('')
        setSearchReleaseDateMin('')
        setSearchVin('')
        setSearchPriceMax('')
        setSearchPriceMin('')
        setSearchModelList([])
        setSelectedMake(0)
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: CarSaleSearchParams = {
            vin: searchVin,
            manufacturer: searchManufacturer,
            model: searchModel,
            odometerMax: searchOdometerMax,
            odometerMin: searchOdometerMin,
            releaseDateMax: searchReleaseDateMax,
            releaseDateMin: searchReleaseDateMin,
            priceMax: searchPriceMax,
            priceMin: searchPriceMin
        }
        const carSalesListResponse: APIResponse = await ListCarDealerCarForSale(dealerId, token, page+1, connectAPIError, language, searchParams)
        if (carSalesListResponse.error) {
            setError(carSalesListResponse.error)
        } else {
            setCarList(carSalesListResponse.data)
            setPaging(carSalesListResponse.pages)
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
                      <Typography style={{ fontWeight: 'bold' }}>+ {t('Add Car Sale')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Typography>
                          + {t('Add Manually')}
                      </Typography>
                      <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>+ {t('Add Car Sale')}</button>
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
                              <div className="reg-inspec-search-filter-item-2">
                                  <label>{t('Price')}</label>
                                  <div className="reg-inspec-search-filter-item-2-dates">
                                      <label>{t('From')}: </label>
                                      <input
                                          type="number"
                                          className="reg-inspec-search-bar"
                                          value={searchPriceMin}
                                          onChange={(e) => setSearchPriceMin(e.target.value)}
                                          min="0"
                                      />
                                      <label>{t('To')}: </label>
                                      <input
                                          type="number"
                                          className="reg-inspec-search-bar"
                                          value={searchPriceMax}
                                          onChange={(e) => setSearchPriceMax(e.target.value)}
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
                      <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                          {t('Car Sales List')}
                      </span>
                      <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                  <TableRow>
                                      {columns.map((column, index) => {
                                          if (column.id !== 'action') {
                                              return (
                                                  <TableCell
                                                      key={column.id + '-' + index}
                                                      align={column.align}
                                                      style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
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
                                                      style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
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
                                          <TableCell colSpan={4}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={4}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : carList.length > 0 ? carList
                                      .map((row, index1) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.vinId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'action' && column.id !== 'price') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'price') {
                                                          let value = row.carSalesInfo?.price;
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {value} {t('VND')}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'action') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">
                                                                  <div className="pol-crash-modal-content-2-buttons" style={{ justifyContent: 'space-evenly' }}>
                                                                      <button onClick={() => { if (row.carSalesInfo) setEditCarSales({ ...row.carSalesInfo, carId: row.vinId, carImages: row.carImages }) }} disabled={adding} className="pol-crash-action-button">
                                                                          {t('Edit1')} &#x270E;
                                                                      </button>
                                                                      <button onClick={() => handleDetailsClick(row.vinId)} disabled={adding} className="pol-crash-action-button">
                                                                          {t('Details')}
                                                                      </button>
                                                                      <button onClick={() => handleSoldClick(row.vinId)} disabled={adding} className="pol-crash-action-button">
                                                                          {t('Sold')}
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
                                          <TableCell colSpan={4}>
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
                      <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setNewCarSales(basicCarSale); setModalPage(1); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Add Car Sale')}</h2>
                      <div className="pol-crash-modal-content-2">
                          {modalPage === 1 && (
                              <CarForSaleDetailsPage
                                  action="Add"
                                  model={newCarSales}
                                  handleAddFeature={handleAddFeature}
                                  handleRemoveFeature={handleRemoveFeature}
                                  handleInputChange={handleInputChange}
                                  handleSetFeature={handleSetFeature}
                              />
                          )}
                          {modalPage === 2 && (
                              <CarForSaleImagesPage
                                  model={newCarSales}
                                  handleAddImages={handleAddImages}
                                  handleRemoveImages={handleRemoveImage}
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
          {editCarSales && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setEditCarSales(null); setModalPage(1) }}>&times;</span>
                      <h2>{t('Edit Car Sale')}</h2>
                      <div className="pol-crash-modal-content-2">
                          {modalPage === 1 && (
                              <CarForSaleDetailsPage
                                  action="Edit"
                                  model={editCarSales}
                                  handleAddFeature={handleAddFeature}
                                  handleRemoveFeature={handleRemoveFeature}
                                  handleInputChange={handleInputChange}
                                  handleSetFeature={handleSetFeature}
                              />
                          )}
                          {modalPage === 2 && (
                              <CarForSaleImagesPage
                                  model={editCarSales}
                                  handleAddImages={handleAddImages}
                                  handleRemoveImages={handleRemoveImage}
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
          {saleDetails && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setSaleDetails(null); }}>&times;</span>
                      <h2>{t('Sale Car')} {saleDetails.carId}</h2>
                      <div className="pol-crash-modal-content-2">
                          <div className="pol-crash-form-column">
                              <label>{t('Customer name')}</label>
                              <input type="text" name="name" value={saleDetails.name} onChange={handleSalesChange} />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Phone Number')}</label>
                              <input type="text" name="phoneNumber" value={saleDetails.phoneNumber} onChange={handleSalesChange} />
                          </div>
                          <div className="ad-car-model-form-column">
                              <label>{t('Address')}</label>
                              <input type="text" name="address" value={saleDetails.address} onChange={handleSalesChange} />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('DOB')}</label>
                              <input type="date" name="dob" value={saleDetails.dob} onChange={handleSalesChange} />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Sale Start Date')}</label>
                              <input type="date" name="startDate" value={saleDetails.startDate} onChange={handleSalesChange} />
                          </div>
                          <div className="pol-crash-form-column">
                              <label>{t('Note')}</label>
                              <input type="text" name="note" value={saleDetails.note} onChange={handleSalesChange} />
                          </div>
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleCarSale} disabled={adding} className="ad-user-add-btn">
                              {adding ? (
                                  <div className="ad-user-inline-spinner"></div>
                              ) : t('Confirm Sale') }
                          </button>
                      </div>                     
                  </div>
              </div>
          )}
      </div>
  );
}

export default CarDealerCarList;