import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchDealerForm from '../../components/forms/common/SearchDealerForm';
import { GetDataProviderByType } from '../../services/api/SearchShop';
import { RootState } from '../../store/State';
import '../../styles/DealerSearch.css';
import { APIResponse, DataProvider, Reviews } from '../../utils/Interfaces';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

function SearchDealer() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carDealerList, setCarDealerList] = useState<DataProvider[]>([]);


    // Example hardcoded data
    const dealers = [
        {
            name: 'Sunshine Motors',
            rating: 4.5,
            reviewCount: 24,
            favoritedCount: 10,
            address: '123 Sunny Road, Sunville',
        },
        //{
        //    name: 'Sunshine Motors',
        //    rating: 4.5,
        //    reviewCount: 24,
        //    favoritedCount: 10,
        //    address: '123 Sunny Road, Sunville',
        //},
        //{
        //    name: 'Sunshine Motors',
        //    rating: 4.5,
        //    reviewCount: 24,
        //    favoritedCount: 10,
        //    address: '123 Sunny Road, Sunville',
        //},
        //{
        //    name: 'Sunshine Motors',
        //    rating: 4.5,
        //    reviewCount: 24,
        //    favoritedCount: 10,
        //    address: '123 Sunny Road, Sunville',
        //}
        // ... more dealers
    ];
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
        const DataProviderResponse: APIResponse = await GetDataProviderByType(0)
        if (DataProviderResponse.error) {
            setError(DataProviderResponse.error);
        } else {
            setCarDealerList(DataProviderResponse.data);
            console.log(DataProviderResponse.data)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className="search-dealer-container">
            <div className="search-header">
                <h1>Find Dealer Near Me</h1>
                <p>CHRIS provides accurate service data with customer reviews to help you find the right service center.</p>
            </div>
            <SearchDealerForm
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
            />
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

                <div className="map-placeholder">
                    {/* Placeholder content for the map */}
                    <div className="map-content">Map will go here</div>
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

export default SearchDealer;
