import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetCarForSale, SendContactMail } from '../../services/api/CarForSale';
import { GetImages } from '../../services/azure/Images';
import { RootState } from '../../store/State';
import '../../styles/CarSaleDetails.css'
import { APIResponse, Car, ContactMail } from '../../utils/Interfaces';

function CarSalesDetailPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const data = useSelector((state: RootState) => state.auth.token);
    type RouteParams = {
        id: string
    }
    const { t, i18n } = useTranslation();
    const { id } = useParams<RouteParams>()
    const limitedDisplayCount = 6;
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
            console.log(carSalesResponse)
        }
        
        setLoading(false)
    }

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = () => {
        if (!car || !car.carImages) {
            return
        }
        if (currentImageIndex === 0) {
            setCurrentImageIndex(car.carImages!.length - 1)
        } else {
            setCurrentImageIndex((prev) => (prev - 1))
        }
    };

    const handleNextImage = () => {
        if (!car || !car.carImages) {
            return
        }
        if (currentImageIndex === car.carImages!.length - 1) {
            setCurrentImageIndex(0)
        } else {
            setCurrentImageIndex((prev) => (prev + 1))
        }
    };
    const handleChangeIndex = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1)
        }
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
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="car-detail-container">
                <div className="content-wrapper">
                    <div className="car-detail-main">
                        {/* Car Image Section */}
                        <div className="car-image-section">
                            <div className="box">
                                <div className="car-detail-image">
                                    <button className="dealer-car-sales-images-arrow-left" onClick={handlePrevImage}>&lt;</button>
                                    <img src={
                                        car?.carImages?.at(currentImageIndex)?.id != -1 ?
                                            GetImages(car?.carImages?.at(currentImageIndex)?.imageLink as string) :
                                            car?.carImages?.at(currentImageIndex)?.imageLink
                                    } alt="Car Image" />
                                    <button className="dealer-car-sales-images-arrow-right" onClick={handleNextImage}>&gt;</button>
                                    {/* Image counter */}
                                    <div className="image-count">
                                        {car?.carSalesInfo?.carImages?.length || 0} Photos
                                    </div>
                                </div>
                                <div className="vehicle-info">
                                    <h1>{t('Used')} {car?.modelId}</h1>
                                    <p>{car?.carSalesInfo?.price} VND | {car?.currentOdometer} km</p>
                                    <p>VIN: {car?.vinId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="vehicle-highlights-box">
                            <h2>{t('Vehicle Highlights')}</h2>
                            <div className="box">
                                <div className="highlight-content">
                                    <div className="notable-parts">
                                        <div className="first-section">
                                            <div>
                                                <p>{t('Manufacturer')}</p>
                                                <p>{car?.carSalesInfo?.dataProvider?.name}</p>
                                            </div>
                                            <div>
                                                <p>{t('Dimension')}</p>
                                                <p>{car?.model?.dimension}</p>
                                            </div>
                                            <div>
                                                <p>{t('Wheel Base')}</p>
                                                <p>{car?.model?.wheelBase}</p>
                                            </div>
                                            <div>
                                                <p>{t('Weight')}</p>
                                                <p>{car?.model?.weight}</p>
                                            </div>
                                        </div>
                                        <div className="second-section">
                                            <div>
                                                <p>{t('Released Date')}</p>
                                                <p>{car?.model?.releasedDate}</p>
                                            </div>
                                            <div>
                                                <p>{t('Country Of Origin')}</p>
                                                <p>{car?.model?.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="top-features">
                                    <p className="top-features-header">{t('Top Features')}</p>
                                    <div className="tags-container">
                                        {car?.carSalesInfo?.features.slice(0, isExpanded ? car.carSalesInfo.features.length : limitedDisplayCount).map((feature, index) => (
                                            <div className="tag" key={index}>
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {car && car.carSalesInfo && car.carSalesInfo.features && car.carSalesInfo.features.length > limitedDisplayCount && (
                                        <div className="toggle_btn" onClick={() => setIsExpanded(!isExpanded)}>
                                            <span className="toggle_text">{isExpanded ? 'Show Less' : 'Show More'}</span>
                                            <span className="arrow">
                                                <i className={`fas fa-angle-${isExpanded ? 'up' : 'down'}`}></i>
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="sales-description">
                                    <p className="sales-description-header">{t('Description')}</p>
                                    <div>
                                        <p>
                                            {car?.carSalesInfo?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dealer-details-box">
                            <h2>{t('Dealer Details')}</h2>
                            <div className="box">
                                <a href={`../dealer/${car?.carSalesInfo?.dataProvider?.id}`}>{t('Dealer Profile')}</a>
                            </div>
                        </div>

                    </div>

                    {/* Contact Form Section */}
                    <div className="availability-section narrow-section">
                        <div className="box">
                            <div className="info-header">
                                <p>{t('Check Availability')}</p>
                                <p>Phone Number: {car?.carSalesInfo?.dataProvider?.phoneNumber}</p>
                            </div>

                            <div className="interest-message">
                                <div className="contact-context">
                                    <div className="contact-image">
                                        <img src={GetImages(car?.carImages?.[0]?.imageLink || '')} alt="Car" style={{ width: '75%' }} />
                                    </div>

                                    <div className="contact-description">
                                        <p>{t('Mail Intro')}</p>
                                        <h3>{t('Used')} {car?.modelId}</h3>
                                        <p>{car?.carSalesInfo?.price} VND | {car?.currentOdometer}</p>
                                    </div>
                                </div>

                                <div className="contact-form">
                                    <div className="name-input">
                                        <input onChange={handleInputChange} name="firstName" type="text" placeholder={t('First Name')} />
                                        <input onChange={handleInputChange} name="lastName" type="text" placeholder={t('Last Name')} />
                                    </div>
                                    <div className="info-input">
                                        <input onChange={handleInputChange} name="zipCode" type="text" placeholder={t('Zip Code')} />
                                        <input onChange={handleInputChange} name="phoneNumber" type="tel" placeholder={t('Phone Number')} />
                                    </div>
                                    <div className="email-input">
                                        <input onChange={handleInputChange} name="email" type="email" placeholder={t('Email')} />
                                        <input type="hidden" value={car?.vinId} name="vinId" />
                                    </div>
                                    <div className="button-submit">
                                        <button onClick={handleMessageSend}>{t('Send Message')}</button>
                                    </div>
                                    {addError && <p className="ad-car-error">{addError}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CarSalesDetailPage;
