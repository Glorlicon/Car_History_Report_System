import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateCarForSale, EditCarForSale, ListCarDealerCarForSale, SaleCar } from '../../services/api/Car';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarImages, CarSaleDetails, CarSaleSearchParams, CarSalesInfo, Paging } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/CarDealerCars.css'
import { useNavigate } from 'react-router-dom';
import CarForSaleDetailsPage from '../../components/forms/cardealer/CarForSaleDetailsPage';
import CarForSaleImagesPage from '../../components/forms/cardealer/CarForSaleImagesPage';
import { UploadMultipleImages } from '../../services/azure/Images';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mui/material';

function CarDealerCarList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
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
        features: [],
        price: 0,
        carImages: [] as any
    }
    const [newImages, setNewImages] = useState<File[]>([])
    const [removedImages, setRemovedImages] = useState<string[]>([])
    const [newCarSales, setNewCarSales] = useState<CarSalesInfo>(basicCarSale);
    const [feature, setFeature] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [editCarSales, setEditCarSales] = useState<CarSalesInfo|null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const validateCarSales = (carSales: CarSalesInfo): boolean => {
        if (!isValidVIN(carSales.carId as unknown as string)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!carSales.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (carSales.price <=0) {
            setAddError(t('Price must be larger than 0'));
            return false;
        }
        return true;
    };
    const [saleDetails, setSaleDetails] = useState<CarSaleDetails|null>();

    const handleAddFeature = () => {
        if (!feature || feature === '') return
        if (editCarSales) {
            setEditCarSales({
                ...editCarSales,
                features: [...editCarSales.features, feature],
            });
        } else {
            setNewCarSales({
                ...newCarSales,
                features: [...newCarSales.features, feature],
            });
        }
        setFeature('');
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
            } else {
                setShowModal(false);
                setModalPage(1)
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
            } else {
                setEditCarSales(null)
                setModalPage(1)
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        navigate(`/dealer/cars/${id}`)
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
            } else {
                setSaleDetails(null);
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
            return false;
        }
        if (!d.address || !d.dob || !d.name || !d.note || !d.phoneNumber || !d.startDate) {
            setAddError(t('All fields must be filled out'));
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
        const carSalesListResponse: APIResponse = await ListCarDealerCarForSale(dealerId, token, page, connectAPIError, language, searchParams)
        if (carSalesListResponse.error) {
            setError(carSalesListResponse.error)
        } else {
            setCarList(carSalesListResponse.data)
            setPaging(carSalesListResponse.pages)
        }
        setLoading(false)
    }

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
      <div className="dealer-car-sales-list-page">
          <div className="dealer-car-sales-top-bar">
              <button className="add-dealer-car-sales-btn" onClick={() => setShowModal(true)}>+ {t('Add Car Sale')}</button>
          </div>
          <div className="reg-inspec-top-bar-2">
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
                          <label>{t('Manufacturer')}(WIP)</label>
                          <input
                              type="text"
                              className="reg-inspec-search-bar"
                              placeholder={t('Search by Manufacturer Name')}
                              value={searchManufacturer}
                              onChange={(e) => setSearchManufacturer(e.target.value)}
                          />
                      </div>
                      <div className="reg-inspec-search-filter-item">
                          <label>{t('Car Model')}(WIP)</label>
                          <input
                              type="text"
                              className="reg-inspec-search-bar"
                              placeholder={t('Search by Car Model')}
                              value={searchModel}
                              onChange={(e) => setSearchModel(e.target.value)}
                          />
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
          </div>
          <table className="dealer-car-sales-table">
              <thead>
                  <tr>
                      <th>{t('VIN')}</th>
                      <th>{t('Model ID')}</th>
                      <th>{t('Price')}</th>
                      <th>{t('Action')}</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="dealer-car-sales-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="dealer-car-sales-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                  ) : carList.length > 0 ? (
                      carList.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCarSales({ ...model.carSalesInfo, carId: model.vinId, carImages: model.carImages }) }}>{model.vinId}</td>
                              <td>{model.modelId}</td>
                              <td>{model.carSalesInfo.price}</td>
                              <td>
                                  <button className="dealer-car-sales-action-btn" onClick={() => handleDetailsClick(model.vinId)}>{t('Details')}</button>
                                  <button className="dealer-car-sales-action-btn" onClick={() => handleSoldClick(model.vinId)}>{t('Sold')}</button>
                              </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>{t('No cars found')}</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="dealer-car-sales-modal">
                  <div className="dealer-car-sales-modal-content-2">
                      <span className="dealer-car-sales-close-btn" onClick={() => { setShowModal(false); setNewCarSales(basicCarSale); setModalPage(1) }}>&times;</span>
                      <h2>{t('Add Car Sale')}</h2>
                      {modalPage === 1 && (
                          <CarForSaleDetailsPage
                              action="Add"
                              model={newCarSales}
                              feature={feature}
                              setFeature={setFeature}
                              handleAddFeature={handleAddFeature}
                              handleRemoveFeature={handleRemoveFeature}
                              handleInputChange={handleInputChange}
                          />
                      )}
                      {modalPage === 2 && (
                          <CarForSaleImagesPage
                              model={newCarSales}
                              handleAddImages={handleAddImages}
                              handleRemoveImages={handleRemoveImage}
                          />
                      )}
                      {adding ? (<div className="dealer-car-sales-inline-spinner"></div>) : (
                          <>
                              <button onClick={handlePreviousPage} disabled={modalPage === 1} className="dealer-car-sales-prev-btn">
                                  {t('Previous')}
                              </button>
                              <button onClick={handleNextPage} disabled={adding} className="dealer-car-sales-next-btn">
                                  {modalPage < 2 ? t('Next') : t('Finish')}
                              </button>
                          </>
                      )}
                      {addError && (
                          <p className="dealer-car-sales-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editCarSales && (
              <div className="dealer-car-sales-modal">
                  <div className="dealer-car-sales-modal-content-2">
                      <span className="dealer-car-sales-close-btn" onClick={() => { setEditCarSales(null); setModalPage(1) }}>&times;</span>
                      <h2>{t('Edit Car Sale')}</h2>
                      {modalPage === 1 && (
                          <CarForSaleDetailsPage
                              action="Edit"
                              model={editCarSales}
                              feature={feature}
                              setFeature={setFeature}
                              handleAddFeature={handleAddFeature}
                              handleRemoveFeature={handleRemoveFeature}
                              handleInputChange={handleInputChange}
                          />
                      )}
                      {modalPage === 2 && (
                          <CarForSaleImagesPage
                              model={editCarSales}
                              handleAddImages={handleAddImages}
                              handleRemoveImages={handleRemoveImage}
                          />
                      )}
                      {adding ? (<div className="dealer-car-sales-inline-spinner"></div>) : (
                          <>
                              <button onClick={handlePreviousPage} disabled={modalPage === 1} className="dealer-car-sales-prev-btn">
                                  {t('Previous')}
                              </button>
                              <button onClick={handleNextPage} disabled={adding} className="dealer-car-sales-next-btn">
                                  {modalPage < 2 ? t('Next') : t('Finish')}
                              </button>
                          </>
                      )}
                      {addError && (
                          <p className="dealer-car-sales-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {saleDetails && (
              <div className="dealer-car-sales-modal">
                  <div className="dealer-car-sales-modal-content-sale">
                      <span className="dealer-car-sales-close-btn" onClick={() => { setSaleDetails(null); }}>&times;</span>
                      <h2>{t('Sale Car')} {saleDetails.carId}</h2>
                      <div className="dealer-car-sales-form-columns-2">
                          <div className="dealer-car-sales-form-column">
                              <label>{t('Customer name')}</label>
                              <input type="text" name="name" value={saleDetails.name} onChange={handleSalesChange} />
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>{t('Phone Number')}</label>
                              <input type="text" name="phoneNumber" value={saleDetails.phoneNumber} onChange={handleSalesChange} />
                          </div>
                      </div>
                      <div className="dealer-car-sales-form-columns-2">
                          <div className="ad-car-model-form-column">
                              <label>{t('Address')}</label>
                              <input type="text" name="address" value={saleDetails.address} onChange={handleSalesChange} />
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>{t('DOB')}</label>
                              <input type="date" name="dob" value={saleDetails.dob} onChange={handleSalesChange} />
                          </div>
                      </div>
                      <div className="dealer-car-sales-form-columns-2">
                          <div className="dealer-car-sales-form-column">
                              <label>{t('Sale Start Date')}</label>
                              <input type="date" name="startDate" value={saleDetails.startDate} onChange={handleSalesChange} />
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>{t('Note')}</label>
                              <input type="text" name="note" value={saleDetails.note} onChange={handleSalesChange} />
                          </div>
                      </div>
                      <button onClick={handleCarSale} disabled={adding} className="dealer-car-sales-add-btn">
                          {adding ? (<div className="dealer-car-sales-inline-spinner"></div>) : t('Confirm Sale')}
                      </button>
                      {addError && (
                          <p className="dealer-car-sales-error">{addError}</p>
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

export default CarDealerCarList;