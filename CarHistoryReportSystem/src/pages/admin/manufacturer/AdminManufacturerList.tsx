import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../../styles/AdminManus.css';
import { AddManufacturer, EditManufacturer, List, ListDataProviderTypes } from '../../../services/api/DataProvider';
import { RootState } from '../../../store/State';
import { APIResponse, Manufacturer, ManufacturerSearchParams, Paging } from '../../../utils/Interfaces';
import { isValidEmail, isValidNumber } from '../../../utils/Validators';
import { JWTDecoder } from '../../../utils/JWTDecoder';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mui/material';

function AdminManufacturerList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [searchName, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
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

    const validateManu = (manu: Manufacturer): boolean => {
        if (manu.email && !isValidEmail(manu.email)) {
            setAddError(t('Invalid email address'));
            return false;
        }
        if (manu.phoneNumber && !isValidNumber(manu.phoneNumber)) {
            setAddError(t('Invalid phone number'));
            return false;
        }
        if (!manu.description || !manu.name || !manu.email || !manu.phoneNumber || !manu.address || !manu.websiteLink) {
            setAddError(t('All fields must be filled out'));
            return false;
        }
        return true;
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
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddManufacturer(dataProviders, newManu, token, connectAPIError, unknownError, language);
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
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditManufacturer(editManu, token, connectAPIError, unknownError, language);
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
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: ManufacturerSearchParams = {
            email: searchEmail,
            name: searchName
        }
        const dataProviderResponse: APIResponse = await ListDataProviderTypes(token, connectAPIError, unknownError, language);
        if (dataProviderResponse.error) {
            setError(dataProviderResponse.error);
        } else {
            setDataProviders(dataProviderResponse.data)
            const manufacturerResponse: APIResponse = await List(token, page, connectAPIError, unknownError, language, searchParams)
            if (manufacturerResponse.error) {
                setError(manufacturerResponse.error)
            } else {
                setManufacturers(manufacturerResponse.data)
                setPaging(manufacturerResponse.pages)
            }
        }
        setLoading(false)
    };
    const handleResetFilters = () => {
        setSearchEmail('')
        setSearchName('')
        setResetTrigger(prev => prev + 1);
    }

    useEffect(() => {
        fetchData();
    }, []);
  return (
      <div className="ad-manu-list-page">
          <div className="ad-manu-top-bar">
              <button className="add-ad-manu-btn" onClick={() => setShowModal(true)}>+ {t('Add Manufacturer')}</button>
          </div>
          <div className="ad-user-top-bar">
              <div className="ad-user-search-filter-container">
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Name')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Name')}
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item">
                      <label>Email</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Email')}
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                      />
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
          </div>
          <table className="ad-manu-table">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>{t('Name')}</th>
                      <th>{t('Description')}</th>
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
                              <button onClick={fetchData} className="ad-manu-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                      ) : manufactureres.length > 0 ? (
                          manufactureres.map((manu: any, index: number) => (
                              <tr key={index}>
                              <td onClick={() => { setEditManu(manu); setCurrentId(manu.id) }}>{manu.id}</td>
                              <td>{manu.name}</td>
                              <td>{manu.description}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>{t('No manufacturers added by admin')}</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {/*Pop-up add window*/}
          {showModal && (
              <div className="ad-manu-modal">
                  <div className="ad-manu-modal-content">
                      <span className="ad-manu-close-btn" onClick={() => {setShowModal(false); setNewManu(emptyManu)}}>&times;</span>
                      <h2>{t('Add Manufacturer')}</h2>
                      <div className="ad-manu-form-columns">
                          <div className="ad-manu-form-column">
                              <label>{t('Name')}</label>
                              <input type="text" name="name" value={newManu.name} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>{t('Description')}</label>
                              <input type="text" name="description" value={newManu.description} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>{t('Address')}</label>
                              <input type="text" name="address" value={newManu.address} onChange={handleInputChange}/>
                          </div>
                      </div>
                      <div className="ad-manu-form-columns">
                          <div className="ad-manu-form-column">
                              <label>{t('Website Link')}</label>
                              <input type="text" name="websiteLink" value={newManu.websiteLink} onChange={handleInputChange}/>
                          </div>
                          <div className="ad-manu-form-column">
                              <label>{t('Phone')}</label>
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
                          ) : t('Finish')}
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
                      <h2>{t('Edit Manufacturer')}</h2>
                      <div className="ad-manu-form-columns">
                          <div className="ad-manu-form-column">
                              <label>ID</label>
                              <input type="text" name="id" value={editManu.id} onChange={handleInputChange} disabled />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>{t('Name')}</label>
                              <input type="text" name="name" value={editManu.name} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>{t('Description')}</label>
                              <input type="text" name="description" value={editManu.description} onChange={handleInputChange} required />
                          </div>
                      </div>
                      <div className="ad-manu-form-columns">
                          <div className="ad-manu-form-column">
                              <label>{t('Address')}</label>
                              <input type="text" name="address" value={editManu.address} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>{t('Website Link')}</label>
                              <input type="text" name="websiteLink" value={editManu.websiteLink} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-manu-form-column">
                              <label>{t('Phone')}</label>
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
                          ) : t('Finish') }
                      </button>
                      {addError && (
                          <p className="ad-manu-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {paging && paging.TotalPages > 0 &&
              <>
                  <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
              </>
          }
      </div>
  );
}

export default AdminManufacturerList;