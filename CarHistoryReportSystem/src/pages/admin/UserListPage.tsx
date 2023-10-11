import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UserModalAccountPage from '../../components/forms/admin/User/UserModalAccountPage';
import UserModalDetailsPage from '../../components/forms/admin/User/UserModalDetailsPage';
import { Add, Edit, GetDataProviders, List, SuspendUser, UnsuspendUser } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/AdminUsers.css'
import { USER_ROLE } from '../../utils/const/UserRole';
import { APIResponse, DataProvider, User } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidEmail, isValidNumber } from '../../utils/Validators';

function UserListPage() {
    //TODO details is user is data provider
    const [users, setUsers] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [currentId, setCurrentId] = useState<string>("")
    const [newUser, setNewUser] = useState<User>({
        id: '',
        userName: '',
        email: '',
        firstName: '',
        phoneNumber: '',
        lastName: '',
        maxReports: 0,
        role: 1,
        address: ''
    });
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [suspendTab, setSuspendTab] = useState(false);
    const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
    const [isDataProvider, setIsDataProvider] = useState(false)
    const [isNewDataProvider, setNewDataProvider] = useState(false)
    const [providersList, setProvidersList] = useState<DataProvider[] | null>(null)
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    console.log("Token: ", token)
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

    const handleCheckboxToggle = () => {
        setNewDataProvider(!isNewDataProvider)
    }

    const handleNextModalPage = () => {
        if (modalPage < 4) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editingUser) handleEditUser();
            else handleAddUser();
        }
    };

    const handlePreviousModalPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
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
                setModalPage(1);
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
                setModalPage(1);
                fetchData();
            }
        }
    };

    const handleSuspendClick = (user: User) => {
        setError(null);
        setAddError(null)
        setUserToSuspend(user);
        setSuspendTab(true);
    };
    const handleCancel = () => {
        setSuspendTab(false);
        setError(null);
        setAddError(null)
        setUserToSuspend(null);
    };

    const handleConfirmSuspend = async () => {
        // send suspend/unsuspend request here
        let response: APIResponse
        if (userToSuspend) {
            setAdding(true)
            setAddError(null)
            if (userToSuspend.isSuspended) response = await UnsuspendUser(userToSuspend.id, token)
            else response = await SuspendUser(userToSuspend.id, token)
            setAdding(false)
            if (response.error) {
                setAddError(response.error)
            } else {
                setSuspendTab(false);
                setUserToSuspend(null);
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

    const getProviders = async () => {
        if (newUser.role === USER_ROLE.DEALER ||
            newUser.role === USER_ROLE.INSURANCE ||
            newUser.role === USER_ROLE.MANUFACTURER ||
            newUser.role === USER_ROLE.POLICE ||
            newUser.role === USER_ROLE.REGISTRY ||
            newUser.role === USER_ROLE.SERVICE
        ) {
            setIsDataProvider(true)
            if (isNewDataProvider) {
                //temporary
                const response = await GetDataProviders(newUser.role - 2, token)
                if (response.data) setProvidersList(response.data)
                else console.log("Cannot get providers list")
            }
        }
        else setIsDataProvider(false)
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        getProviders()
    }, [newUser.role])
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
                                      {user.isSuspended ? (
                                          <button className="ad-user-unsuspend-btn" onClick={() => handleSuspendClick(user)}>Unsuspend</button>
                                      ) : (
                                          <button className="ad-user-suspend-btn" onClick={() => handleSuspendClick(user)}>Suspend</button>
                                      )}
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
                      <span className="ad-user-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                      <h2>Add User</h2>
                      <UserModalDetailsPage
                          model={newUser}
                          handleInputChange={handleInputChange}
                      />
                      <UserModalAccountPage
                          model={newUser}
                          handleInputChange={handleInputChange}
                          isDataProvider={isDataProvider}
                          handleCheckboxToggle={handleCheckboxToggle}
                          action="Add"
                          isNewDataProvider={isNewDataProvider}
                          providerList={providersList}
                      />
                      { }
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
          {editingUser && (
              <div className="ad-user-modal">
                  <div className="ad-user-modal-content">
                      <span className="ad-user-close-btn" onClick={() => { setEditingUser(null); setModalPage(1) }}>&times;</span>
                      <h2>User Details</h2>
                      <UserModalDetailsPage
                          model={editingUser}
                          handleInputChange={handleInputChange}
                      />
                      <UserModalAccountPage
                          model={editingUser}
                          handleInputChange={handleInputChange}
                          isDataProvider={isDataProvider}
                          handleCheckboxToggle={handleCheckboxToggle}
                          action="Edit"
                          isNewDataProvider={isNewDataProvider}
                          providerList={null}
                      />
                      <button onClick={handleEditUser} disabled={adding} className="ad-user-add-btn">
                          {adding ? (
                              <div className="ad-user-inline-spinner"></div>
                          ) : 'Update'}
                      </button>
                      <button onClick={handlePreviousModalPage} disabled={modalPage === 1} className="ad-user-prev-btn">
                          Previous
                      </button>
                      <button onClick={handleNextModalPage} disabled={adding} className="ad-user-next-btn">
                          {modalPage < 2 ? 'Next' : (adding ? (<div className="ad-user-inline-spinner"></div>) : 'Update')}
                      </button>
                      {addError && (
                          <p className="ad-user-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {suspendTab && (
              <div className="ad-user-modal">
                  <div className="ad-user-modal-content">
                      <h2>Confirmation</h2>
                      <p>Are you sure you want to {(userToSuspend && userToSuspend.isSuspended) ? 'unsuspend' : 'suspend'} user {userToSuspend?.userName} ?</p>
                      {adding ? (
                          <div className="ad-user-inline-spinner"></div>
                      ) : (
                              <>
                                  <button onClick={handleConfirmSuspend} className="ad-user-add-btn">Yes</button>
                                  <button onClick={handleCancel} className="ad-user-add-btn">No</button>
                              </>
                      )}
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