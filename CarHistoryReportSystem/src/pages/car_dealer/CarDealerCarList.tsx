import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateCarForSale, ListCarDealerCarForSale, SaleCar } from '../../services/api/Car';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarSaleDetails, CarSalesInfo } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/CarDealerCars.css'

function CarDealerCarList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const dealerId = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [newCarSales, setNewCarSales] = useState<CarSalesInfo>({
        carId: '',
        description: '',
        features: [],
        price: 0,
        carImages: [] as any,
        notes: ''
    });
    const [feature, setFeature] = useState<string>('');
    const [images, setImages] = useState<File>();
    const [searchQuery, setSearchQuery] = useState('');
    const [editCarSales, setEditCarSales] = useState<CarSalesInfo|null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const validateCarSales = (carSales: CarSalesInfo): boolean => {
        if (!isValidVIN(carSales.carId as unknown as string)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!carSales.carId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (carSales.price <=0) {
            setAddError("Price must be larger than 0");
            return false;
        }
        return true;
    };
    const [saleDetails, setSaleDetails] = useState<CarSaleDetails|null>();

    const handleAddFeature = () => {
        setNewCarSales({
            ...newCarSales,
            features: [...newCarSales.features, feature],
        });
        setFeature('');
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = [...newCarSales.features];
        newFeatures.splice(index, 1);
        setNewCarSales({
            ...newCarSales,
            features: newFeatures,
        });
    };
    //TODO: add images later
    const handleAddImage = () => {

    }

    const handleRemoveImage = (index: number) => {

    }

    const handleAddCarSales = async () => {
        if (validateCarSales(newCarSales)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await CreateCarForSale(newCarSales, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarSales = async () => {
        if (editCarSales != null && validateCarSales(editCarSales)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await CreateCarForSale(newCarSales, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarSales) {
            setEditCarSales({
                ...editCarSales,
                [e.target.name]: value
            })
        } else {
            setNewCarSales({
                ...newCarSales,
                [e.target.name]: value,
            });
        }
    };

    const handleSoldClick = (id: string) => {
        setSaleDetails({
            carId: id,
            address: '',
            name: '',
            note: '',
            phoneNumber: '',
            startDate: '',
            dob:''
        })
    }
    const handleCarSale = async() => {
        if (saleDetails!=null && validateSaleDetails(saleDetails)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await SaleCar(saleDetails, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setSaleDetails(null);
                fetchData();
            }
        }
    }

    const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (saleDetails)
        setSaleDetails({
            ...saleDetails,
            [e.target.name]: e.target.value
        })
    }

    const validateSaleDetails = (d: CarSaleDetails) => {
        console.log("Sale", d)
        if (!isValidNumber(d.phoneNumber)) {
            setAddError("Customer number is not valid");
            return false;
        }
        if (!d.address || !d.dob || !d.name || !d.note || !d.phoneNumber || !d.startDate) {
            setAddError("Please fill all fields");
            return false;
        }
        return true;
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carSalesListResponse: APIResponse = await ListCarDealerCarForSale(dealerId, token)
        if (carSalesListResponse.error) {
            setError(carSalesListResponse.error)
        } else {
            setCarList(carSalesListResponse.data)
        }
        setLoading(false)
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    useEffect(() => {
        fetchData();
    }, []);
  return (
      <div className="dealer-car-sales-list-page">
          <div className="dealer-car-sales-top-bar">
              <button className="add-dealer-car-sales-btn" onClick={() => setShowModal(true)}>+ Add Car</button>
              <div className="dealer-car-sales-search-filter-container">
                  <input
                      type="text"
                      className="dealer-car-sales-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="dealer-car-sales-table">
              <thead>
                  <tr>
                      <th>VIN</th>
                      <th>Model ID</th>
                      <th>Price</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="dealer-car-sales-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="dealer-car-sales-retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : carList.length > 0 ? (
                      carList.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCarSales({ ...model.carSalesInfo, carId: model.vinId }) }}>{model.vinId}</td>
                              <td>{model.modelId}</td>
                              <td>{model.carSalesInfo.price}</td>
                              <td>
                                  <button className="dealer-car-sales-action-btn" onClick={() => { } }>Details</button>
                                  <button className="dealer-car-sales-action-btn" onClick={() => handleSoldClick(model.vinId) }>Sold</button>
                              </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No cars found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="dealer-car-sales-modal">
                  <div className="dealer-car-sales-modal-content">
                      <span className="dealer-car-sales-close-btn" onClick={() => { setShowModal(false); }}>&times;</span>
                      <h2>Add Car</h2>
                      <h3>DevNote: add images later</h3>
                      <div className="dealer-car-sales-form-columns">
                          <div className="dealer-car-sales-form-column">
                              <label>Description</label>
                              <input type="text" name="description" value={newCarSales.description} onChange={handleInputChange}/>
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>Car VIN id</label>
                              <input type="text" name="carId" value={newCarSales.carId} onChange={handleInputChange} />
                          </div>
                      </div>
                      <div className="dealer-car-sales-form-columns">
                          <div className="ad-car-model-form-column">
                              <label>Notes</label>
                              <input type="text" name="notes" value={newCarSales.notes} onChange={handleInputChange} />
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>Price</label>
                              <input type="number" name="price" value={newCarSales.price} onChange={handleInputChange} min="0" />
                          </div>
                      </div>
                      <div className="dealer-car-sales-form-columns">
                          <div className="dealer-car-sales-form-column">
                              <label>Features: </label>
                              <input type="text" name="feature" value={feature} onChange={e => setFeature(e.target.value)} />
                              <button className="dealer-car-sales-add-feature-btn" type="button" onClick={handleAddFeature}>+Add Feature</button>
                              <ul className="dealer-car-sales-feature-list">
                                  {newCarSales.features.map((f, index) => (
                                      <li key={index} className="dealer-car-sales-feature-list-item">
                                          <span style={{ marginRight: '10px' }}>{f}</span>
                                          <button className="dealer-car-sales-remove-feature-btn" type="button" onClick={() => handleRemoveFeature(index)}>Remove Feature</button>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                      <button onClick={handleAddCarSales} disabled={adding} className="dealer-car-sales-add-btn">
                          {adding ? (<div className="dealer-car-sales-inline-spinner"></div>) : 'Add'}
                      </button>
                      {addError && (
                          <p className="dealer-car-sales-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {saleDetails && (
              <div className="dealer-car-sales-modal">
                  <div className="dealer-car-sales-modal-content">
                      <span className="dealer-car-sales-close-btn" onClick={() => { setSaleDetails(null); }}>&times;</span>
                      <h2>Sale Car {saleDetails.carId}</h2>
                      <div className="dealer-car-sales-form-columns">
                          <div className="dealer-car-sales-form-column">
                              <label>Customer name</label>
                              <input type="text" name="name" value={saleDetails.name} onChange={handleSalesChange} />
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>Phone Number</label>
                              <input type="text" name="phoneNumber" value={saleDetails.phoneNumber} onChange={handleSalesChange} />
                          </div>
                      </div>
                      <div className="dealer-car-sales-form-columns">
                          <div className="ad-car-model-form-column">
                              <label>Address</label>
                              <input type="text" name="address" value={saleDetails.address} onChange={handleSalesChange} />
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>DOB</label>
                              <input type="date" name="dob" value={saleDetails.dob} onChange={handleSalesChange} />
                          </div>
                      </div>
                      <div className="dealer-car-sales-form-columns">
                          <div className="dealer-car-sales-form-column">
                              <label>Start Date</label>
                              <input type="date" name="startDate" value={saleDetails.startDate} onChange={handleSalesChange} />
                          </div>
                          <div className="dealer-car-sales-form-column">
                              <label>Note</label>
                              <input type="text" name="note" value={saleDetails.note} onChange={handleSalesChange} />
                          </div>
                      </div>
                      <button onClick={handleCarSale} disabled={adding} className="dealer-car-sales-add-btn">
                          {adding ? (<div className="dealer-car-sales-inline-spinner"></div>) : 'Confirm Sale'}
                      </button>
                      {addError && (
                          <p className="dealer-car-sales-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default CarDealerCarList;