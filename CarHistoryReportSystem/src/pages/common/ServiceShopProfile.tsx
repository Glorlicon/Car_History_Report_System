import { Alert, Avatar, Box, Button, Pagination, Snackbar, TextField, Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CarDealerProfileImage from '../../components/forms/cardealer/CarDealerProfileImage';
import CarDealerProfilePage from '../../components/forms/cardealer/CarDealerProfilePage';
import { AddReview, EditProfile, editUserReview, GetCarForSaleBySellerID, GetCarServiceByDataprovider, GetDataProviderByID, GetDealerProfileData, GetReviewAllByDataProvider, GetReviewByDataProvider, GetUserById, GetUserComment } from '../../services/api/Profile';
import { GetImages } from '../../services/azure/Images';
import { RootState } from '../../store/State';
import '../../styles/CarDealerProfile.css'
import { APIResponse, Car, CarServices, DataProvider, EditDataProvider, editWorkingTime, Paging, Reviews, ReviewSearchParams } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ServiceShopProfile() {
    const { t, i18n } = useTranslation();
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const LoggedUserID = token ? JWTDecoder(token).nameidentifier : null
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
    const [popUpError, setPopupError] = useState(false);
    const [starCounts, setStarCounts] = useState<{ [key: string]: number }>({ '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 });
    const [allServices, setAllServices] = useState<string[]>([]);
    const [existingReview, setExistingReview] = useState<Reviews>();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [resetReviewTrigger, setResetReviewTrigger] = useState(0);
    const [reviewPaging, setReviewPaging] = useState<Paging>()
    const [reviewPage, setReviewPage] = useState(1)
    const [rating, setRating] = useState(0)
    const [sortByRating, setSortByRating] = useState(0)
    const [sortByDate, setSortByDate] = useState(0)
    const [filteredReview, setFilteredReview] = useState<Reviews[]>([]);

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

    const [open, setOpen] = React.useState(false);
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setPopupError(false);
        setOpen(false);
    };

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

    const handleResetReviewFilters = () => {
        setRating(0)
        setSortByRating(0)
        setSortByDate(0)
        setResetReviewTrigger(prev => prev + 1);
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
            setAdding(true);
            setAddError(null);
            const reviewResponse: APIResponse = await AddReview(userDetails.id, newReview, token);
            setAdding(false);
            if (reviewResponse.error) {
                setPopupError(true);
                setAddError(reviewResponse.error);
            } else {
                setOpen(true);
                fetchData()
                handleCheckUserReview()
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
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
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


            let searchReviewParams: ReviewSearchParams = {
                dataproviderId: dataProviderResponse?.data.id,
                rating: rating,
                sortByRating: sortByRating,
                sortByDate: sortByDate
            }
            const filteredReviewListResponse: APIResponse = await GetReviewByDataProvider(reviewPage, connectAPIError, language, searchReviewParams)
            if (filteredReviewListResponse.error) {
                setError(filteredReviewListResponse.error);
            } else {
                setFilteredReview(filteredReviewListResponse.data);
                setReviewPaging(filteredReviewListResponse.pages)
                const reviewListReponse: APIResponse = await GetReviewAllByDataProvider(connectAPIError, language, dataProviderResponse?.data.id)
                setReview(reviewListReponse.data)
            }
            setLoading(false);
        }
        setLoading(false);
    };

    const getReviews = async () => {
        setLoading(true);
        setAddError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchReviewParams: ReviewSearchParams = {
            dataproviderId: userDetails.id,
            rating: rating,
            sortByRating: sortByRating,
            sortByDate: sortByDate
        }

        const reviewListResponse: APIResponse = await GetReviewByDataProvider(reviewPage, connectAPIError, language, searchReviewParams)
        if (reviewListResponse.error) {
            setAddError(reviewListResponse.error);
        } else {
            setFilteredReview(reviewListResponse.data);
            setReviewPaging(reviewListResponse.pages)
            const reviewListReponse: APIResponse = await GetReviewAllByDataProvider(connectAPIError, language, userDetails.id)
            setReview(reviewListReponse.data)
        }

        setLoading(false);
    }

    useEffect(() => {
        getReviews()
    }, [resetReviewTrigger])
    useEffect(() => {
        getReviews()
    }, [reviewPage])

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

    const handleEditReview = async () => {
        const newReview: Reviews = {
            description: comment,
            rating: ratingValue || 0
        };
        if (review != null) {
            setAdding(true);
            setAddError(null);
            const reviewResponse: APIResponse = await editUserReview(userDetails.id, newReview, token);
            setAdding(false);
            if (reviewResponse.error) {
                setPopupError(true);
                setAddError(reviewResponse.error);
            } else {
                setOpen(true);
                fetchData()
            }
        }
    };

    const handleCheckUserReview = async () => {
        if (LoggedUserID != null) {
            const reviewResponse: APIResponse = await GetUserComment(id as unknown as number, LoggedUserID, token);
            if (!reviewResponse.error && reviewResponse != null) {
                setExistingReview(reviewResponse.data);
                setComment(reviewResponse.data.description)
                setRatingValue(reviewResponse.data.rating)
            }
        }
    };

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
        if (token != null) {
            handleCheckUserReview()
        }
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
                    <div className="dealer-info-2">
                        <h1>{userDetails?.name}</h1>
                        <div className="rating-favoured">
                            <div className="star-summary">
                                <Typography component="legend">
                                    {averageRating ? `${t('Average Rating')}: ${averageRating.toFixed(1)}` : t('No Ratings')}
                                </Typography>
                                <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                            </div>
                            <span className="favorites">
                            </span>
                            <div className="overlay"></div>
                        </div>

                    </div>
                    <div className="phone-info">
                        <PhoneIcon /><span>{t('Phone Number')}: <a href={`tel:${userDetails?.phoneNumber}`}>{userDetails?.phoneNumber}</a></span>
                    </div>
                    <div className="phone-info">
                        <LocationOnIcon /><span>{t('Address')}: <a href={`http://maps.google.com/?q=${userDetails?.address}`}>{userDetails?.address}</a></span>
                    </div>
                    <div className="phone-info">
                        <LanguageIcon /><span>Website: <a href={`https://${userDetails?.websiteLink}`}>{userDetails?.websiteLink}</a></span>
                    </div>
                    <div className="navigation">
                        <a href="#service-information-section">{t('Service Information')}</a>
                        <a href="#ratings-reviews-section">{t('Reviews')}</a>
                        <a href="#about-us-section">{t('Working Schedule')}</a>
                    </div>
                </div>
                <div>
                    <div className="profile-icon">
                        <Avatar
                            alt="Dealer Shop"
                            style={{ border: '1px solid gray' }}
                            src={GetImages(userDetails?.imageLink)}
                            sx={{ width: 200, height: 200, cursor: 'pointer' }}
                        />
                    </div>
                </div>
            </div>

            <div className="service-information-section" id="service-information-section">
                <h3 className="service-information-section-header">{t('Service Information')}</h3>
                <div className="service-info">
                    <h3>{t('Shop Description')}</h3>
                    <p>
                        {userDetails.description}
                    </p>
                </div>
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
                            <Typography component="legend">
                                {averageRating ? `${t('Average Rating')}: ${averageRating.toFixed(1)}` : t('No Ratings')}
                            </Typography>
                            <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                        </div>
                        <div className="star-details">
                            <table>
                                <tbody>
                                    {Object.keys(starCounts)
                                        .sort((a, b) => parseInt(b) - parseInt(a)) // Sort keys in descending order
                                        .map((star, index) => {
                                            const starKey = star as keyof typeof starCounts; // Assert the type of star
                                            const percentage = review.length > 0 ? ((starCounts[starKey] / review.length) * 100).toFixed(2) : "0.00";
                                            return (
                                                <tr className="star-row" key={index}>
                                                    <td><span className="star-label">{star} {t('Stars')}</span></td>
                                                    <td className="star-bar">
                                                        <div className="star-fill" style={{ width: `${percentage}%`, backgroundColor: 'green', height: '100%', borderRadius: '5px' }}>
                                                        </div>
                                                        <div className="star-empty" style={{ width: `${100 - parseFloat(percentage)}%`, backgroundColor: 'lightgrey', height: '100%', borderRadius: '5px' }}>
                                                        </div>
                                                    </td>
                                                    <td><span className="star-percentage">{percentage}%</span></td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div className="reviews-list">
                        <Box className="review-comment-box">
                            {token ? (
                                <>
                                    <Box className="review-rating-box">
                                        <Rating
                                            className="review-rating-selector"
                                            value={existingReview ? existingReview.rating : ratingValue}
                                            onChange={(event, newValue) => {
                                                setRatingValue(newValue);
                                            }}
                                        />
                                    </Box>
                                    <TextField
                                        id="filled-basic"
                                        label={existingReview ? '' : t('Comment')}
                                        variant="filled"
                                        defaultValue={existingReview ? existingReview.description : ''}
                                        onChange={(event) => {
                                            setComment(event.target.value);
                                        }}
                                        multiline
                                        fullWidth
                                    />
                                    <Box className="review-submit-button">
                                        {existingReview ? (
                                            <Button variant="contained" onClick={handleEditReview}>{t('Edit')}</Button>
                                        ) : (
                                            <Button variant="contained" onClick={handleSubmitReview}>{t('Submit')}</Button>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <TextField
                                    id="filled-basic"
                                    label={t('Please log in to submit a review.')}
                                    variant="filled"
                                    multiline
                                    fullWidth
                                    disabled
                                />
                            )}
                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                    {t('Comment Successfully')}
                                </Alert>
                            </Snackbar>

                            {addError && (
                                <Snackbar open={popUpError} autoHideDuration={6000} onClose={() => setPopupError(false)}>
                                    <Alert onClose={(handleClose) => setPopupError(false)} severity="error" sx={{ width: '100%' }}>
                                        {t('Error Adding Comment')}
                                    </Alert>
                                </Snackbar>
                            )}
                        </Box>
                        <div className="filters">
                            <span>
                                <div className="filter-choice">
                                    <label>{t('Stars Number')}</label>
                                    <select onChange={(e) => setRating(Number(e.target.value))} value={rating}>
                                        <option value="0">{t('Any Stars')}</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                            </span>
                            <span>
                                <div className="filter-choice">
                                    <label>{t('Sort By Date')}</label>
                                    <select className="reg-inspec-search-bar"
                                        onChange={(e) => setSortByDate(Number(e.target.value))}
                                        value={sortByDate}
                                    >
                                        <option value="1">{t('Descending')}</option>
                                        <option value="-1">{t('Ascending')}</option>
                                    </select>
                                </div>
                            </span>
                            <button onClick={() => { let x = setReviewPage(1); getReviews(); }} className="car-btn-filter">{t('Search')}</button>
                            <button onClick={handleResetReviewFilters} className="car-btn-filter">{t('Clear Filters')}</button>
                        </div>
                        {filteredReview.length > 0 ? (
                            filteredReview.map((reviewItem, index) => (
                                <div className="review-card" key={index}>
                                    <div className="review-header">
                                        <Rating name="read-only" value={reviewItem.rating} readOnly />
                                        <span className="review-user">
                                            {t('by')} {reviewItem.userFirstName + ' ' + reviewItem.userLastName} {t('on')} {reviewItem.createdTime ? new Date(reviewItem.createdTime).toLocaleDateString() : t('UnknownDate')}
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
                        <div id="pagination">
                            {reviewPaging && reviewPaging.TotalPages > 0 &&
                                <>
                                    <Pagination count={reviewPaging.TotalPages} onChange={(e, value) => setReviewPage(value)} />
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className="about-us-section" id="about-us-section">

                <div className="about-us-title">
                    <h1>{t('Working Schedule')}</h1>
                </div>

                <div className="operation-hours">
                    {isDefaultSchedule(userDetails.workingTimes) ? (
                        <p>{t('No work schedule present')}</p>
                    ) : (
                        <table>
                            <tbody>
                                {
                                    userDetails.workingTimes.map((day, index) => (
                                        <tr key={index}>
                                            <td>{daysOfWeek[day.dayOfWeek]}</td>
                                            <td>{day.isClosed ? t('Closed') : `${String(day.startHour).padStart(2, ' 0')}:${String(day.startMinute).padStart(2, '0')} - ${String(day.endHour).padStart(2, '0')}:${String(day.endMinute).padStart(2, '0')}`}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ServiceShopProfile;