import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import '../../styles/CarSaleDetails.css'

function CarSalesDetailPage() {
    const data = useSelector((state: RootState) => state.auth.token);
    console.log(data);

    return (
        <>
            <div className="car-detail-container">
                <div className="content-wrapper">
                    <div className="car-detail-main">
                        <div className="car-image">
                            {/* Car image placeholder */}
                        </div>
                        <div>
                        </div>
                        <div className="box">
                            <h1>Used (ModelName)</h1>
                            <p>[Price] | [Odometers]</p>
                            <p>VIN: (VinNumber)</p>
                        </div>
                        <div className="box">
                            <h2>Vehicle Highlights</h2>
                            {/* Vehicle details go here */}
                        </div>
                        <div className="box">
                            <h2>Dealer Details</h2>
                            {/* Dealer details go here */}
                        </div>
                    </div>

                    <div className="availability-section">
                        <h2>Check Availability</h2>
                        <p>Phone Number: (PhoneNumber)</p>
                        <div className="interest-message">
                            <p>Hi, I'm interested in this car!</p>
                            <h3>Used (ModelName)</h3>
                            <p>[Price] | [Odometers]</p>
                            <form className="contact-form">
                                <input type="text" placeholder="First Name" />
                                <input type="text" placeholder="Last Name" />
                                <input type="text" placeholder="Zip Code" />
                                <input type="email" placeholder="Email" />
                                <input type="tel" placeholder="Phone Number" />
                                <button type="submit">Send Message</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CarSalesDetailPage;
