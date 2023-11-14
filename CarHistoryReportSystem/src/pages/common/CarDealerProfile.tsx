import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetCarForSaleBySellerID, GetDealerProfile, ListCarForSale } from '../../services/api/CarForSale';
import { RootState } from '../../store/State';
import '../../styles/CarDealerProfile.css'
import { APIResponse, Car , DataProvider, User } from '../../utils/Interfaces';

function CarDealerProfile() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carList, setCarList] = useState<Car[]>([]);
    const [User, setUser] = useState<User | null>()
    
    const data = useSelector((state: RootState) => state.auth.token)
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    const [overlayWidth, setOverlayWidth] = useState<string>('100%');


    const [editCarSales, setEditCarSales] = useState<DataProvider | null>(null)

    const value = 50;
    const max = 100; 

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const dataProviderResponse: APIResponse = await GetDealerProfile(id as unknown as string, token)
        if (dataProviderResponse.error) {
            setError(dataProviderResponse.error)
        } else {
            setUser(dataProviderResponse.data)
            console.log(dataProviderResponse.data)
        }
        console.log(User?.dataProviderId);

        //Đổi lại trách nhiệm đăng bán xe sang cho car dealer và tìm car for sale theo id của dealer (hiện tại trong database đang là dataproviderID)
        const carListResponse: APIResponse = await GetCarForSaleBySellerID(User?.dataProviderId as unknown as string)
        if (carListResponse.error) {
            setError(carListResponse.error)
        } else {
            setCarList(carListResponse.data)
            console.log(dataProviderResponse.data)
        }

        setLoading(false)
    }

    //const handleEditDealerProfile = async () => {
    //    if (editCarSales != null) {
    //        setAdding(true);
    //        setAddError(null);
    //        const response: APIResponse = await EditCarForSale({
    //            ...editCarSales,
    //            carImages: [
    //                ...(editCarSales.carImages as CarImages[]).filter(image => image.id !== -1),
    //                ...addImages.data
    //            ]
    //        }, token);
    //        console.log("1", editCarSales.carImages)
    //        console.log("2", addImages.data)
    //        setAdding(false);
    //        if (response.error) {
    //            setAddError(response.error);
    //        } else {
    //            setEditCarSales(null)
    //            setModalPage(1)
    //            fetchData();
    //        }
    //    }

    useEffect(() => {
        fetchData();
        const percentage = Math.round((value / max) * 100);
        setOverlayWidth(`${100 - percentage}%`);
    }, [value, max]);

    return (
        <div className="car-dealer-profile">

            <div className="header-section">
                <div className="profile-information">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        Home
                    </div>

                    {/* Dealer Name and Ratings */}
                    <div className="dealer-info">
                        <h1>{User?.userName}</h1>
                        <div className="rating-favoured">
                            <p> num</p>
                            <div className="stars">
                                
                                <svg width="20" height="20" viewBox="0 0 940.688 940.688">
                                    <path d="M885.344,319.071l-258-3.8l-102.7-264.399c-19.8-48.801-88.899-48.801-108.6,0l-102.7,264.399l-258,3.8 c-53.4,3.101-75.1,70.2-33.7,103.9l209.2,181.4l-71.3,247.7c-14,50.899,41.1,92.899,86.5,65.899l224.3-122.7l224.3,122.601 c45.4,27,100.5-15,86.5-65.9l-71.3-247.7l209.2-181.399C960.443,389.172,938.744,322.071,885.344,319.071z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 940.688 940.688">
                                    <path d="M885.344,319.071l-258-3.8l-102.7-264.399c-19.8-48.801-88.899-48.801-108.6,0l-102.7,264.399l-258,3.8 c-53.4,3.101-75.1,70.2-33.7,103.9l209.2,181.4l-71.3,247.7c-14,50.899,41.1,92.899,86.5,65.899l224.3-122.7l224.3,122.601 c45.4,27,100.5-15,86.5-65.9l-71.3-247.7l209.2-181.399C960.443,389.172,938.744,322.071,885.344,319.071z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 940.688 940.688">
                                    <path d="M885.344,319.071l-258-3.8l-102.7-264.399c-19.8-48.801-88.899-48.801-108.6,0l-102.7,264.399l-258,3.8 c-53.4,3.101-75.1,70.2-33.7,103.9l209.2,181.4l-71.3,247.7c-14,50.899,41.1,92.899,86.5,65.899l224.3-122.7l224.3,122.601 c45.4,27,100.5-15,86.5-65.9l-71.3-247.7l209.2-181.399C960.443,389.172,938.744,322.071,885.344,319.071z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 940.688 940.688">
                                    <path d="M885.344,319.071l-258-3.8l-102.7-264.399c-19.8-48.801-88.899-48.801-108.6,0l-102.7,264.399l-258,3.8 c-53.4,3.101-75.1,70.2-33.7,103.9l209.2,181.4l-71.3,247.7c-14,50.899,41.1,92.899,86.5,65.899l224.3-122.7l224.3,122.601 c45.4,27,100.5-15,86.5-65.9l-71.3-247.7l209.2-181.399C960.443,389.172,938.744,322.071,885.344,319.071z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 940.688 940.688">
                                    <path d="M885.344,319.071l-258-3.8l-102.7-264.399c-19.8-48.801-88.899-48.801-108.6,0l-102.7,264.399l-258,3.8 c-53.4,3.101-75.1,70.2-33.7,103.9l209.2,181.4l-71.3,247.7c-14,50.899,41.1,92.899,86.5,65.899l224.3-122.7l224.3,122.601 c45.4,27,100.5-15,86.5-65.9l-71.3-247.7l209.2-181.399C960.443,389.172,938.744,322.071,885.344,319.071z" />
                                </svg>
                                <div className="overlay" style={{ width: overlayWidth }}></div>
                            </div>
                            <span className="favorites">
                                favNum Favourited This Shop
                            </span>
                            <div className="overlay"></div>
                        </div>
                        
                    </div>

                    {/* Contact Info */}
                    <div className="phone-info">
                        <span>Phone Number: {User?.phoneNumber}</span>
                    </div>

                    {/* Navigation */}
                    <div className="navigation">
                        <a href="#cars-for-sale">Car For Sale</a>
                        <a href="#reviews">Reviews</a>
                        <a href="#about-us">About Us</a>
                    </div>
                </div>

                {/* Profile Image (This could be a user or dealer profile) */}
                    <div className="profile-image">
                        {/* Add image here */}
                    </div>
                

                
            </div>
            <div className="cars-for-sale-section">
                <div className="listing-header">
                    <h2>{carList.length} Used Vehicles for Sale at {User?.userName}</h2>
                    <div className="filters">
                        Condition: <span>Used</span> Make & Model: <span>ModelName</span> Price: <span>Price</span> Vehicle History: <span>History</span> <a href="#">Clear All</a>
                    </div>
                </div>
                

                <div className="vehicle-grid">

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
                                <div className="vehicle-card">
                                    <div className="vehicle-image"></div>
                                    <p>Used <span>{model.modelId}</span></p>
                                    <p>Price: <span>{model.carSalesInfo.price}</span></p>
                                    <a href={`/sales/details/${model.vinId}`}>More Detail</a>
                                </div>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No cars found</td>
                        </tr>
                    )}
                        
                </div>
                <div className="pagination">
                    1 - 6 Result on 9 Total Result
                    <div className="page-links">
                        <a href="#">Previous</a>
                        <a href="#">1</a>
                        <a href="#">2</a>
                        <a href="#">3</a>
                        <a href="#">4</a>
                        ...
                        <a href="#">Next</a>
                    </div>
                </div>
            </div>

            <div className="ratings-reviews-section">
                <h1>Ratings & Reviews //Later stage</h1>
                <div className="rating-comment">

                    <div className="rating">
                        <div className="star-summary">
                            <div className="star-rating">
                                <span className="star-count">(Star)</span>
                                <span className="star-icons">★★★★★</span>
                            </div>
                            <div className="star-search">
                                <input type="text" placeholder="Search Reviews" />
                            </div>
                        </div>

                        <div className="star-details">
                            {["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Stars"].map((star, index) => (
                                <div className="star-row" key={index}>
                                    <span className="star-label">{star}</span>
                                    <div className="star-bar">
                                        <div className="star-fill" style={{ width: "85%" }}></div> {/* Modify width based on the percentage */}
                                    </div>
                                    <span className="star-percentage">85%</span> {/* Modify percentage accordingly */}
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="reviews-list">
                        {[1, 2, 3, 4, 5].map((review, index) => (
                            <div className="review-card" key={index}>
                                <div className="review-header">
                                    <span className="review-stars">★★★★★</span>
                                    <span className="review-user">by [Username] on [Date]</span>
                                </div>
                                <p className="review-content">
                                    Lorem ipsum dolor sit amet...
                                </p>
                            </div>
                        ))}
                    </div>

                    

                </div>
                <div className="review-pagination">
                    <button className="pagination-button">Previous</button>
                    {[1, 2, 3, 4, 5].map((page, index) => (
                        <button className="pagination-button" key={index}>{page}</button>
                    ))}
                    <button className="pagination-button">Next</button>
                </div>
                
            </div>


            <div className="about-us-section">

                <div className="about-us-title">
                    <h2>About Us</h2>
                </div>
                
                <div className="about-us-information">
                    <div className="contact-section">
                        <h3>Get In Touch</h3>
                        <div className="sales-information">
                            <h4>Sales Information</h4>
                            <p>New Car Sales: <span>Phonenum</span></p>
                        </div>

                        <div className="operation-hours">
                            <p>Sunday: Closed</p>
                            <p>Monday: Open - Close</p>
                            <p>Tuesday: Open - Close</p>
                            <p>Wednesday: Open - Close</p>
                            <p>Thursday: Open - Close</p>
                            <p>Friday: Open - Close</p>
                            <p>Saturday: Open - Close</p>
                        </div>

                        <p>Location: <span>Address</span></p>
                    </div>

                    {/*<div className="service-information">*/}
                    {/*    <h3>Service Information</h3>*/}
                    {/*    <p>Service: <span>ServiceNum</span></p>*/}
                    {/*    <p>Location: <span>Address</span></p>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export default CarDealerProfile;