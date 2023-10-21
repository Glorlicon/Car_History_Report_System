import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import '../../styles/CarForSale.css'

function CarSalesPage() {
    const data = useSelector((state: RootState) => state.auth.token);
    console.log(data);

    return (
        <>
            <main>
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
                            <p>Make & Model</p>
                            <select>
                                <option value="make-model">Any Make & Model</option>
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
                        {/* ... other filters ... */}
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

                    <article className="car-card">
                        <div className="Car-header">
                            <h3>Used Model Name</h3>
                            <img src="#" alt="Car Image" />
                            
                        </div>

                        <div className="used-car-info-container">
                            <div className="used-car-info">
                                <h3>Price: Price</h3>
                                <p><strong>Dealer:</strong> DealerName</p>
                            </div>
                            <div className="used-car-info">
                                <p><strong>Location:</strong> Location</p>
                                <p><strong>Color:</strong> Color</p>
                                <p><strong>Transmission:</strong> Transmission</p>
                                <p><strong>MPG:</strong> MPG</p>
                            </div>

                            <div className="used-car-info">
                                <p><strong>Mileage:</strong> Mileage</p>
                                <p><strong>Body Style:</strong> BodyStyle</p>
                                <p><strong>Engine:</strong> Engine</p>

                            </div>

                        </div>
                        <div className="description">
                            <p><strong>Description:</strong> Description</p>
                        </div>
                        
                    </article>

                    <article className="car-card">
                        <div className="Car-header">
                            <h3>Used Model Name</h3>
                            <img src="#" alt="Car Image" />

                        </div>

                        <div className="used-car-info-container">
                            <div className="used-car-info">
                                <h3>Price: Price</h3>
                                <p><strong>Dealer:</strong> DealerName</p>
                            </div>
                            <div className="used-car-info">
                                <p><strong>Location:</strong> Location</p>
                                <p><strong>Color:</strong> Color</p>
                                <p><strong>Transmission:</strong> Transmission</p>
                                <p><strong>MPG:</strong> MPG</p>
                            </div>

                            <div className="used-car-info">
                                <p><strong>Mileage:</strong> Mileage</p>
                                <p><strong>Body Style:</strong> BodyStyle</p>
                                <p><strong>Engine:</strong> Engine</p>

                            </div>

                        </div>
                        <div className="description">
                            <p><strong>Description:</strong> Description</p>
                        </div>

                    </article>

                    <article className="car-card">
                        <div className="Car-header">
                            <h3>Used Model Name</h3>
                            <img src="#" alt="Car Image" />

                        </div>

                        <div className="used-car-info-container">
                            <div className="used-car-info">
                                <h3>Price: Price</h3>
                                <p><strong>Dealer:</strong> DealerName</p>
                            </div>
                            <div className="used-car-info">
                                <p><strong>Location:</strong> Location</p>
                                <p><strong>Color:</strong> Color</p>
                                <p><strong>Transmission:</strong> Transmission</p>
                                <p><strong>MPG:</strong> MPG</p>
                            </div>

                            <div className="used-car-info">
                                <p><strong>Mileage:</strong> Mileage</p>
                                <p><strong>Body Style:</strong> BodyStyle</p>
                                <p><strong>Engine:</strong> Engine</p>

                            </div>

                        </div>
                        <div className="description">
                            <p><strong>Description:</strong> Description</p>
                        </div>

                    </article>

                    <article className="car-card">
                        <div className="Car-header">
                            <h3>Used Model Name</h3>
                            <img src="#" alt="Car Image" />

                        </div>

                        <div className="used-car-info-container">
                            <div className="used-car-info">
                                <h3>Price: Price</h3>
                                <p><strong>Dealer:</strong> DealerName</p>
                            </div>
                            <div className="used-car-info">
                                <p><strong>Location:</strong> Location</p>
                                <p><strong>Color:</strong> Color</p>
                                <p><strong>Transmission:</strong> Transmission</p>
                                <p><strong>MPG:</strong> MPG</p>
                            </div>

                            <div className="used-car-info">
                                <p><strong>Mileage:</strong> Mileage</p>
                                <p><strong>Body Style:</strong> BodyStyle</p>
                                <p><strong>Engine:</strong> Engine</p>

                            </div>

                        </div>
                        <div className="description">
                            <p><strong>Description:</strong> Description</p>
                        </div>

                    </article>

                    {/* ... other car cards ... */}

                    <div id="pagination">
                        <button id="previous">Previous</button>
                        <span>1 2 3 4 ...</span>
                        <button id="next">Next</button>
                    </div>
                </section>
            </main>
        </>
    );
}

export default CarSalesPage;
