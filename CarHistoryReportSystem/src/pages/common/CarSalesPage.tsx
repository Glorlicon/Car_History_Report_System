import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import {ListCarForSale } from '../../services/api/CarForSale';
import { APIResponse, Car, CarModel, Manufacturer } from '../../utils/Interfaces';
import '../../styles/CarForSale.css'

function CarSalesPage() {
    const data = useSelector((state: RootState) => state.auth.token);
    console.log(data);
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [manufacturerList, setManufacturerList] = useState<Manufacturer[]>([]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carListResponse: APIResponse = await ListCarForSale()
        /*const manufacturerReponse: APIReponse = await */
        if (carListResponse.error) {
            setError(carListResponse.error)
        } else {
            setCarList(carListResponse.data)
            console.log(carListResponse.data)
        }
        
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="car-sale">
                <aside id="filters">
                    <div id="search">
                        <input type="text" placeholder="Search" />
                    </div>
                    <button id="clear-filters">Search</button>
                    <div className="clear-filters">
                        <p>Filters</p>
                        <button>Clear Filters</button>
                    </div>
                    <div id="filter-options">
                        <div className="filter-choice">
                            <p>Make</p>
                            <select>
                                <option value="">Any Make</option>
                                {manufacturerList.length > 0 ? (
                                    manufacturerList.map((model, index) => (
                                        <option key={index} value={model.name}>{model.name}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>Loading...</option> // Show while the list is empty
                                )}
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>Model</p>
                            <select>
                                <option value="make-model">Any Model</option>
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>Year</p>
                            <select>
                                <option value="make-model">Any Year</option>
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>Price</p>
                            <select>
                                <option value="make-model">Any Price</option>
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>Milage</p>
                            <select>
                                <option value="make-model">Any Milage</option>
                            </select>
                        </div>
                        <div className="filter-choice">
                            <p>Body Style</p>
                            <select>
                                <option value="make-model">Any Body Style</option>
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
                                                <p><strong>Dealer:</strong> DealerName</p>
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
                        <button id="previous">Previous</button>
                        <span>1 2 3 4 ...</span>
                        <button id="next">Next</button>
                    </div>
                </section>
            </div>
        </>
    );
}

export default CarSalesPage;
