import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Edit, EditPassword, Get } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/UserProfile.css'
import { APIResponse, PasswordChange, User, UserReport } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import blank from '../../blank.png'
import { GetImages, UploadImages } from '../../services/azure/Images';
import { isValidEmail, isValidPassword } from '../../utils/Validators';
import { useTranslation } from 'react-i18next';
import { GetUserReports } from '../../services/api/Reports';
import UserReportListPage from '../../components/forms/user/UserReportListPage';

function UserProfile() {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).nameidentifier
    const [user, setUser] = useState<User>({
        id: '',
        userName: '',
        email: '',
        firstName: '',
        phoneNumber: '',
        lastName: '',
        maxReportNumber: 0,
        role: 1,
        address: ''
    });
    const [password, setPassword] = useState<PasswordChange>({
        usernameOrEmail: '',
        oldPassword: '',
        password: '',
        rePassword: ''
    });
    const [updatedUser, setUpdatedUser] = useState(user)
    const [updatedPassword, setUpdatedPassword] = useState(password)
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [isEditingPassword, setEditingPassword] = useState(false);
    const [reports, setReports] = useState<UserReport[]>([])
    const [openReports, setOpenReports] = useState(false)
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await Get(id, token, connectAPIError, unknownError, language);
        setLoading(false);
        if (response.error) {
            setError(response.error);
        } else {
            setUser(response.data);
            const getUserReports: APIResponse = await GetUserReports(id, token, connectAPIError, language)
            if (getUserReports.error) {
                setError(getUserReports.error)
            } else {
                setReports(getUserReports.data)
                if (response.data.avatarImageLink) {
                    const image = GetImages(response.data.avatarImageLink)
                    setImageUrl(image)
                }
            }
        }
    };

    const validateUser = (user: User): boolean => {
        if (!isValidEmail(user.email)) {
            setError(t('Invalid email address'));
            return false;
        }
        if (!user.email || !user.userName || !user.firstName || !user.lastName) {
            setError(t('All fields must be filled out'));
            return false;
        }
        return true;
    };

    const validatePassword = (password: PasswordChange): boolean => {
        if (!password.password || !password.rePassword || !password.oldPassword) {
            setError(t('All fields must be filled out'));
            return false;
        } else if (!(password.password === password.rePassword)) {
            setError(t('Password does not match'))
            return false;
        } else if (!isValidPassword(password.password)) {
            setError(t('Password is not valid'))
            return false;
        }
        return true;
    };

    const handleEditButton = () => {
        setEditing(true)
        setUpdatedUser(user)
    }

    const handlePasswordChangeButton = () => {
        setEditingPassword(true)
        setUpdatedUser(user)
    }

    const handleEditPasswordButton = async () => {
        if (validatePassword(updatedPassword)) {
            setUpdating(true)
            setError(null)
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response = await EditPassword(updatedPassword, token, connectAPIError, unknownError, language)
            if (response.error) {
                setUpdating(false)
                setError(response.error)
            } else {
                setUpdating(false)
                setEditingPassword(false)
                fetchData()
            }
        }
    }

    const handleUpdateButton = async () => {
        if (validateUser(user)) {
            setUpdating(true)
            setError(null)
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            let notFoundError = t('No image was found')
            let failedError = t('Failed to upload image')
            const uploadImage = await UploadImages(image, notFoundError, failedError)
            if (uploadImage.error) {
                setUpdating(false)
                setError(uploadImage.error)
            } else {
                const response = await Edit(id, { ...updatedUser, avatarImageLink: uploadImage.data }, token, connectAPIError, unknownError, language)
                if (response.error) {
                    setUpdating(false)
                    setError(response.error)
                } else {
                    setUpdating(false)
                    setEditing(false)
                    fetchData()
                }
            }
        }
    }
    const handleCancelButton = () => {
        if (isEditing) {
            setEditing(false)
        } else if (isEditingPassword) {
            setEditingPassword(false)
        }
        setUpdatedUser(user)
    }
    const handleUpdateUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUser({
            ...updatedUser,
            [e.target.name]: e.target.value
        })
    }
    const handleUpdatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedPassword({
            ...updatedPassword,
            [e.target.name]: e.target.value,
            usernameOrEmail: user.email

        })
    }
    const handleShowReports = () => {
        setOpenReports(true)
    }

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file)
            // Create an object URL to display the image in the component
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setUpdatedUser({
                ...updatedUser
            })
        }
    }

    const handleImageClick = () => {
        document.getElementById('profile-picture')?.click()
    }

    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <div className="profile-container-2">
            {loading ? (
                <div className="profile-spinner"></div>
            ) : (
                <>
                    {isEditing ? (
                        <>
                            <div className="header-edit-section">
                                <div className="profile-edit-icon">
                                    <input type="file" id="profile-picture" accept="image/*" className="profile-edit-picture" onChange={onImageChange} />
                                    <img src={imageUrl ? imageUrl : blank} id="picture" alt="Click to change" title="Click to change" className="edit-picture" onClick={handleImageClick} />
                                </div>
                                <p>{user.userName}</p>
                            </div>
                            <div className="edit-sections">
                                <div className="info-edit-section">
                                    <div className="edit-columns">
                                        <div className="info-edit-column">
                                            <label>Email</label>
                                            <input className="profile-edit-input" type="text" value={updatedUser.email} name="email" onChange={handleUpdateUser} />
                                            <label>{t('First Name')}</label>
                                            <input className="profile-edit-input" type="text" value={updatedUser.firstName} name="firstName" onChange={handleUpdateUser} />
                                        </div>
                                        <div className="info-edit-column">
                                            <label>{t('Address')}</label>
                                            <input className="profile-edit-input" type="text" value={updatedUser.address} name="address" onChange={handleUpdateUser} />
                                            <label>{t('Last Name')}</label>
                                            <input className="profile-edit-input" type="text" value={updatedUser.lastName} name="lastName" onChange={handleUpdateUser} />
                                        </div>
                                    </div>
                                    <div className="buttons-edit-section">
                                        {updating ? (
                                            <div className="profile-spinner"></div>
                                        ) : (
                                            <>
                                                <button className="profile-edit-btn" onClick={handleCancelButton}>{t('Cancel')}</button>
                                                <button className="profile-edit-btn" onClick={handleUpdateButton}>{t('Save Changes')}</button>
                                            </>
                                        )}
                                    </div>
                                    {error && (
                                        <p className="profile-error">{error}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : isEditingPassword ? (
                        <>
                            <div className="header-edit-section">
                                <div className="profile-edit-icon">
                                    <input type="file" id="profile-picture" accept="image/*" className="profile-edit-picture" onChange={onImageChange} />
                                    <img src={imageUrl ? imageUrl : blank} id="picture" alt="Click to change" title="Click to change" className="edit-picture" onClick={handleImageClick} />
                                </div>
                                <p>{user.userName}</p>
                            </div>
                            <div className="edit-sections">
                                <div className="info-edit-section">
                                    <div className="edit-columns">
                                        <div className="info-edit-column">
                                            <label>{t('Old password')}</label>
                                            <input className="profile-edit-input" type="password" name="oldPassword" onChange={handleUpdatePassword} />
                                        </div>
                                        <div className="info-edit-column">
                                            <label>{t('New password')}</label>
                                            <input className="profile-edit-input" type="password" name="password" onChange={handleUpdatePassword} />
                                            <label>{t('Re-enter new password')}</label>
                                            <input className="profile-edit-input" type="password" name="rePassword" onChange={handleUpdatePassword} />
                                        </div>
                                    </div>
                                    <div className="buttons-edit-section">
                                        {updating ? (
                                            <div className="profile-spinner"></div>
                                        ) : (
                                            <>
                                                <button className="profile-edit-btn" onClick={handleCancelButton}>{t('Cancel')}</button>
                                                <button className="profile-edit-btn" onClick={handleEditPasswordButton}>{t('Save Changes')}</button>
                                            </>
                                        )}
                                    </div>
                                    {error && (
                                        <p className="profile-error">{error}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="header-section">
                                <div className="profile-icon">
                                    <img src={imageUrl ? imageUrl : blank} alt="Click to change" title="Click to change" className="picture" />
                                </div>
                                <p>{user.userName}</p>
                            </div>
                            <div className="sections">
                                <div className="info-section">
                                    <div className="columns">
                                        <div className="info-column">
                                            <a className="info">Email: {user.email}</a>
                                            <a className="info">{t('First Name')}: {user.firstName}</a>
                                            <a className="info">{t('Address')}: {user.address}</a>
                                            <a className="info">{t('Last Name')}: {user.lastName}</a>
                                        </div>
                                    </div>
                                    <button className="profile-btn" onClick={handleEditButton}>{t('Edit information')}</button>
                                </div>

                                <div className="reports-section">
                                    <button className="profile-btn" onClick={handleShowReports}>{t('My Reports')}</button>
                                    <p>{t('Remaining Report(s)')}: {user.maxReportNumber ? user.maxReportNumber : 0}</p>
                                    <button className="profile-btn" onClick={handlePasswordChangeButton}>{t('Change Password')}</button>
                                </div>
                            </div>
                            {openReports && (
                                <div className="reg-inspec-modal">
                                    <div className="reg-inspec-modal-content">
                                        <span className="reg-inspec-close-btn" onClick={() => { setOpenReports(false) }}>&times;</span>
                                        <h2>{t('My Reports')}</h2>
                                        <UserReportListPage
                                            list={reports}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

        </div>
    );
}

export default UserProfile;