import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Add, Edit, List } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/AdminUsers.css'
import { USER_ROLE } from '../../utils/const/UserRole';
import { APIResponse, User } from '../../utils/Interfaces';
import { isValidEmail, isValidNumber } from '../../utils/Validators';

function UserListPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [currentId, setCurrentId] = useState<string>("")
    const [newUser, setNewUser] = useState<User>({
        userName: '',
        email: '',
        firstName: '',
        phoneNumber: '',
        lastName: '',
        maxReports: 0,
        role: 1,
        address: ''
    });
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    //const token = useSelector((state: RootState) => state.auth.token)

    const filteredUsers = users.filter((user: any) => {
        const matchesQuery = user.userName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedRole === 'all' || user.role.toString() === selectedRole;
        return matchesQuery && matchesFilter;
    });

    const validateUser = (user: User): boolean => {
        if (!isValidEmail(user.email)) {
            setAddError("Invalid email address");
            return false;
        }
        if (!isValidNumber(user.phoneNumber)) {
            setAddError("Invalid phone number");
            return false;
        }
        if (!user.email || !user.userName || !user.firstName || !user.lastName || !user.phoneNumber) {
            setAddError("All fields must be filled out");
            return false;
        }
        return true;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editingUser) {
            setEditingUser({
                ...editingUser,
                [e.target.name]: e.target.value
            })
        } else {
            setNewUser({
                ...newUser,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleAddUser = async () => {
        if (validateUser(newUser)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await Add(newUser);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    };

    const handleEditUser = async () => {
        if (!editingUser) return
        if (validateUser(editingUser)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await Edit(currentId, editingUser);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditingUser(null);
                fetchData();
            }
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const response: APIResponse = await List();
        setLoading(false);
        if (response.error) {
            setError(response.error);
        } else {
            setUsers(response.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
  return (
        <div className="ad-user-list-page">
          <div className="ad-user-top-bar">
              <button className="add-ad-account-btn" onClick={() => setShowModal(true)}>+ Add Account</button>
              <div className="ad-user-search-filter-container">
                  <input
                      type="text"
                      className="ad-user-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
                  <select
                      className="ad-user-filter-dropdown"
                      value={selectedRole}
                      onChange={handleFilterChange}
                  >
                      <option value="all">All</option>
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
            </div>
            <table className="ad-user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="ad-user-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                                  <button onClick={fetchData} className="ad-user-retry-btn">Retry</button>
                          </td>
                          </tr>
                      ) : filteredUsers.length > 0 ? (
                          filteredUsers.map((user: any, index: number) => (
                              <tr key={index}>
                              <td onClick={() => { setEditingUser(user); setCurrentId(user.id) }}>{user.id}</td>
                              <td>{user.userName}</td>
                              <td>{user.email}</td>
                              <td>{user.role}</td>
                              <td>
                                  <button className="ad-user-suspend-btn">Suspend</button>
                              </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No users found</td>
                      </tr>
                  )}
                </tbody>
          </table>
          {/*Pop-up add window*/ }
          {showModal && (
              <div className="ad-user-modal">
                  <div className="ad-user-modal-content">
                      <span className="ad-user-close-btn" onClick={() => setShowModal(false)}>&times;</span>
                      <h2>Add User</h2>
                      <div className="ad-user-form-columns">
                          <div className="ad-user-form-column">
                              <label>Email Address</label>
                              <input type="text" name="email" value={newUser.email} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Username</label>
                              <input type="text" name="userName" value={newUser.userName} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
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
                      </div>
                      <div className="ad-user-form-columns">
                          <div className="ad-user-form-column">
                              <label>First Name</label>
                              <input type="text" name="firstName" value={newUser.firstName} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Last Name</label>
                              <input type="text" name="lastName" value={newUser.lastName} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Phone</label>
                              <input type="text" name="phoneNumber" value={newUser.phoneNumber} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Address</label>
                              <input type="text" name="address" value={newUser.address} onChange={handleInputChange} required />
                          </div>
                      </div>
                      <button onClick={handleAddUser} disabled={adding} className="ad-user-add-btn">
                          {adding ? (
                              <div className="ad-user-inline-spinner"></div>
                          ) : 'Add'}
                      </button>
                      {addError && (
                          <p className="ad-user-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {/*{isDataProvider && (*/}

          {/*)}*/}
          {editingUser && (
              <div className="ad-user-modal">
                  <div className="ad-user-modal-content">
                      <span className="ad-user-close-btn" onClick={() => setEditingUser(null)}>&times;</span>
                      <h2>User Details</h2>
                      <div className="ad-user-form-columns">
                          <div className="ad-user-form-column">
                              <label>Email Address</label>
                              <input type="text" name="email" value={editingUser.email} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Username</label>
                              <input type="text" name="userName" value={editingUser.userName} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
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
                          <div className="ad-user-form-column">
                              <label>First Name</label>
                              <input type="text" name="firstName" value={editingUser.firstName} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Last Name</label>
                              <input type="text" name="lastName" value={editingUser.lastName} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Phone</label>
                              <input type="text" name="phoneNumber" value={editingUser.phoneNumber} onChange={handleInputChange} required />
                          </div>
                          <div className="ad-user-form-column">
                              <label>Address</label>
                              <input type="text" name="address" value={editingUser.address} onChange={handleInputChange} required />
                          </div>
                      </div>
                      <button onClick={handleEditUser} disabled={adding} className="ad-user-add-btn">
                          {adding ? (
                              <div className="ad-user-inline-spinner"></div>
                          ) : 'Update'}
                      </button>
                      {addError && (
                          <p className="ad-user-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
        </div>
  );
}

export default UserListPage;