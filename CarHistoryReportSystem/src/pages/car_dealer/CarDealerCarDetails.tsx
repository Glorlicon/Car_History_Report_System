import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetCar } from '../../services/api/Car';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarImages } from '../../utils/Interfaces';
import '../../styles/CarDealerCarDetails.css'
import { GetImages } from '../../services/azure/Images';

function CarDealerCarDetails() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [car, setCar] = useState<Car|null>()
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carSalesListResponse: APIResponse = await GetCar(id as unknown as string, token)
        if (carSalesListResponse.error) {
            setError(carSalesListResponse.error)
        } else {
            setCar(carSalesListResponse.data)
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
            setCurrentImageIndex((prev) => (prev-1))
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

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="dealer-car-sales-details-page">
            {loading ? (
                <div className="dealer-car-sales-details-spinner"></div>
            ): error ? (
                <div>
                        {error}
                        <button onClick={fetchData} className="dealer-car-sales-details-retry-btn">Retry</button>
                </div>
            ): car && (
                        <div className="dealer-car-sales-details-container">
                            <h1 className="dealer-car-sales-details-header">Car Details</h1>
                            <div className="dealer-car-sales-details-section">
                                <p>
                                    <strong>VIN ID:</strong> {car.vinId}
                                </p>
                                <p>
                                    <strong>License Plate Number:</strong> {car.licensePlateNumber}
                                </p>
                                <p>
                                    <strong>Color:</strong> {car.colorName}
                                </p>
                                <p>
                                    <strong>Current Odometer:</strong> {car.currentOdometer}
                                </p>
                                <p>
                                    <strong>Engine Number:</strong> {car.engineNumber}
                                </p>
                                <p>
                                    <strong>Modified:</strong> {car.isModified ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>CommercialUse:</strong> {car.isCommercialUse ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Model ID:</strong> {car.modelId}
                                </p>
                            </div>

                            <h2 className="dealer-car-sales-details-header">Car Images</h2>
                            <div className="dealer-car-sales-details-images">
                                <button className="dealer-car-sales-details-images-arrow-left" onClick={handlePrevImage}>&lt;</button>
                                <img src={GetImages(car?.carImages?.at(currentImageIndex)?.imageLink as string)} alt="Car" className="dealer-car-sales-details-image" />
                                <button className="dealer-car-sales-details-images-arrow-right" onClick={handleNextImage}>&gt;</button>
                            </div>

                            <h2 className="dealer-car-sales-details-header">Car Sale Details</h2>
                            <div className="dealer-car-sales-details-section">
                                <p>
                                    <strong>Description:</strong> {car.carSalesInfo?.description}
                                </p>
                                <p>
                                    <strong>Price:</strong> {car.carSalesInfo?.price}
                                </p>
                                <p>
                                    <strong>Features:</strong>
                                    {car.carSalesInfo?.features.map((f, index) => (
                                        <li key={index}>
                                            <span style={{ marginRight: '10px' }}>{f}</span>
                                        </li>
                                    ))}
                                </p>
                            </div>
                        </div>   
            )}
        </div>
  );
}

export default CarDealerCarDetails;