import react, { useState } from 'react';
import { useSelector } from 'react-redux';
import SearchDealerForm from '../../components/forms/common/SearchDealerForm';
import { RootState } from '../../store/State';
import '../../styles/DealerSearch.css';
import { APIResponse, DataProvider } from '../../utils/Interfaces';

function SearchDealer() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [CarDealerList, setCarDealerList] = useState<DataProvider[]>([]);


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

    //const fetchData = async () => {
    //    setLoading(true);
    //    setError(null);
    //    const reviewListResponse: APIResponse = await GetReviewByDataProvider(dataProviderResponse?.data.id)
    //    if (reviewListResponse.error) {
    //        setError(reviewListResponse.error);
    //    } else {
    //        setReview(reviewListResponse.data);
    //    }
    //    setLoading(false);
    //};

    //useEffect(() => {
    //    fetchData();
    //}, []);

    return (
        <div className="search-dealer-container">
            <div className="search-header">
                <h1>Find Dealer Near Me</h1>
                <p>CHRIS provides accurate service data with customer reviews to help you find the right service center.</p>
                <input type="text" placeholder="Search by City, State" />
                {/* Dropdowns and filters can be added here */}
            </div>
            <SearchDealerForm
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
            />
            <div className="dealer-map-container">
                <div className="dealer-list">
                    {dealers.map((dealer, index) => (
                        <div className="dealer-card" key={index}>
                            <div className="shop-information">
                                <h2>{dealer.name}</h2>
                                <div className="dealer-rating">
                                    {'⭐'.repeat(Math.floor(dealer.rating))}{' '}
                                    {dealer.reviewCount} Users Reviewed
                                </div>
                                <div className="dealer-address">{dealer.address}</div>
                                <button className="phone-button">Phone Number</button>
                            </div>
                        </div>
                    ))}
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
