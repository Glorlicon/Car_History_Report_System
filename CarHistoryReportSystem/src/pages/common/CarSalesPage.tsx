import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import {ListCarForSale, ListManufacturer, ListManufacturerModel } from '../../services/api/CarForSale';
import { APIResponse, Car, CarModel, CarSearchParams, Manufacturer, Paging } from '../../utils/Interfaces';
import '../../styles/CarForSale.css'
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mui/material';

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
        setYearStart(0)
        setPriceMax(9999999999)
        setMilageMax(9999999999)
        setResetTrigger(prev => prev + 1);
    }

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Number(e.target.value);
        setSelectedMake(selectedValue);
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
        console.log("car list", carListResponse.data)
        if (carListResponse.error) {
            setError(carListResponse.error)
        } else {
            const manufacturerReponse: APIResponse = await ListManufacturer();
            setManufacturerList(manufacturerReponse.data)
            console.log(manufacturerReponse.data)
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

    return (
        <>
            <div className="car-sale">
                <aside id="filters">
                    <div id="search">
                        <input type="text" placeholder={t('Search')} />
                    </div>
                    <button id="clear-filters">{t('Search')}</button>
                    <div className="clear-filters">
                        <p>{t('Filters')}</p>
                        <button onClick={handleResetFilters}>{t('Clear Filters')}</button>
                    </div>
                    <div id="filter-options">
                        <div className="filter-choice">
                            <p>{t('Make')}</p>
                            <select onChange={handleSelectChange} value={carMake}>
                                <option value="">{t('Any Make')}</option>
                                {manufacturerList.length > 0 ? (
                                    manufacturerList.map((manufacturer, index) => (
                                        <option key={index} value={manufacturer.id}>{manufacturer.name}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>Loading...</option>
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
                                    <option value="" disabled>Loading...</option>
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
                </aside>

                <section id="car-listings">
                    <div id="sorting">
                        <div className="paging-result">
                            <p>Test</p>
                        </div>
                        <div className="sorting-option">
                            <label htmlFor="sort-by">Sort By: </label>
                            <select id="sort-by">
                                <option value="distance">Distance</option>
                                <option value="value">Value</option>
                                <option value="price">Price</option>
                                {/* ... other sorting options ... */}
                            </select>
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
                                    <a className="carlink" href={`/sales/details/${model.vinId}`}><article className="car-card" key={index}>
                                        <div className="Car-header">
                                            <h3>Used {model.modelId}</h3>
                                            <img src="{model.CarSalesInfo.carImages.imageLink}" alt="Car Image" />

                                        </div>

                                        <div className="used-car-info-container">
                                            <div className="used-car-info">
                                                <h3>Price: {model.carSalesInfo.price}</h3>
                                                <p><strong>Dealer:</strong> {model</p>
                                            </div>
                                            <div className="used-car-info">
                                                <p><strong>Color:</strong> {model.colorName}</p>
                                            </div>

                                            <div className="used-car-info">
                                                <p><strong>Mileage:</strong> {model.currentOdometer}</p>
                                                <p><strong>Body Style:</strong> {model.modelId}</p>

                                            </div>

                                        </div>
                                        <div className="description">
                                            <p><strong>Description:</strong> {model.carSalesInfo.description}</p>
                                        </div>

                                    </article></a>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No cars found</td>
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
