import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { ListCarForSale, ListManufacturer, ListManufacturerModel } from '../../services/api/CarForSale';
import { APIResponse, Car, CarModel, CarSearchParams, Manufacturer, Paging } from '../../utils/Interfaces';
import '../../styles/CarForSale.css'
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mui/material';
import { GetImages } from '../../services/azure/Images';
import cardefaultimage from '../../images/car-default.jpg';
import { BODY_TYPES } from '../../utils/const/BodyTypes';
import { FUEL_TYPES } from '../../utils/const/FuelTypes';


function CarSalesPage() {
    const data = useSelector((state: RootState) => state.auth.token);
    const { t, i18n } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1)
    const [resetTrigger, setResetTrigger] = useState(0);
    const [manufacturerList, setManufacturerList] = useState<Manufacturer[]>([]);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [carMake, setCarMake] = useState('')
    const [carModel, setCarModel] = useState('')
    const [yearStart, setYearStart] = useState(0)
    const [priceMax, setPriceMax] = useState(9999999999)
    const [milageMax, setMilageMax] = useState(9999999999)
    const [paging, setPaging] = useState<Paging>()
    const [selectedMake, setSelectedMake] = useState(0)

    const handleResetFilters = () => {
        setCarMake('')
        setCarModel('')
        setSelectedMake(0)
        setModelList([])
        setYearStart(0)
        setPriceMax(9999999999)
        setMilageMax(9999999999)
        setResetTrigger(prev => prev + 1);
    }

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Number(e.target.value);
        setSelectedMake(selectedValue);
        let make = manufacturerList.find(m => m.id === selectedValue)
        setCarMake(make ? make.name : '')
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const ManufacturerModelResponse: APIResponse = await ListManufacturerModel(connectAPIError, language, selectedValue);

        if (!ManufacturerModelResponse.error) {
            setModelList(ManufacturerModelResponse.data);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarSearchParams = {
            make: carMake,
            model: carModel,
            yearstart: yearStart,
            pricemax: priceMax,
            milagemax: milageMax
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carListResponse: APIResponse = await ListCarForSale(page, connectAPIError, language, searchParams)
        if (carListResponse.error) {
            setError(carListResponse.error)
        } else {
            const manufacturerReponse: APIResponse = await ListManufacturer();
            setManufacturerList(manufacturerReponse.data)
            setCarList(carListResponse.data)
            setPaging(carListResponse.pages)
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
    function getBodyTypeName(value: number): string | null {
        for (const [key, val] of Object.entries(BODY_TYPES)) {
            if (val === value) {
                return key;
            }
        }
        return null;
    }
    function getFuelTypeName(value: number): string | null {
        for (const [key, val] of Object.entries(FUEL_TYPES)) {
            if (val === value) {
                return key;
            }
        }
        return null;
    }
    return (
        <>
            <div className="car-sale">
                <div id="filters" style={{ position: 'sticky', top: '100px', height: '500px' }}>
                    <button onClick={fetchData} id="clear-filters">{t('Search')}</button>
                    <div className="clear-filters">
                        <p>{t('Filters')}</p>
                        <button onClick={handleResetFilters}>{t('Clear Filters')}</button>
                    </div>
                    <div id="filter-options">
                        <div className="filter-choice">
                            <p>{t('Make')}</p>
                            <select onChange={handleSelectChange} value={selectedMake}>
                                <option value="">{t('Any Make')}</option>
                                {manufacturerList.length > 0 ? (
                                    manufacturerList.map((manufacturer, index) => (
                                        <option key={index} value={manufacturer.id}>{manufacturer.name}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>{t('Loading')}...</option>
                                )}
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>{t('Model')}</p>
                            <select
                                onChange={(e) => setCarModel(e.target.value)}
                                disabled={modelList.length === 0}
                                value={carModel}
                            >
                                <option value="">{t('Any Model')}</option>
                                {modelList.length > 0 ? (
                                    modelList.map((model, index) => (
                                        <option key={index} value={model.modelID}>{model.modelID}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>{t('Loading')}...</option>
                                )}
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>{t('Min Year')}</p>
                            <select onChange={(e) => setYearStart(Number(e.target.value))} value={yearStart}>
                                <option value="0">{t('Any Year')}</option>
                                <option value="2015">2015</option>
                                <option value="2014">2014</option>
                                <option value="2013">2013</option>
                                <option value="2012">2012</option>
                                <option value="2011">2011</option>
                                <option value="2010">2010</option>
                                <option value="2009">2009</option>
                                <option value="2008">2008</option>
                                <option value="2007">2007</option>
                                <option value="2006">2006</option>
                                <option value="2005">2005</option>
                                <option value="2004">2004</option>
                                <option value="2003">2003</option>
                                <option value="2002">2002</option>
                                <option value="2001">2001</option>
                                <option value="2000">2000</option>
                                <option value="1999">1999</option>
                                <option value="1998">1998</option>
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>{t('Max Price')}</p>
                            <select onChange={(e) => setPriceMax(Number(e.target.value))} value={priceMax}>
                                <option value="9999999999">{t('Any Price')}</option>
                                <option value="122025000">122.025.000 VND</option>
                                <option value="244050000">244.050.000 VND</option>
                                <option value="366075000">366.075.000 VND</option>
                                <option value="488100000">488.100.000 VND</option>
                                <option value="610125000">610.125.000 VND</option>
                                <option value="854175000">854.175.000 VND</option>
                                <option value="1220250000">1.220.250.000 VND</option>
                                <option value="1830375000">1.830.375.000 VND</option>
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>{t('Max Milage')}</p>
                            <select onChange={(e) => setMilageMax(Number(e.target.value))} value={milageMax}>
                                <option value="9999999999">{t('Any Milage')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <section id="car-listings">
                    <div id="sorting">
                        <div className="paging-result">
                            <p>{t('Showing')} {paging && paging.TotalPages > 0 ? paging?.CurrentPage : paging?.TotalPages} {t('out of')} {paging?.TotalPages} {t('pages')}</p>
                        </div>
                    </div>

                    {loading ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                <div className="ad-car-spinner"></div>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                {error}
                                <button onClick={fetchData} className="ad-car-retry-btn">Retry</button>
                            </td>
                        </tr>
                    ) : carList.length > 0 ? (
                        carList.map((model: any, index: number) => (
                            <a className="carlink" href={`/sales/details/${model.vinId}`}>
                                <div className="car-card" key={index}>
                                    <h1 style={{ fontSize: '40px', textAlign: 'left' }}>{model.model?.releasedDate.split('-')[0]} {model.modelId} {t(getFuelTypeName(model.model?.fuelType))} {t(getBodyTypeName(model.model?.bodyType))}</h1>
                                    <div style={{ display: 'flex' }}>
                                        <div className="car-image">
                                            <img src={model.carImages && model.carImages.length > 0 ? GetImages(model.carImages[0].imageLink) : cardefaultimage}
                                                alt="Car" />
                                            <span className="image-count">{model.carImages.length} {t('Photos')}</span>
                                        </div>
                                        <div className="car-details">
                                            <h1 className="price" style={{ textAlign: 'left' }}>{t('Price')}: {model.carSalesInfo.price} {t('VND')}</h1>
                                            <div className="details">
                                                <p><span>{t('Color')}:</span> {t(model.colorName)}</p>
                                                <p><span>{t('Country')}:</span> {t(model.model?.country)}</p>
                                                <p><span>{t('Dimension')}:</span> {t(model.model?.dimension)}</p>
                                                <p><span>{t('Mileage')}:</span> {t(model.currentOdometer)} KM</p>
                                                <p><span>{t('Manifacturer')}:</span> {t(model.model?.manufacturerName)}</p>
                                                <p><span>{t('RPM')}:</span> {t(model.model?.rpm)}</p>
                                                <p><span>{t('Dimension')}:</span> {t(model.model?.dimension)}</p>
                                                <p><span>{t('Engine Number')}:</span> {t(model.engineNumber)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dealer-info">
                                        <p style={{fontSize:'25px'}}><span>{t('VIN')}:</span> {model.vinId}</p>
                                        <p style={{fontSize:'25px'}}>
                                            <span>{t('Car Dealer')}:</span>{' '}
                                            <a
                                                href={`sales/dealer/${model.carSalesInfo.dataProvider.id}`}
                                                className="dealer-link"
                                            >
                                                {model.carSalesInfo.dataProvider.name}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </a>

                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>{t('No cars found')}</td>
                        </tr>
                    )}
                    <div id="pagination">
                        {paging && paging.TotalPages > 0 &&
                            <>
                                <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                            </>
                        }
                    </div>
                </section>
            </div>
        </>
    );
}

export default CarSalesPage;
