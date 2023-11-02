import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetCarForSale, SendContactMail } from '../../services/api/CarForSale';
import { RootState } from '../../store/State';
import '../../styles/CarSaleDetails.css'
import { APIResponse, Car, ContactMail, UsersRequest } from '../../utils/Interfaces';

function CarSalesDetailPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const data = useSelector((state: RootState) => state.auth.token);
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    console.log(id)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [addError, setAddError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [car, setCar] = useState<Car | null>()
    const [isExpanded, setIsExpanded] = useState(false);
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carSalesResponse: APIResponse = await GetCarForSale(id as unknown as string)
        if (carSalesResponse.error) {
            console.log("error")
            setError(carSalesResponse.error)
        } else {
            setCar(carSalesResponse.data)
            console.log(carSalesResponse.data)
        }
        
        setLoading(false)
    }

    const handleMessageSend= async () => {
        setAdding(true);
        setAddError(null);
        
        const response: APIResponse = await SendContactMail(newEmail);
        setAdding(false);
        if (response.error) {
            setAddError(response.error);
        } else {
            fetchData();
        }
    }

    const [newEmail, setNewEmail] = useState<ContactMail>({
        firstName: '',
        lastName: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
        vinId: id as string
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setNewEmail({
            ...newEmail,
            [e.target.name]: value,
        });
        console.log(newEmail);
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                            <div className="nameprice">
                                <p>Used {car?.modelId}</p>
                                <p>{car?.carSalesInfo?.price}$ | {car?.currentOdometer}</p>
                            </div>
                            <div>

                            </div>
                            <div className="vin">
                                <p>VIN: {car?.vinId}</p>
                            </div>
                            
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
                                        <div className="tag">
                                            <p>Ambient Lighting</p>
                                        </div>
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
                                    {/*Implement Later*/}
                                    <div className="toggle_btn" onClick={() => setIsExpanded(!isExpanded)}>
                                        <span className="toggle_text">{isExpanded ? 'Show Less' : 'Show More'}</span>
                                        <span className="arrow">
                                            <i className={`fas fa-angle-${isExpanded ? 'up' : 'down'}`}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="sales-description">
                                    <p className="sales-description-header">Sale Description</p>
                                    <div>
                                        <p>
                                            {car?.carSalesInfo?.description}
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
                                    <h3>Used {car?.modelId}</h3>
                                    <p>{car?.carSalesInfo?.price} | {car?.currentOdometer}</p>
                                </div>
                            </div>
                            
                            <div className="contact-form">
                                <div className="name-input">
                                    <input onChange={handleInputChange} name="firstName" type="text" placeholder="First Name" />
                                    <input onChange={handleInputChange} name="lastName" type="text" placeholder="Last Name" />
                                </div>
                                <div className="info-input">
                                    <input onChange={handleInputChange} name="zipCode" type="text" placeholder="Zip Code" />
                                    <input onChange={handleInputChange} name="email" type="email" placeholder="Email" />
                                    <input onChange={handleInputChange} name="phoneNumber" type="tel" placeholder="Phone Number" />
                                    <input type="hidden" value={car?.vinId} name="vinId"></input>
                                </div>
                                <div className="button-submit">
                                    <button onClick={handleMessageSend}>Send Message</button>
                                </div>
                                {addError && (
                                    <p className="ad-car-error">{addError}</p>
                                )}
                                    
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CarSalesDetailPage;
