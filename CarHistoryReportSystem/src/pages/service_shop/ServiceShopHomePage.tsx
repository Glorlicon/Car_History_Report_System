import { Avatar } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CarDealerProfileImage from '../../components/forms/cardealer/CarDealerProfileImage';
import CarDealerProfilePage from '../../components/forms/cardealer/CarDealerProfilePage';
import { EditProfile, GetCarForSaleBySellerID, GetCarServiceByDataprovider, GetDealerProfileData, GetReviewByDataProvider } from '../../services/api/Profile';
import { GetImages } from '../../services/azure/Images';
import { RootState } from '../../store/State';
import '../../styles/CarDealerProfile.css'
import { APIResponse, Car, CarServices, DataProvider, EditDataProvider, editWorkingTime, Reviews } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';

function ServiceShopHomePage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const dealerId = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carServicesList, setCarServicesList] = useState<CarServices[]>([]);
    const [newImages, setNewImages] = useState<File[]>([])
    const [User, setUser] = useState<DataProvider | null>(null) //EditDataProvider
    const [editDealerProfile, setEditDealerProfile] = useState<EditDataProvider | null>(null)
    const [modalPage, setModalPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [adding, setAdding] = useState(false);
    const [review, setReview] = useState<Reviews[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [starCounts, setStarCounts] = useState<{ [key: string]: number }>({ '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 });
    const [allServices, setAllServices] = useState<string[]>([]);

    //const [showAllMakes, setShowAllMakes] = useState(false);
    //const maxItemsToShow = 15;
    /*const makesList = userDetails.makes; // Replace with actual makes list from userDetails*/
    /*const visibleMakes = showAllMakes ? makesList : makesList.slice(0, maxItemsToShow);*/
    //const [showAllServices, setShowAllServices] = useState(false);
    //const maxServicesToShow = 15;
    //const servicesList = userDetails.services; // Replace with actual services list from userDetails
    //const visibleServices = showAllServices ? servicesList : servicesList.slice(0, maxServicesToShow);


    const [userDetails, setUserDetails] = useState({
        id: 0,
        name: '',
        description: '',
        address: '',
        websiteLink: '',
        phoneNumber: '',
        email: '',
        type: 0,
        imagelink: '',
        workingTimes: Array(7).fill({
            dayOfWeek: 0,
            startHour: 0,
            startMinute: 0,
            endHour: 0,
            endMinute: 0,
            isClosed: true
        })
    });

    interface TransformedWorkingTime {
        dayOfWeek: number;
        startHour: number;
        startMinute: number;
        endHour: number;
        endMinute: number;
        isClosed: boolean;
    }

    interface OriginalWorkingTime {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isClosed: boolean;
    }



    const defaultSchedule = [
        { dayOfWeek: 0, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0, isClosed: false },
        { dayOfWeek: 1, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0, isClosed: false },
        { dayOfWeek: 2, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0, isClosed: false },
        { dayOfWeek: 3, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0, isClosed: false },
        { dayOfWeek: 4, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0, isClosed: false },
        { dayOfWeek: 5, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0, isClosed: false },
        { dayOfWeek: 6, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0, isClosed: false },
    ];

    const isDefaultSchedule = (schedule: editWorkingTime[]) => {
        return schedule.every(day =>
            day.startHour === 0 &&
            day.startMinute === 0 &&
            day.endHour === 0 &&
            day.endMinute === 0 &&
            !day.isClosed
        );
    };

    const [workingTimes, setWorkingTimes] = useState<editWorkingTime[]>(
        userDetails?.workingTimes && userDetails.workingTimes.length > 0 ? userDetails.workingTimes : defaultSchedule
    );




    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editDealerProfile) handleEditDealerProfile();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };
    const [addError, setAddError] = useState<string | null>(null);


    const data = useSelector((state: RootState) => state.auth.token)
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    const [overlayWidth, setOverlayWidth] = useState<string>('100%');


    const [editProfile, setEditProfile] = useState<DataProvider | null>(null)

    const value = 50;
    const max = 100;

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        const dataProviderResponse: APIResponse = await GetDealerProfileData(dealerId as unknown as string);
        if (dataProviderResponse.error) {
            setError(dataProviderResponse.error);
        } else {
            let transformedWorkingTimes: TransformedWorkingTime[] = []; // Typed as an array of TransformedWorkingTime

            if (Array.isArray(dataProviderResponse.data.workingTimes)) {
                transformedWorkingTimes = dataProviderResponse.data.workingTimes.map((time: OriginalWorkingTime) => {
                    const [startHour, startMinute] = time.startTime.split(':').map(Number);
                    const [endHour, endMinute] = time.endTime.split(':').map(Number);

                    return {
                        dayOfWeek: time.dayOfWeek,
                        startHour,
                        startMinute,
                        endHour,
                        endMinute,
                        isClosed: time.isClosed
                    };
                });
            }

            setUserDetails({
                ...dataProviderResponse.data,
                workingTimes: transformedWorkingTimes
            });

            console.log("Transformed Data:", userDetails);

            const carServiceResponse: APIResponse = await GetCarServiceByDataprovider(dealerId);
            if (carServiceResponse.error) {
                setError(carServiceResponse.error);
            } else {
                setCarServicesList(carServiceResponse.data);

                // Define the initial value of the accumulator explicitly as an array of strings
                const initialServices: string[] = [];

                const services = carServiceResponse.data.reduce((acc: string[], item: CarServices) => {
                    if (item.servicesName) {
                        const serviceNames = item.servicesName.split(', ').map(name => name.trim());
                        return acc.concat(serviceNames);
                    }
                    return acc;
                }, []);
                // Remove duplicates
                const uniqueServices = Array.from(new Set<string>(services));
                setAllServices(uniqueServices); // <-- Update the state with the deduplicated services
            }


            const reviewListResponse: APIResponse = await GetReviewByDataProvider(dataProviderResponse?.data.id)
            if (reviewListResponse.error) {
                setError(reviewListResponse.error);
            } else {
                setReview(reviewListResponse.data);
            }

            setLoading(false);
        }



        setLoading(false);
    };

    useEffect(() => {
        let totalRating = 0;
        // Initialize counts with all required keys
        let counts: { [key: string]: number } = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

        review.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                totalRating += review.rating;
                const ratingKey = review.rating.toString();
                // Assert that ratingKey is a key of counts
                if (ratingKey in counts) {
                    counts[ratingKey as keyof typeof counts]++;
                }
            }
        });

        const calculatedAverage = review.length > 0 ? totalRating / review.length : 0;
        setAverageRating(calculatedAverage);
        // Assert that counts matches the expected type for setStarCounts
        setStarCounts(counts as { '1': number, '2': number, '3': number, '4': number, '5': number });
    }, [review]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number, field?: string) => {
        const { name, value, type } = e.target;

        setEditDealerProfile(prevProfile => {
            if (!prevProfile) return null;

            // If the change is related to working times
            if (index !== undefined && field) {
                let updatedTimes = [...prevProfile.workingTimes];

                if (type === 'time') {
                    const [hours, minutes] = value.split(':').map(Number);

                    updatedTimes = updatedTimes.map((time, i) => {
                        if (i === index) {
                            if (field === 'startHour') {
                                return { ...time, startHour: hours, startMinute: minutes };
                            } else if (field === 'endHour') {
                                return { ...time, endHour: hours, endMinute: minutes };
                            }
                        }
                        return time;
                    });
                } else if (type === 'checkbox' && field === 'isClosed') {
                    // Handle isClosed separately
                    updatedTimes = updatedTimes.map((time, i) =>
                        i === index ? { ...time, isClosed: e.target.checked, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 } : time
                    );
                }

                return { ...prevProfile, workingTimes: updatedTimes };
            } else {
                // For changes outside of working times
                return { ...prevProfile, [name]: value };
            }
        });
        console.log("updated user:", editDealerProfile)
    };





    const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const addedImageUrl = URL.createObjectURL(event.target.files[0]); // Create a URL for the file

            setEditDealerProfile(prevProfile => {
                // Ensure prevProfile is not null
                if (!prevProfile) return null;

                return {
                    ...prevProfile,
                    imagelink: addedImageUrl // Update the imagelink directly
                };
            });
        }
    };

    const handleRemoveImage = () => {
        if (editDealerProfile && editDealerProfile.imagelink) {
            setEditDealerProfile(prevProfile => {
                // Ensure prevProfile is not null
                if (!prevProfile) return null;

                return {
                    ...prevProfile,
                    imagelink: "" // Clearing the imagelink
                };
            });
        }
    };


    const handleEditDealerProfile = async () => {
        if (editDealerProfile != null) {
            setAdding(true);
            setAddError(null);

            const response: APIResponse = await EditProfile(editDealerProfile, token);
            console.log("Submitted Data", editDealerProfile);

            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditDealerProfile(null); // Resetting the edit state
                setModalPage(1);
                fetchData(); // Fetching the latest data and updating state
            }
        }
    };


    useEffect(() => {
        fetchData();
    }, [dealerId, token]);

    useEffect(() => {
        const percentage = Math.round((value / max) * 100);
        setOverlayWidth(`${100 - percentage}%`);

        setUserDetails((currentUser) => {
            // Check if currentUser exists and if workingTimes needs to be set
            if (currentUser && (!currentUser.workingTimes || currentUser.workingTimes.length === 0)) {
                const updatedUser = {
                    ...currentUser,
                    workingTimes: defaultSchedule // Set workingTimes directly on currentUser
                };
                setWorkingTimes(defaultSchedule);
                return updatedUser;
            } else if (currentUser?.workingTimes) {
                // If workingTimes already exists, just update the workingTimes state
                setWorkingTimes(currentUser.workingTimes);
            }

            return currentUser; // Return the currentUser as is if no updates are needed
        });

        console.log("User", userDetails);
    }, [value, max, userDetails, defaultSchedule]);



    return (
        <div className="car-dealer-profile">

            <div className="car-dealer-profile-header-section">
                <div className="profile-information">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        Home
                    </div>

                    {/* Dealer Name and Ratings */}
                    <div className="dealer-info">
                        <h1>{userDetails?.name}</h1>
                        <div className="rating-favoured">
                            <div className="star-summary">
                                <Typography component="legend">{averageRating ? `Average Rating: ${averageRating.toFixed(1)}` : 'No Ratings'}</Typography>
                                <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                            </div>
                            <span className="favorites">
                                favNum Favourited This Shop
                            </span>
                            <div className="overlay"></div>
                        </div>

                    </div>

                    {/* Contact Info */}
                    <div className="phone-info">
                        <span>Phone Number: {userDetails?.phoneNumber}</span>
                    </div>

                    {/* Navigation */}
                    <div className="navigation">
                        <a href="#cars-for-sale">Car For Sale</a>
                        <a href="#reviews">Reviews</a>
                        <a href="#about-us">About Us</a>
                    </div>
                </div>

                {/* Profile Image (This could be a user or dealer profile) */}
                <div>
                    <div className="profile-image">
                        <Avatar
                            alt="Service Shop"
                            src={GetImages(userDetails?.imagelink)}
                            sx={{ width: 100, height: 100 }}
                        />
                    </div>
                    <button onClick={() => { setEditDealerProfile({ ...userDetails as EditDataProvider }) }}>Edit</button>
                </div>
            </div>

            <div className="service-information-section">
                <div className="service-info">
                    <h3>Top Services Performed</h3>
                    <p>Based on CHRIS Service History, <strong>{userDetails?.name}</strong> specializes in these services, in addition to many others:</p>
                    <div className="services-list">
                        {allServices.length === 0 ? (
                            <p>No services available</p>
                        ) : (
                            allServices.map((service, index) => (
                                <span key={index}>{service}</span>
                            ))
                        )}
                    </div>
                </div>
                {/*<div className="makes-serviced">*/}
                {/*    <h3>Top Makes Serviced</h3>*/}
                {/*    <p>Based on CHRIS Service History, <strong>{userDetails?.name}</strong> specializes in these Makes, in addition to many others:</p>*/}
                {/*    <div className="makes-list">*/}
                {/*        {visibleMakes.map((make, index) => (*/}
                {/*            <span key={index}>• {make}</span>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*    {makesList.length > maxItemsToShow && (*/}
                {/*        <button onClick={() => setShowAllMakes(!showAllMakes)}>*/}
                {/*            {showAllMakes ? 'Show Less' : 'Show More'}*/}
                {/*        </button>*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>


            <div className="ratings-reviews-section">
                <h1>Ratings & Reviews</h1>
                <div className="rating-comment">

                    <div className="rating">
                        <div className="star-summary">
                            <Typography component="legend">{averageRating ? `Average Rating: ${averageRating.toFixed(1)}` : 'No Ratings'}</Typography>
                            <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                        </div>
                        <div className="star-details">
                            {Object.keys(starCounts)
                                .sort((a, b) => parseInt(b) - parseInt(a)) // Sort keys in descending order
                                .map((star, index) => {
                                    const starKey = star as keyof typeof starCounts; // Assert the type of star
                                    const percentage = review.length > 0 ? ((starCounts[starKey] / review.length) * 100).toFixed(2) : "0.00";
                                    return (
                                        <div className="star-row" key={index}>
                                            <span className="star-label">{star} Stars</span>
                                            <div className="star-bar">
                                                <div className="star-fill" style={{ width: `${percentage}%`, backgroundColor: 'green', height: '100%', borderRadius: '5px' }}>
                                                    {/* The filled portion of the bar */}
                                                </div>
                                                <div className="star-empty" style={{ width: `${100 - parseFloat(percentage)}%`, backgroundColor: 'lightgrey', height: '100%', borderRadius: '5px' }}>
                                                    {/* The empty portion of the bar */}
                                                </div>
                                            </div>
                                            <span className="star-percentage">{percentage}%</span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>


                    <div className="reviews-list">
                        {review.length > 0 ? (
                            review.map((reviewItem, index) => (
                                <div className="review-card" key={index}>
                                    <div className="review-header">
                                        {/* Display the stars based on the rating. This assumes a rating out of 5 */}
                                        <Rating name="read-only" value={reviewItem.rating} readOnly />
                                        {/* You might want to fetch the username using reviewItem.userId */}
                                        <span className="review-user">
                                            by {reviewItem.userId} on {reviewItem.createdTime ? new Date(reviewItem.createdTime).toLocaleDateString() : 'unknown date'}
                                        </span>
                                    </div>
                                    <p className="review-content">
                                        {reviewItem.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available</p>
                        )}
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
                    <h2>Working Schedule</h2>
                </div>

                <div className="about-us-section">
                    {/* ... other parts of the section ... */}

                    <div className="operation-hours">
                        {isDefaultSchedule(userDetails.workingTimes) ? (
                            <p>No work schedule present</p>
                        ) : (
                            userDetails.workingTimes.map((day, index) => (
                                <p key={index}>
                                    {daysOfWeek[day.dayOfWeek]}:
                                    {day.isClosed ? 'Closed' : `${String(day.startHour).padStart(2, '0')}:${String(day.startMinute).padStart(2, '0')} - ${String(day.endHour).padStart(2, '0')}:${String(day.endMinute).padStart(2, '0')}`}
                                </p>
                            ))
                        )}
                    </div>

                    {/* ... other parts of the section ... */}
                </div>
            </div>
            {editDealerProfile && (
                <div className="dealer-car-sales-modal">
                    <div className="dealer-car-sales-modal-content">
                        <span className="dealer-car-sales-close-btn" onClick={() => { setEditDealerProfile(null); setModalPage(1) }}>&times;</span>
                        <h2>Edit Profile</h2>
                        {modalPage === 1 && (
                            <CarDealerProfilePage
                                action="Edit"
                                userDetails={editDealerProfile}
                                handleInputChange={handleInputChange}
                            />
                        )}
                        {modalPage === 2 && (
                            <CarDealerProfileImage
                                model={editDealerProfile}
                                handleAddImages={handleAddImages}
                                handleRemoveImages={handleRemoveImage}
                            />
                        )}
                        {adding ? (<div className="dealer-car-sales-inline-spinner"></div>) : (
                            <>
                                <div>
                                    <button onClick={handlePreviousPage} disabled={modalPage === 1} className="dealer-car-sales-prev-btn">
                                        Previous
                                    </button>
                                    <button onClick={handleNextPage} disabled={adding} className="dealer-car-sales-next-btn">
                                        {modalPage < 2 ? 'Next' : 'Edit'}
                                    </button>
                                </div>
                            </>
                        )}
                        {/*<button onClick={handlePreviousPage} disabled={modalPage === 1} className="dealer-car-sales-prev-btn">*/}
                        {/*    Previous*/}
                        {/*</button>*/}
                        {/*<button onClick={handleNextPage} disabled={adding} className="dealer-car-sales-next-btn">*/}
                        {/*    {modalPage < 2 ? 'Next' : (adding ? (<div className="dealer-car-sales-inline-spinner"></div>) : 'Edit')}*/}
                        {/*</button>*/}
                        {addError && (
                            <p className="dealer-car-sales-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceShopHomePage;