import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetDataProviderByType } from '../../services/api/SearchShop';
import { RootState } from '../../store/State';
import '../../styles/DealerSearch.css';
import { APIResponse, DataProvider, DataProviderSearchForm, Paging, Reviews } from '../../utils/Interfaces';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { GoogleMap, InfoWindow, LoadScript, Marker as GoogleMapMarker } from '@react-google-maps/api';
import { t } from 'i18next';
import i18n from '../../localization/config';
import { Avatar, Pagination} from '@mui/material';
import { GetImages } from '../../services/azure/Images';

function SearchDealer() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carDealerList, setCarDealerList] = useState<DataProvider[]>([]);
    const defaultLocation = { lat: 21.028511, lng: 105.804817 };
    const [currentLocation, setCurrentLocation] = useState(defaultLocation);
    const defaultCenter = { lat: 21.028511, lng: 105.804817 };
    const [page, setPage] = useState(1)
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [dealerType, setDealerType] = useState(0)
    const [dealerName, setDealerName] = useState('')
    const [sortByName, setSortByName] = useState(0)
    const [shouldGeocode, setShouldGeocode] = useState(false);
    const apiKey = "AIzaSyBnnzmm550Bo1McFJZ_MCaQ5IKha6TH8G8"
    
    interface MarkerData {
        position: {
            lat: number;
            lng: number;
        };
        name: string;
        address?: string;
        description?: string;
        id: number;
        imageLink?: string;
        averageRating: number;
    }

    const mapStyles = [
        {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "transit",
            stylers: [{ visibility: "off" }]
        }
    ];

    const [activeMarker, setActiveMarker] = useState<MarkerData | null>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const handleResetFilters = () => {
        setDealerType(0)
        setDealerName('')
        setSortByName(1)
        setResetTrigger(prev => prev + 1);
    }
    const handleSearch = async () => {
        fetchData();
    };

    const mapContainerStyle = {
        height: '1004.6px',
        width: '100%'
    };

    const center = {
        lat: -34.397,
        lng: 150.644,
    };


    const calculateAverageRating = (reviews: Reviews[]) => {
        const totalRating = reviews.reduce((acc, review) => {
            return acc + (typeof review.rating === 'number' ? review.rating : 0); // Ensure rating is a number
        }, 0);
        return reviews.length > 0 ? totalRating / reviews.length : 0;
    };

    const fetchData = async () => {
        // Start loading and clear any previous errors
        setLoading(true);
        setError(null);

        try {
            i18n.changeLanguage(currentLanguage);
            let connectAPIError = t('Cannot connect to API! Please try again later');
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;';
            let searchDealerParams: DataProviderSearchForm = {
                type: 0,
                name: dealerName,
                sortByName: sortByName
            };

            const DataProviderResponse: APIResponse = await GetDataProviderByType(page, connectAPIError, language, searchDealerParams);

            if (DataProviderResponse.error) {
                setError(DataProviderResponse.error);
            } else {
                setCarDealerList(DataProviderResponse.data);
                await geocodeDealerAddresses(DataProviderResponse.data);
            }
        } catch (error) {
            console.error('An error occurred during fetching or geocoding:', error);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const geocodeDealerAddresses = async (dealers: DataProvider[]) => {
        const newMarkers = [];
        for (const dealer of dealers) {
            try {
                if (dealer.address != null) {
                    const location = await geocodeAddress(dealer.address);
                    newMarkers.push({
                        position: location,
                        name: dealer.name,
                        description: dealer.description,
                        id: dealer.id ?? -1,
                        address: dealer.address,
                        imageLink: dealer.imageLink,
                        averageRating: calculateAverageRating(dealer.reviews || [])
                    });
                }
            } catch (error) {
                console.error("Geocoding failed for the address:", dealer.address, error);
            }
        }
        setMarkers(newMarkers);
    };

    const geocodeAddress = async (address: string) => {
        
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "OK") {
            const lat = parseFloat(data.results[0].geometry.location.lat);
            const lng = parseFloat(data.results[0].geometry.location.lng);
            return { lat, lng };
        } else {
            throw new Error(data.error_message || 'Failed to geocode address');
        }
    };

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
        fetchData();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <div className="search-dealer-container">
            <div className="search-header">
                <h1>{t('Find Dealer Near Me')}</h1>
                <p>{t('Search Description')}</p>
            </div>
            <div className="dealer-search-bar">
                <div className="filter-choice">
                    <label>{t('Name')}</label>
                    <input onChange={(e) => setDealerName(e.target.value)} value={dealerName}></input>
                </div>

                <div className="filter-choice">
                    <label>{t('Sort By Name')}</label>
                    <select
                        onChange={(e) => setSortByName(Number(e.target.value))}
                        value={sortByName}
                    >
                        <option value="0">{t('Z-A')}</option>
                        <option value="1">{t('A-Z')}</option>
                    </select>
                </div>
                <button
                    className="search-reg-inspec-btn"
                    onClick={fetchData}
                >
                    {t('Search...')}
                </button>
                <button
                    className="reset-reg-inspec-btn"
                    onClick={handleResetFilters}
                >
                    {t('Reset Filters')}
                </button>
            </div>
            <div className="dealer-map-container">
                <div className="dealer-list">
                    {carDealerList.map((dealer, index) => {
                        const averageRating = calculateAverageRating(dealer.reviews || []);
                        return (
                            <a href={`../sales/dealer/${dealer.id}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="dealer-card">
                                    <div className="profile-image">
                                        <Avatar
                                            alt="Dealer Shop"
                                            src={GetImages(dealer.imageLink)}
                                            sx={{ width: 100, height: 100 }}
                                        />
                                    </div>
                                    <div className="shop-information">
                                        <h2>{dealer.name}</h2>
                                        <div className="star-summary">
                                            <Typography component="legend">
                                                {averageRating ? `${t('Average Rating')}: ${averageRating.toFixed(1)}` : t('No Ratings')}
                                            </Typography>
                                            <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                                        </div>
                                        <div className="dealer-address">{dealer.address}</div>
                                        <button className="phone-button">{t('Phone Number')}: {dealer.phoneNumber}</button>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                    <div id="pagination">
                        {paging && paging.TotalPages > 0 &&
                            <>
                                <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                            </>
                        }
                    </div>
                </div>
                <div className="map-container">
                    <LoadScript googleMapsApiKey={apiKey}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={currentLocation}
                            zoom={14}
                            onClick={() => setActiveMarker(null)}
                            options={{ styles: mapStyles }}
                        >
                            {markers.map((marker, index) => (
                                <GoogleMapMarker
                                    key={index}
                                    position={marker.position}
                                    onClick={() => setActiveMarker(marker)}
                                >
                                    {activeMarker === marker && (
                                        <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                width: '100%'
                                            }}>
                                                <Avatar
                                                    alt="Dealer Shop"
                                                    {...(activeMarker.imageLink && { src: GetImages(activeMarker.imageLink) })}
                                                    sx={{ width: 100, height: 100 }}
                                                />
                                                <Typography component="legend">
                                                    {activeMarker.averageRating ? `${t('Average Rating')}: ${activeMarker.averageRating.toFixed(1)}` : t('No Ratings')}
                                                </Typography>
                                                <Rating name="read-only" value={activeMarker.averageRating} precision={0.1} readOnly />
                                                <div style={{
                                                    width: '80%',
                                                    wordWrap: 'break-word'
                                                }}>
                                                    <h3>{activeMarker.name}</h3>
                                                    <p>{activeMarker.address}</p>
                                                </div>
                                                <a
                                                    href={`../sales/dealer/${activeMarker.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {'View store on the website'}
                                                </a>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMapMarker>
                            ))}
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
        </div>
    );
}

export default SearchDealer;
