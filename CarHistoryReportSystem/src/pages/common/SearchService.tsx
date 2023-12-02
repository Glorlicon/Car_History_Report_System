import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchDealerForm from '../../components/forms/common/SearchDealerForm';
import { GetDataProviderByType } from '../../services/api/SearchShop';
import { RootState } from '../../store/State';
import '../../styles/DealerSearch.css';
import { APIResponse, DataProvider, Reviews } from '../../utils/Interfaces';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function SearchService() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carDealerList, setCarDealerList] = useState<DataProvider[]>([]);
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [currentLocation, setCurrentLocation] = useState({ lat: 21.028511, lng: 105.804817 });
    const defaultCenter = { lat: 21.028511, lng: 105.804817 };

    interface Marker {
        position: {
            lat: number;
            lng: number;
        };
        name: string;
    }


    const mapContainerStyle = {
        width: '800px',
        height: '600px',
    };

    const center = {
        lat: -34.397,
        lng: 150.644,
    };

    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        switch (name) {
            case 'search':
                setSearchTerm(value);
                break;
            case 'sort':
                console.log('Sorting by:', value);
                // Perform sort logic here
                break;
            case 'service':
                console.log('Filtering by service:', value);
                // Perform filtering logic here
                break;
            case 'make':
                console.log('Filtering by make:', value);
                // Perform filtering logic here
                break;
            case 'radius':
                console.log('Filtering by radius:', value);
                // Perform filtering logic here
                break;
            default:
                // Unknown form element
                break;
        }
    };

    // Handler for search button click or form submit
    const handleSearch = () => {
        console.log('Searching for:', searchTerm);
        // Perform search logic here
    };

    const calculateAverageRating = (reviews: Reviews[]) => {
        console.log('Reviews Data:', reviews); // Debug log
        const totalRating = reviews.reduce((acc, review) => {
            console.log('Review Rating:', review.rating); // Debug log to check each rating
            return acc + (typeof review.rating === 'number' ? review.rating : 0); // Ensure rating is a number
        }, 0);
        return reviews.length > 0 ? totalRating / reviews.length : 0;
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const DataProviderResponse: APIResponse = await GetDataProviderByType(2)
        if (DataProviderResponse.error) {
            setError(DataProviderResponse.error);
        } else {
            setCarDealerList(DataProviderResponse.data);
            console.log(DataProviderResponse.data)
        }
        setLoading(false);
    };

    useEffect(() => {
        // Function to fetch data and set current location
        const fetchDataAndSetLocation = async () => {
            await fetchData();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCurrentLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    () => {
                        console.error('Failed to retrieve location');
                    }
                );
            }
        };

        // Function to geocode an address
        const geocodeAddress = async (address: string) => {
            const apiKey = "AIzaSyCRbVNvnE3sge__2-oH3x3xlVqMd-_TPOQ";
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "OK") {
                const { lat, lng } = data.results[0].geometry.location;
                return { lat, lng };
            } else {
                throw new Error(data.status);
            }
        };

        const geocodeDealerAddresses = async () => {
            const newMarkers = [];
            for (const dealer of carDealerList) {
                if (dealer.address) {
                    try {
                        const location = await geocodeAddress(dealer.address);
                        newMarkers.push({
                            position: location,
                            name: dealer.name,
                        });
                    } catch (error) {
                        console.error("Geocoding failed for the address:", dealer.address, error);
                    }
                }
            }
            setMarkers(newMarkers);
        };

        // Call the functions
        fetchDataAndSetLocation();
        if (carDealerList.length > 0) {
            geocodeDealerAddresses();
        }
    }, [carDealerList]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    console.error('Failed to retrieve location');
                }
            );
        }
    }, []);


    return (
        <div className="search-dealer-container">
            <div className="search-header">
                <h1>Find Service Shop Near Me</h1>
                <p>CHRS provides accurate service data with customer reviews to help you find the right service center.</p>
            </div>
            {/*<SearchDealerForm*/}
            {/*    handleInputChange={handleInputChange}*/}
            {/*    handleSearch={handleSearch}*/}
            {/*/>*/}
            <div className="dealer-map-container">
                <div className="dealer-list">
                    {carDealerList.map((dealer, index) => {
                        const averageRating = calculateAverageRating(dealer.reviews || []);
                        console.log('Average Rating:', averageRating); // Debug log
                        return (
                            <a href={`../sales/dealer/${dealer.id}`} key={index}>
                                <div className="dealer-card">
                                    <div className="shop-information">
                                        <h2>{dealer.name}</h2>
                                        <div className="star-summary">
                                            <Typography component="legend">{averageRating ? `Average Rating: ${averageRating.toFixed(1)}` : 'No Ratings'}</Typography>
                                            <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                                        </div>
                                        <div className="dealer-address">{dealer.address}</div>
                                        <button className="phone-button">Phone Number: {dealer.phoneNumber}</button>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
                <div className="map-container">
                    <LoadScript googleMapsApiKey="AIzaSyCRbVNvnE3sge__2-oH3x3xlVqMd-_TPOQ">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            //center={currentLocation}
                            zoom={10}
                        >
                            {markers.map((marker, index) => (
                                <Marker key={index} position={marker.position} title={marker.name} />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
            <div className="pagination">
                <button>Previous</button>
                {/* Example pagination buttons */}
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>Next</button>
            </div>
        </div>
    );
}

export default SearchService;
