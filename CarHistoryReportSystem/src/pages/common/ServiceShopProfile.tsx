import { Avatar, Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CarDealerProfileImage from '../../components/forms/cardealer/CarDealerProfileImage';
import CarDealerProfilePage from '../../components/forms/cardealer/CarDealerProfilePage';
import i18n from '../../localization/config';
import { AddReview, EditProfile, GetCarForSaleBySellerID, GetCarServiceByDataprovider, GetDataProviderByID, GetDealerProfileData, GetReviewByDataProvider, GetUserById } from '../../services/api/Profile';
import { GetImages } from '../../services/azure/Images';
import { RootState } from '../../store/State';
import '../../styles/CarDealerProfile.css'
import { APIResponse, Car, CarServices, DataProvider, EditDataProvider, editWorkingTime, Reviews } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';

function ServiceShopProfile() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carServicesList, setCarServicesList] = useState<CarServices[]>([]);
    const daysOfWeek = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
    const [comment, setComment] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [review, setReview] = useState<Reviews[]>([]);
    const [ratingValue, setRatingValue] = useState<number | null>(null);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [starCounts, setStarCounts] = useState<{ [key: string]: number }>({ '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 });
    const [allServices, setAllServices] = useState<string[]>([]);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);


    const [userDetails, setUserDetails] = useState({
        id: 0,
        name: '',
        description: '',
        address: '',
        websiteLink: '',
        phoneNumber: '',
        email: '',
        type: 0,
        imageLink: '',
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
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    const [overlayWidth, setOverlayWidth] = useState<string>('100%');
    const value = 50;
    const max = 100;

    // Handler for the rating change
    const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
        setRatingValue(newValue);
        console.log("Rating", newValue);
    };

    // Handler for the comment change
    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const handleSubmitReview = async () => {
        const actualId = id?.replace('id=', '');
        const newReview: Reviews = {
            userId: actualId,
            description: comment,
            rating: ratingValue || 0,
            createdTime: new Date()
        };
        setReview(prevReviews => [...prevReviews, newReview]);
        if (review != null) {
            console.log("Submitted review:", newReview);
            console.log("Target DataProvider", userDetails.id)
            setAdding(true);
            setAddError(null);
            const reviewResponse: APIResponse = await AddReview(userDetails.id, newReview, token);
            setAdding(false);
            if (reviewResponse.error) {
                setAddError(reviewResponse.error);
            } else {
                fetchData()
            }
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const actualIdString = id?.replace('id=', '');
        const actualId = Number(actualIdString);
        const dataProviderResponse: APIResponse = await GetDealerProfileData(actualId as unknown as string);
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

                const carServiceResponse: APIResponse = await GetCarServiceByDataprovider(actualId);
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

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
        fetchData();
    }, []);

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

    }, [value, max, userDetails, defaultSchedule]);



    return (
        <div className="car-dealer-profile">
            <div className="car-dealer-profile-header-section">
                <div className="profile-information">
                    <div className="breadcrumb">
                        Home
                    </div>
                    <div className="dealer-info">
                        <h1>{userDetails?.name}</h1>
                        <div className="rating-favoured">
                            <div className="star-summary">
                                <Typography component="legend">{averageRating ? `Average Rating: ${averageRating.toFixed(1)}` : t('No Ratings')}</Typography>
                                <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                            </div>
                            <span className="favorites">
                            </span>
                            <div className="overlay"></div>
                        </div>

                    </div>
                    <div className="phone-info">
                        <span>{t('Phone Number')}: {userDetails?.phoneNumber}</span>
                    </div>
                    <div className="navigation">
                        <a href="#service-information-section">{t('Top Service Performed')}</a>
                        <a href="#ratings-reviews-section">{t('Reviews')}</a>
                        <a href="#about-us-section">{t('Working Schedule')}</a>
                    </div>
                </div>
                <div>
                    <div className="profile-image">
                        <Tooltip title={t('Click to edit')}>
                            <Avatar
                                alt="Dealer Shop"
                                src={GetImages(userDetails?.imageLink)}
                                sx={{ width: 100, height: 100, cursor: 'pointer' }}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className="service-information-section" id="service-information-section">
                <div className="service-info">
                    <h3>{t('Top Services Performed')}</h3>
                    <p>{t('Based on CHRS Service History')}, <strong>{userDetails?.name}</strong> {t('specializes in these services, in addition to many others:')}</p>
                    <div className="services-list">
                        {allServices.length === 0 ? (
                            <p>{t('No services available')}</p>
                        ) : (
                            allServices.map((service, index) => (
                                <span key={index}>{t(service)}</span>
                            ))
                        )}
                    </div>
                </div>
            </div>


            <div className="ratings-reviews-section" id="ratings-reviews-section">
                <h1>{t('Ratings & Review')}</h1>
                <div className="rating-comment">

                    <div className="rating">
                        <div className="star-summary">
                            <Typography component="legend">{averageRating ? `Average Rating: ${averageRating.toFixed(1)}` : t('No Ratings')}</Typography>
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
                                            <span className="star-label">{star} {t('Stars')}</span>
                                            <div className="star-bar">
                                                <div className="star-fill" style={{ width: `${percentage}%`, backgroundColor: 'green', height: '100%', borderRadius: '5px' }}>
                                                </div>
                                                <div className="star-empty" style={{ width: `${100 - parseFloat(percentage)}%`, backgroundColor: 'lightgrey', height: '100%', borderRadius: '5px' }}>
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
                            <p>{t('No reviews available')}</p>
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


            <div className="about-us-section" id="about-us-section">

                <div className="about-us-title">
                    <h2>{t('Working Schedule')}</h2>
                </div>

                <div className="about-us-section">
                    {/* ... other parts of the section ... */}

                    <div className="operation-hours">
                        {isDefaultSchedule(userDetails.workingTimes) ? (
                            <p>{t('No work schedule present')}</p>
                        ) : (
                            userDetails.workingTimes.map((day, index) => (
                                <p key={index}>
                                    {daysOfWeek[day.dayOfWeek]}:
                                    {day.isClosed ? t('Closed') : `${String(day.startHour).padStart(2, ' 0')}:${String(day.startMinute).padStart(2, '0')} - ${String(day.endHour).padStart(2, '0')}:${String(day.endMinute).padStart(2, '0')}`}
                                </p>
                            ))
                        )}
                    </div>

                    {/* ... other parts of the section ... */}
                </div>
            </div>
        </div>
    );
}

export default ServiceShopProfile;