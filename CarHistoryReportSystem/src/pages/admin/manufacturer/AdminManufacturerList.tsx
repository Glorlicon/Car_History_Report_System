import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../../styles/AdminManus.css';
import { AddManufacturer, EditManufacturer, List, ListDataProviderTypes } from '../../../services/api/DataProvider';
import { RootState } from '../../../store/State';
import { APIResponse, Manufacturer } from '../../../utils/Interfaces';
import { isValidEmail, isValidNumber } from '../../../utils/Validators';
import { JWTDecoder } from '../../../utils/JWTDecoder';

function AdminManufacturerList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [dataProviders, setDataProviders] = useState<string[]>([])
    const [manufactureres, setManufacturers] = useState([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentId, setCurrentId] = useState<number>()
    const [editManu, setEditManu] = useState<Manufacturer | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const emptyManu: Manufacturer = {
        id: 0,
        name: "",
        description: "",
        address: "",
        email: "",
        phoneNumber: "",
        websiteLink: ""
    }
    const [newManu, setNewManu] = useState<Manufacturer>(emptyManu)

    const filteredManufacturers = manufactureres.filter((manu: any) => {
        const matchingQuery = manu.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })

    const validateManu = (manu: Manufacturer): boolean => {
        if (manu.email && !isValidEmail(manu.email)) {
            setAddError("Invalid email address");
            return false;
        }
        if (manu.phoneNumber && !isValidNumber(manu.phoneNumber)) {
            setAddError("Invalid phone number");
            return false;
        }
        if (!manu.description || !manu.name) {
            setAddError("Name and description must be filled out");
            return false;
        }
        return true;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editManu) {
            setEditManu({
                ...editManu,
                [e.target.name]: e.target.value
            })
        } else {
            setNewManu({
                ...newManu,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleAddManu = async () => {
        if (validateManu(newManu)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await AddManufacturer(dataProviders,newManu,token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setNewManu(emptyManu)
                fetchData();
            }
        }
    };

    const handleEditManu = async () => {
        if (!editManu) return
        if (validateManu(editManu)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await EditManufacturer(editManu, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditManu(null);
                fetchData();
            }
        }
    };

    const fetchData = async () => {
        console.log(JWTDecoder(token))
        setLoading(true);
        setError(null);
        const dataProviderResponse: APIResponse = await ListDataProviderTypes(token);
        if (dataProviderResponse.error) {
            setError(dataProviderResponse.error);
        } else {
            setDataProviders(dataProviderResponse.data)
            const manufacturerResponse: APIResponse = await List(token)
            if (manufacturerResponse.error) {
                setError(manufacturerResponse.error)
            } else {
                setManufacturers(manufacturerResponse.data)
            }
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, []);
  return (
      <div className="ad-manu-list-page">
          <div className="ad-manu-top-bar">
              <button className="add-ad-manu-btn" onClick={() => setShowModal(true)}>+ Add Manufacturer</button>
              <div className="ad-manu-search-filter-container">
                  <input
                      type="text"
                      className="ad-manu-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="ad-manu-table">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="ad-manu-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="ad-manu-retry-btn">Retry</button>
                          </td>
                      </tr>
                      ) : filteredManufacturers.length > 0 ? (
                          filteredManufacturers.map((manu: any, index: number) => (
                              <tr key={index}>
                              <td onClick={() => { setEditManu(manu); setCurrentId(manu.id) }}>{manu.id}</td>
                              <td>{manu.name}</td>
                              <td>{manu.description}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No manufacturers added by admin</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {/*Pop-up add window*/}
          {showModal && (
              <div className="ad-manu-modal">
                  <div className="ad-manu-modal-content">
                      <span className="ad-manu-close-btn" onClick={() => {setShowModal(false); setNewManu(emptyManu)}}>&times;</span>
                      <h2>Add Manufacturer</h2>
                      <div className="ad-manu-form-columns">
                          <div className="ad-manu-form-column">
                              <label>Name</label>
                              <input type="text" name="name" value={newManu.name} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Description</label>
                              <input type="text" name="description" value={newManu.description} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Address</label>
                              <input type="text" name="address" value={newManu.address} onChange={handleInputChange}/>
                          </div>
                      </div>
                      <div className="ad-manu-form-columns">
                          <div className="form-column">
                              <label>Website Link</label>
                              <input type="text" name="websiteLink" value={newManu.websiteLink} onChange={handleInputChange}/>
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Phone</label>
                              <input type="text" name="phoneNumber" value={newManu.phoneNumber} onChange={handleInputChange}/>
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Email</label>
                              <input type="text" name="email" value={newManu.email} onChange={handleInputChange}/>
                          </div>
                      </div>
                      <button onClick={handleAddManu} disabled={adding} className="ad-manu-add-btn">
                          {adding ? (
                              <div className="ad-manu-inline-spinner"></div>
                          ) : 'Add'}
                      </button>
                      {addError && (
                          <p className="ad-manu-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editManu && (
              <div className="ad-manu-modal">
                  <div className="ad-manu-modal-content">
                      <span className="ad-manu-close-btn" onClick={() => setEditManu(null)}>&times;</span>
                      <h2>User Details</h2>
                      <div className="ad-manu-form-columns">
                          <div className="ad-manu-form-column">
                              <label>ID</label>
                              <input type="text" name="id" value={editManu.id} onChange={handleInputChange} disabled />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Name</label>
                              <input type="text" name="name" value={editManu.name} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Description</label>
                              <input type="text" name="description" value={editManu.description} onChange={handleInputChange} required />
                          </div>
                      </div>
                      <div className="ad-manu-form-columns">
                          <div className="ad-manu-form-column">
                              <label>Address</label>
                              <input type="text" name="address" value={editManu.address} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Website Link</label>
                              <input type="text" name="websiteLink" value={editManu.websiteLink} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Phone</label>
                              <input type="text" name="phoneNumber" value={editManu.phoneNumber} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>Email</label>
                              <input type="text" name="email" value={editManu.email} onChange={handleInputChange} required />
                          </div>
                      </div>
                      <button onClick={handleEditManu} disabled={adding} className="ad-manu-add-btn">
                          {adding ? (
                              <div className="ad-manu-inline-spinner"></div>
                          ) : 'Update'}
                      </button>
                      {addError && (
                          <p className="ad-manu-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default AdminManufacturerList;