import { Avatar, Pagination, Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CarDealerProfileImage from '../../components/forms/cardealer/CarDealerProfileImage';
import CarDealerProfilePage from '../../components/forms/cardealer/CarDealerProfilePage';
import i18n from '../../localization/config';
import { EditProfile, GetCarForSaleBySellerID, GetCarServiceByDataprovider, GetDealerProfileData, GetReviewAllByDataProvider, GetReviewByDataProvider } from '../../services/api/Profile';
import { GetImages, UploadImages } from '../../services/azure/Images';
import { RootState } from '../../store/State';
import '../../styles/CarDealerProfile.css'
import { APIResponse, Car, CarServices, DataProvider, EditDataProvider, editWorkingTime, Paging, Reviews, ReviewSearchParams } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function ServiceShopDetailsPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const dealerId = JWTDecoder(token).dataprovider
    const [loading, setLoading] = useState<boolean>(false);
    const [carServicesList, setCarServicesList] = useState<CarServices[]>([]);
    const [editDealerProfile, setEditDealerProfile] = useState<EditDataProvider | null>(null)
    const [modalPage, setModalPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const daysOfWeek = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
    const [adding, setAdding] = useState(false);
    const [review, setReview] = useState<Reviews[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [starCounts, setStarCounts] = useState<{ [key: string]: number }>({ '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 });
    const [allServices, setAllServices] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
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

    const handleResetReviewFilters = () => {
        setRating(0)
        setSortByRating(0)
        setSortByDate(0)
        setReviewPage(1)
        setResetReviewTrigger(prev => prev + 1);
    }

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
        if (editDealerProfile) handleEditDealerProfile();
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };
    const [addError, setAddError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const data = useSelector((state: RootState) => state.auth.token)
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    const [overlayWidth, setOverlayWidth] = useState<string>('100%');


    const [editProfile, setEditProfile] = useState<DataProvider | null>(null)

    const value = 50;
    const max = 100;

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

    const fetchData = async () => {
        setLoading(true);
        setAddError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const dataProviderResponse: APIResponse = await GetDealerProfileData(dealerId as unknown as string);
        if (dataProviderResponse.error) {
            setAddError(dataProviderResponse.error);
        } else {
            if (dataProviderResponse.data.imageLink) {
                const image = GetImages(dataProviderResponse.data.imageLink)
                setImageUrl(image)
            }
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
            const carServiceResponse: APIResponse = await GetCarServiceByDataprovider(dealerId);
            if (carServiceResponse.error) {
                setAddError(carServiceResponse.error);
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

            const reviewListResponse: APIResponse = await GetReviewByDataProvider(reviewPage, connectAPIError, language, searchReviewParams)
            if (reviewListResponse.error) {
                setAddError(reviewListResponse.error);
            } else {
                setFilteredReview(reviewListResponse.data);
                setReviewPaging(reviewListResponse.pages)
                const reviewListReponse: APIResponse = await GetReviewAllByDataProvider(connectAPIError, language, dataProviderResponse?.data.id)
                setReview(reviewListReponse.data)
            }

            setLoading(false);
        }
        setLoading(false);
    };
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



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => {
        const { name, value, type } = e.target;
        setEditDealerProfile(prevProfile => {
            if (!prevProfile) return null;
            if (e.target instanceof HTMLInputElement) {
                const { type, checked } = e.target;

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
                        updatedTimes = updatedTimes.map((time, i) =>
                            i === index ? { ...time, isClosed: checked, } : time
                        );
                    }

                    return { ...prevProfile, workingTimes: updatedTimes };
                }
            }

            // For changes from textarea or other input types
            return { ...prevProfile, [name]: value };
        });
    };





    const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const addedImageUrl = URL.createObjectURL(event.target.files[0]);
            const file = event.target.files[0];
            setImageUrl(addedImageUrl)
            setImage(file)
        }
    };


    const handleEditDealerProfile = async () => {
        if (editDealerProfile != null) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            let notFoundError = t('No image was found')
            let failedError = t('Failed to upload image')
            let uploadedImage = ''
            if (image !== null) {
                const uploadImage = await UploadImages(image, notFoundError, failedError)
                if (uploadImage.error) {
                    setAdding(false)
                    setAddError(uploadImage.error)
                } else {
                    uploadedImage = uploadImage.data
                }
            }
            const response: APIResponse = await EditProfile({ ...editDealerProfile, imageLink: uploadedImage ? uploadedImage : userDetails.imageLink }, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditDealerProfile(null);
                setMessage('Edit Profile Successfully')
                setOpenSuccess(true)
                setModalPage(1);
                fetchData();
            }
        }
    };


    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
        fetchData();
    }, [dealerId, token]);

    useEffect(() => {
        const percentage = Math.round((value / max) * 100);
        setOverlayWidth(`${100 - percentage}%`);

        setUserDetails((currentUser) => {
            if (currentUser && (!currentUser.workingTimes || currentUser.workingTimes.length === 0)) {
                const updatedUser = {
                    ...currentUser,
                    workingTimes: defaultSchedule
                };
                setWorkingTimes(defaultSchedule);
                return updatedUser;
            } else if (currentUser?.workingTimes) {
                setWorkingTimes(currentUser.workingTimes);
            }

            return currentUser;
        });

    }, [value, max, userDetails, defaultSchedule]);
    const [message, setMessage] = useState('')
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openError, setOpenError] = useState(false)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };

    return (
        <div className="car-dealer-profile">
          <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop: '200px' }}>
              <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                  {message}
              </MuiAlert>
          </Snackbar>
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
                    <div className="profile-icon" onClick={() => { setEditDealerProfile({ ...userDetails as EditDataProvider }); setAddError(null) }}>
                        <Tooltip title={t('Click to edit')}>
                            <Avatar
                                alt="Dealer Shop"
                                style={{ border: '1px solid gray' }}
                                src={GetImages(userDetails?.imageLink)}
                                sx={{ width: 200, height: 200, cursor: 'pointer' }}
                            />
                        </Tooltip>
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
            {editDealerProfile && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setEditDealerProfile(null); setModalPage(1);setAddError(null);setError(null) }}>&times;</span>
                        <h2>{t('Edit Profile')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <CarDealerProfileImage
                                model={editDealerProfile}
                                handleAddImages={handleAddImages}
                                imageUrl={imageUrl}
                            />
                            <CarDealerProfilePage
                                action="Edit"
                                userDetails={editDealerProfile}
                                handleInputChange={handleInputChange}
                            />
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            <button onClick={handleNextPage} disabled={adding} className="reg-reg-model-add-btn">
                                {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : t('Finish')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceShopDetailsPage;