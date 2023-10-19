import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import '../../styles/CarForSale.css'

function CarSalesPage() {
    const data = useSelector((state: RootState) => state.auth.token);
    console.log(data);

    return (
        <>
            <header>
                <div id="logo">LOGO</div>
                <nav>
                    <a href="#">Home</a>
                    <a href="#">Used Cars</a>
                    {/* ... other navigation links ... */}
                </nav>
                <div id="user-profile">Username <a href="#">Logout</a></div>
            </header>

            <main>
                <aside id="filters">
                    <div id="search">
                        <input type="text" placeholder="Search" />
                    </div>
                    <div id="filter-options">
                        <select>
                            <option value="make-model">Make & Model</option>
                        </select>
                        <select>
                            <option value="year">Year</option>
                        </select>
                        {/* ... other filters ... */}
                    </div>
                    <button id="clear-filters">Clear All</button>
                </aside>

                <section id="car-listings">
                    <div id="sorting">
                        <label htmlFor="sort-by">Sort By: </label>
                        <select id="sort-by">
                            <option value="distance">Distance</option>
                            <option value="distance">Value</option>
                            <option value="distance">Price</option>
                            {/* ... other sorting options ... */}
                        </select>
                    </div>

                    <article className="car-card">
                        <img src="#" alt="Car Image" />
                        <div className="car-details">
                            <h2>ModelName</h2>
                            <p>DealerName</p>
                            <p>Location</p>
                            {/* ... other car attributes ... */}
                            <p>Description</p>
                        </div>
                    </article>
                    <article className="car-card">
                        <img src="#" alt="Car Image" />
                        <div className="car-details">
                            <h2>ModelName</h2>
                            <p>DealerName</p>
                            <p>Location</p>
                            {/* ... other car attributes ... */}
                            <p>Description</p>
                        </div>
                    </article>
                    <article className="car-card">
                        <img src="#" alt="Car Image" />
                        <div className="car-details">
                            <h2>ModelName</h2>
                            <p>DealerName</p>
                            <p>Location</p>
                            {/* ... other car attributes ... */}
                            <p>Description</p>
                        </div>
                    </article>
                    <article className="car-card">
                        <img src="#" alt="Car Image" />
                        <div className="car-details">
                            <h2>ModelName</h2>
                            <p>DealerName</p>
                            <p>Location</p>
                            {/* ... other car attributes ... */}
                            <p>Description</p>
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
