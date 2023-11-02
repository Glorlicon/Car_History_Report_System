import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetCarForSale } from '../../services/api/CarForSale';
import { RootState } from '../../store/State';
import '../../styles/CarSaleDetails.css'
import { APIResponse, Car } from '../../utils/Interfaces';

function CarSalesDetailPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const data = useSelector((state: RootState) => state.auth.token);
    console.log(data);
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [car, setCar] = useState<Car | null>()
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carSalesResponse: APIResponse = await GetCarForSale(id as unknown as string)
        if (carSalesResponse.error) {
            setError(carSalesResponse.error)
        } else {
            setCar(carSalesResponse.data)
        }
        setLoading(false)
    }

    return (
        <>
            <div className="car-detail-container">
                <div className="content-wrapper">
                    <div className="car-detail-main">
                        <div className="car-image">
                            <img src="#" alt="Car Image" />
                        </div>
                        <div>
                        </div>
                        <div className="box">
                            <p>Used (ModelName)</p>
                            <p>[Price] | [Odometers]</p>
                            <p>VIN: (VinNumber)</p>
                        </div>

                        <div className="vehicle-highlights-box">
                            <h2>Vehicle Highlights</h2>
                            <div className="box">
                                <div className="highlight-content">
                                    <div className="notable-parts">
                                        <div className="first-section">
                                                <div>
                                                    <p>Body Style</p>
                                                    <p>body</p>
                                                </div>
                                                <div>
                                                    <p>MPG City/Hwy</p>
                                                    <p>MPG</p>
                                                </div>
                                                <div>
                                                    <p>Drive Type</p>
                                                    <p>DriveType</p>
                                                </div>
                                                <div>
                                                    <p>Transmission</p>
                                                    <p>transmission</p>
                                                </div>
                                        </div>
                                        <div className="second-section">
                                            <div>
                                                <p>Engine</p>
                                                <p>engine</p>
                                            </div>
                                            <div>
                                                <p>Fuel</p>
                                                <p>fuel</p>
                                            </div>
                                            <div>
                                                <p>Interior Color</p>
                                                <p>interiorcolor</p>
                                            </div>
                                            <div>
                                                <p>Body Style</p>
                                                <p>style</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="top-features">
                                    <p className="top-features-header">Top Features</p>
                                    <div className="tags-container">
                                        <div className="tag">
                                            <p>Ambient Lighting</p>
                                        </div>
                                        <div className="tag">
                                            <p>Ambient Lighting</p>
                                        </div>
                                        <div className="tag">
                                            <p>Ambient Lighting</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sales-description">
                                    <p className="sales-description-header">Sale Description</p>
                                    <div>
                                        <p>
                                        Description
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dealer-details-box">
                            <h2>Dealer Details</h2>
                            <div className="box">
                                <p>Test</p>
                            </div>
                        </div>
                        
                    </div>

                    <div className="availability-section">
                        <div className="info-header">
                            <p>Check Availability</p>
                            <p>Phone Number: (PhoneNumber)</p>
                        </div>
                        
                        <div className="interest-message">
                            <div className="contact-context">
                                <div className="contact-image">
                                    <img src="#" alt="Car Image" />
                                </div>

                                <div className="contact-description">
                                    <p>Hi, I'm interested in this car!</p>
                                    <h3>Used (ModelName)</h3>
                                    <p>[Price] | [Odometers]</p>
                                </div>
                            </div>
                            
                            <form className="contact-form">
                                <div className="name-input">
                                    <input type="text" placeholder="First Name" />
                                    <input type="text" placeholder="Last Name" />
                                </div>
                                <div className="info-input">
                                    <input type="text" placeholder="Zip Code" />
                                    <input type="email" placeholder="Email" />
                                    <input type="tel" placeholder="Phone Number" />
                                </div>
                                <div className="button-submit">
                                    <button type="submit">Send Message</button>
                                </div>
                                    
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CarSalesDetailPage;
