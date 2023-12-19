import { Avatar, Box, Pagination, Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CarDealerProfileImage from '../../components/forms/cardealer/CarDealerProfileImage';
import CarDealerProfilePage from '../../components/forms/cardealer/CarDealerProfilePage';
import { ListManufacturer, ListManufacturerModel } from '../../services/api/CarForSale';
import { EditProfile, GetAllCarForSaleBySellerID, GetCarForSaleBySellerID, GetDealerProfileData, GetReviewAllByDataProvider, GetReviewByDataProvider } from '../../services/api/Profile';
import { GetImages, UploadImages } from '../../services/azure/Images';
import { RootState } from '../../store/State';
import '../../styles/CarDealerProfile.css'
import { APIResponse, Car, CarModel, CarSearchParams, DataProvider, EditDataProvider, editWorkingTime, Manufacturer, Paging, Reviews, ReviewSearchParams } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import i18n from '../../localization/config';
import cardefaultimage from '../../images/car-default.jpg'

function CarDealerShopDetailsPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const dealerId = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carList, setCarList] = useState<Car[]>([]);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [newImages, setNewImages] = useState<File[]>([])
    const [User, setUser] = useState<DataProvider | null>(null) //EditDataProvider
    const [editDealerProfile, setEditDealerProfile] = useState<EditDataProvider | null>(null)
    const [modalPage, setModalPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const daysOfWeek = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [review, setReview] = useState<Reviews[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [starCounts, setStarCounts] = useState<{ [key: string]: number }>({ '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 });
    const [carMake, setCarMake] = useState('')
    const [carModel, setCarModel] = useState('')
    const [yearStart, setYearStart] = useState(0)
    const [priceMax, setPriceMax] = useState(9999999999)
    const [milageMax, setMilageMax] = useState(9999999999)
    const [carPaging, setCarPaging] = useState<Paging>()
    const [reviewPaging, setReviewPaging] = useState<Paging>()
    const [rating, setRating] = useState(0)
    const [sortByRating, setSortByRating] = useState(0)
    const [sortByDate, setSortByDate] = useState(0)
    const [selectedMake, setSelectedMake] = useState(0)
    const [resetCarTrigger, setResetCarTrigger] = useState(0);
    const [resetReviewTrigger, setResetReviewTrigger] = useState(0);
    const [manufacturerList, setManufacturerList] = useState<Manufacturer[]>([]);
    const [carPage, setCarPage] = useState(1)
    const [reviewPage, setReviewPage] = useState(1)
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [filteredReview, setFilteredReview] = useState<Reviews[]>([]);
    const [filteredCarList, setFilteredCarList] = useState<Car[]>([]);
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

    const handleResetCarFilters = () => {
        setCarMake('')
        setCarModel('')
        setYearStart(0)
        setPriceMax(9999999999)
        setMilageMax(9999999999)
        setResetCarTrigger(prev => prev + 1);
    }
    const handleResetReviewFilters = () => {
        setRating(0)
        setSortByRating(0)
        setSortByDate(0)
        setResetReviewTrigger(prev => prev + 1);
    }

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Number(e.target.value);
        setSelectedMake(selectedValue);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const ManufacturerModelResponse: APIResponse = await ListManufacturerModel(connectAPIError, language, selectedValue);

        if (!ManufacturerModelResponse.error) {
            setModelList(ManufacturerModelResponse.data);
        }
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
            let searchCarParams: CarSearchParams = {
                make: carMake,
                model: carModel,
                yearstart: yearStart,
                pricemax: priceMax,
                milagemax: milageMax
            }
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const filteredCarListResponse: APIResponse = await GetCarForSaleBySellerID(dataProviderResponse?.data.id as unknown as string, carPage, connectAPIError, language, searchCarParams);
            if (filteredCarListResponse.error) {
                setError(filteredCarListResponse.error);
            } else {
                const manufacturerReponse: APIResponse = await ListManufacturer();
                setManufacturerList(manufacturerReponse.data)
                setFilteredCarList(filteredCarListResponse.data);
                const CarListResponse: APIResponse = await GetAllCarForSaleBySellerID(dataProviderResponse?.data.id as unknown as string, connectAPIError, language);
                setCarList(CarListResponse.data)
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
                const reviewListReponse: APIResponse = await GetReviewAllByDataProvider(connectAPIError, language, dataProviderResponse?.data.id)
                setReview(reviewListReponse.data)
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
                        i === index ? { ...time, isClosed: e.target.checked, startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 } : time
                    );
                }
                return { ...prevProfile, workingTimes: updatedTimes };
            } else {
                return { ...prevProfile, [name]: value };
            }
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
            const uploadImage = await UploadImages(image, notFoundError, failedError)
            if (uploadImage.error) {
                setError(uploadImage.error)
            } else {
                const response: APIResponse = await EditProfile({ ...editDealerProfile, imageLink: uploadImage.data }, token);
                setAdding(false);
                if (response.error) {
                    setAddError(response.error);
                } else {
                    setEditDealerProfile(null);
                    setModalPage(1);
                    fetchData();
                }
            }
        }
    };


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
                    {/* Breadcrumb */}
                    {/*<div className="breadcrumb">*/}
                    {/*    Home*/}
                    {/*</div>*/}

                    {/* Dealer Name and Ratings */}
                    <div className="dealer-info">
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
                        <span>{t('Phone Number')}: {userDetails?.phoneNumber}</span>
                    </div>

                    {/* Navigation */}
                    <div className="navigation">
                        <a href="#cars-for-sale-section">{t('Car For Sale')}</a>
                        <a href="#ratings-reviews-section">{t('Reviews')}</a>
                        <a href="#about-us-section">{t('Working Schedule')}</a>
                    </div>
                </div>

                {/* Profile Image (This could be a user or dealer profile) */}
                <div>
                    <div className="profile-image" onClick={() => { setEditDealerProfile({ ...userDetails as EditDataProvider }) }}>
                        <Tooltip title={t('Edit')}>
                            <Avatar
                                alt="Dealer Shop"
                                src={GetImages(userDetails?.imageLink)}
                                sx={{ width: 100, height: 100, cursor: 'pointer' }}
                            />
                        </Tooltip>
                    </div>
                </div>




            </div>
            <div className="cars-for-sale-section" id="cars-for-sale-sections">
                <div className="listing-header">
                    <h2>{carList.length} {t('Used Vehicles for Sale at')} {userDetails?.name}</h2>
                    <div className="filters">
                        <button onClick={fetchData} className="car-btn-filter">{t('Search')}</button>

                        <span>
                            <div className="filter-choice">
                                <p>{t('Make')}</p>
                                <select onChange={handleSelectChange} value={selectedMake}>
                                    <option value="">{t('Any Make')}</option>
                                    {manufacturerList.length > 0 ? (
                                        manufacturerList.map((manufacturer, index) => (
                                            <option key={index} value={manufacturer.id}>{manufacturer.name}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Loading...</option>
                                    )}
                                </select>
                            </div>
                        </span>
                        <span>
                            <div className="filter-choice">
                                <p>{t('Min Year')}</p>
                                <select onChange={(e) => setYearStart(Number(e.target.value))} value={yearStart}>
                                    <option value="0">{t('Any Year')}</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                    <option value="2012">2012</option>
                                    <option value="2011">2011</option>
                                    <option value="2010">2010</option>
                                    <option value="2009">2009</option>
                                    <option value="2008">2008</option>
                                    <option value="2007">2007</option>
                                    <option value="2006">2006</option>
                                    <option value="2005">2005</option>
                                    <option value="2004">2004</option>
                                    <option value="2003">2003</option>
                                    <option value="2002">2002</option>
                                    <option value="2001">2001</option>
                                    <option value="2000">2000</option>
                                    <option value="1999">1999</option>
                                    <option value="1998">1998</option>
                                </select>
                            </div>
                        </span>
                        <span>
                            <div className="filter-choice">
                                <p>{t('Max Price')}</p>
                                <select onChange={(e) => setPriceMax(Number(e.target.value))} value={priceMax}>
                                    <option value="9999999999">{t('Any Price')}</option>
                                    <option value="122025000">122.025.000 VND</option>
                                    <option value="244050000">244.050.000 VND</option>
                                    <option value="366075000">366.075.000 VND</option>
                                    <option value="488100000">488.100.000 VND</option>
                                    <option value="610125000">610.125.000 VND</option>
                                    <option value="854175000">854.175.000 VND</option>
                                    <option value="1220250000">1.220.250.000 VND</option>
                                    <option value="1830375000">1.830.375.000 VND</option>
                                </select>
                            </div>
                        </span>
                        <span>
                            <div className="filter-choice">
                                <p>{t('Max Milage')}</p>
                                <select onChange={(e) => setMilageMax(Number(e.target.value))} value={milageMax}>
                                    <option value="9999999999">{t('Any Milage')}</option>
                                </select>
                            </div>
                        </span>
                        <span>
                            <button onClick={handleResetCarFilters} className="car-btn-filter">{t('Clear Filters')}</button>
                        </span>
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
                                <button onClick={fetchData} className="ad-car-retry-btn">{t('Retry')}</button>
                            </td>
                        </tr>
                    ) : filteredCarList.length > 0 ? (
                        carList.map((model: any, index: number) => (
                            <div className="vehicle-card">
                                <div className="vehicle-image">
                                    <Box
                                        component="img"
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                        }}
                                        src={model.carImages && model.carImages.length > 0 ? GetImages(model.carImages[0].imageLink) : cardefaultimage}
                                        alt="Car"
                                    />
                                </div>
                                <p>{t('Used')} <span>{model.modelId}</span></p>
                                <p>{t('Price')}: <span>{model.carSalesInfo.price}</span></p>
                                <a href={`/sales/details/${model.vinId}`}>More Detail</a>
                            </div>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>{t('No cars found')}</td>
                        </tr>
                    )}

                </div>
                <div id="pagination">
                    {carPaging && carPaging.TotalPages > 0 &&
                        <>
                            <Pagination count={carPaging.TotalPages} onChange={(e, value) => setCarPage(value)} />
                        </>
                    }
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
                                    <label>{t('Sort By Rating')}</label>
                                    <select className="reg-inspec-search-bar"
                                        onChange={(e) => setSortByRating(Number(e.target.value))}
                                        value={sortByRating}
                                    >
                                        <option value="0">{t('Descending')}</option>
                                        <option value="1">{t('Ascending')}</option>
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
                                        <option value="0">{t('Descending')}</option>
                                        <option value="1">{t('Ascending')}</option>
                                    </select>
                                </div>
                            </span>
                            <button onClick={fetchData} className="car-btn-filter">{t('Search')}</button>
                            <button onClick={handleResetReviewFilters} className="car-btn-filter">{t('Clear Filters')}</button>
                        </div>
                        {filteredReview.length > 0 ? (
                            filteredReview.map((reviewItem, index) => (
                                <div className="review-card" key={index}>
                                    <div className="review-header">
                                        <Rating name="read-only" value={reviewItem.rating} readOnly />
                                        <span className="review-user">
                                            by {reviewItem.userId} on {reviewItem.createdTime ? new Date(reviewItem.createdTime).toLocaleDateString() : t('UnknownDate')}
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
                <div id="pagination">
                    {reviewPaging && reviewPaging.TotalPages > 0 &&
                        <>
                            <Pagination count={reviewPaging.TotalPages} onChange={(e, value) => setReviewPage(value)} />
                        </>
                    }
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
            {editDealerProfile && (
                <div className="dealer-car-sales-modal">
                    <div className="dealer-car-sales-modal-content-2">
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
                                imageUrl={imageUrl}
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

export default CarDealerShopDetailsPage;