import React, { useEffect, useState } from 'react';
import { List, ListDataProviderTypes } from '../../../services/api/DataProvider';
import { APIResponse } from '../../../utils/Interfaces';

function AdminManufacturerList() {
    const [dataProviders, setDataProviders] = useState([])
    const [manufactureres, setManufacturers] = useState([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);


    const filteredManufacturers = manufactureres.filter((manu: any) => {
        const matchingQuery = manu.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const dataProviderResponse: APIResponse = await ListDataProviderTypes();
        if (dataProviderResponse.error) {
            setError(dataProviderResponse.error);
        } else {
            setDataProviders(dataProviderResponse.data)
            const manufacturerResponse: APIResponse = await List(dataProviders)
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
      <div className="manu-list-page">
          <div className="top-bar">
              <button className="add-manu-btn" onClick={() => setShowModal(true)}>+ Add Manufacturer</button>
              <div className="search-filter-container">
                  <input
                      type="text"
                      className="search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="manu-table">
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
                              <div className="spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditingUser(user); setCurrentId(user.id) }}>{user.id}</td>
                              <td>{user.userName}</td>
                              <td>{user.email}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No users found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {/*Pop-up add window*/}
          {showModal && (
              <div className="modal">
                  <div className="modal-content">
                      <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
                      <h2>Add User</h2>
                      <div className="form-columns">
                          <div className="form-column">
                              <label>Email Address</label>
                              <input type="text" name="email" value={newUser.email} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Username</label>
                              <input type="text" name="userName" value={newUser.userName} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Role: </label>
                              <select name="role" value={newUser.role} onChange={handleInputChange}>
                                  <option value={USER_ROLE.ADMIN}>Admin</option>
                                  <option value={USER_ROLE.USER}>User</option>
                                  <option value={USER_ROLE.DEALER}>Car Dealer</option>
                                  <option value={USER_ROLE.INSURANCE}>Insurance Company</option>
                                  <option value={USER_ROLE.MANUFACTURER}>Manufacturer</option>
                                  <option value={USER_ROLE.POLICE}>Police</option>
                                  <option value={USER_ROLE.REGISTRY}>Vehicle Registry Department</option>
                                  <option value={USER_ROLE.SERVICE}>Service Shop</option>
                              </select>
                          </div>
                          <div className="form-column">
                              <label>First Name</label>
                              <input type="text" name="firstName" value={newUser.firstName} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Last Name</label>
                              <input type="text" name="lastName" value={newUser.lastName} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Phone</label>
                              <input type="text" name="phoneNumber" value={newUser.phoneNumber} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Address</label>
                              <input type="text" name="address" value={newUser.address} onChange={handleInputChange} required />
                          </div>
                      </div>
                      <button onClick={handleAddUser} disabled={adding} className="add-btn">
                          {adding ? (
                              <div className="inline-spinner"></div>
                          ) : 'Add'}
                      </button>
                      {addError && (
                          <p className="error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editingUser && (
              <div className="modal">
                  <div className="modal-content">
                      <span className="close-btn" onClick={() => setEditingUser(null)}>&times;</span>
                      <h2>User Details</h2>
                      <div className="form-columns">
                          <div className="form-column">
                              <label>Email Address</label>
                              <input type="text" name="email" value={editingUser.email} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Username</label>
                              <input type="text" name="userName" value={editingUser.userName} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Role: </label>
                              <select name="role" value={editingUser.role} onChange={handleInputChange} disabled>
                                  <option value={USER_ROLE.ADMIN}>Admin</option>
                                  <option value={USER_ROLE.USER}>User</option>
                                  <option value={USER_ROLE.DEALER}>Car Dealer</option>
                                  <option value={USER_ROLE.INSURANCE}>Insurance Company</option>
                                  <option value={USER_ROLE.MANUFACTURER}>Manufacturer</option>
                                  <option value={USER_ROLE.POLICE}>Police</option>
                                  <option value={USER_ROLE.REGISTRY}>Vehicle Registry Department</option>
                                  <option value={USER_ROLE.SERVICE}>Service Shop</option>
                              </select>
                          </div>
                          <div className="form-column">
                              <label>First Name</label>
                              <input type="text" name="firstName" value={editingUser.firstName} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Last Name</label>
                              <input type="text" name="lastName" value={editingUser.lastName} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Phone</label>
                              <input type="text" name="phoneNumber" value={editingUser.phoneNumber} onChange={handleInputChange} required />
                          </div>
                          <div className="form-column">
                              <label>Address</label>
                              <input type="text" name="address" value={editingUser.address} onChange={handleInputChange} required />
                          </div>
                      </div>
                      <button onClick={handleEditUser} disabled={adding} className="add-btn">
                          {adding ? (
                              <div className="inline-spinner"></div>
                          ) : 'Update'}
                      </button>
                      {addError && (
                          <p className="error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default AdminManufacturerList;