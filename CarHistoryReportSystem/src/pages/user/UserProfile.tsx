/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Edit, EditPassword, Get } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/UserProfile.css'
import { APIResponse, PasswordChange, User, UserReport } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import blank from '../../images/blank.png'
import { GetImages, UploadImages } from '../../services/azure/Images';
import { isValidEmail, isValidNumber, isValidPassword } from '../../utils/Validators';
import { useTranslation } from 'react-i18next';
import { GetUserReports } from '../../services/api/Reports';
import UserReportListPage from '../../components/forms/user/UserReportListPage';
import Avatar from '@mui/material/Avatar';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IconButton from "@mui/material/IconButton";
import passwordIcon from '../../images/password.png'
import reportsIcon from '../../images/reports.png'
import editIcon from '../../images/edit.png'
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField'
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Column {
    id: 'carId' | 'date' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function UserProfile() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const columns: readonly Column[] = [
        { id: 'carId', label: t('VIN'), minWidth: 100 },
        { id: 'date', label: t('Records up to'), minWidth: 100 },
        { id: 'actions', label: t('Action'), minWidth: 100 }
    ];
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

    const [updatedUser, setUpdatedUser] = useState(user)
    const [updatedPassword, setUpdatedPassword] = useState<PasswordChange>({
        usernameOrEmail: '',
        oldPassword: '',
        password: '',
        rePassword: ''
    })
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
        if (!isValidNumber(user.phoneNumber)) {
            setError(t('Invalid phone number'));
            return false;
        }
        // if (!user.address || !user.phoneNumber || !user.firstName || !user.lastName) {
        //     setError(t('All fields must be filled out'));
        //     return false;
        // }
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
        if (validateUser(updatedUser)) {
            setUpdating(true)
            setError(null)
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            let notFoundError = t('No image was found')
            let failedError = t('Failed to upload image')
            let uploadedImage = ''
            if (image !== null) {
                const uploadImage = await UploadImages(image, notFoundError, failedError)
                if (uploadImage.error) {
                    setUpdating(false)
                    setError(uploadImage.error)
                } else {
                    uploadedImage = uploadImage.data
                }
            }
            const response = await Edit(id, { ...updatedUser, avatarImageLink: user.avatarImageLink ? uploadedImage : user.avatarImageLink }, token, connectAPIError, unknownError, language)
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
    const handleCancelButton = () => {
        if (isEditing) {
            setEditing(false)
        } else if (isEditingPassword) {
            setEditingPassword(false)
        }
        setUpdatedUser(user)
    }
    const handleUpdateUser = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log('Hey', e.target.value)
        setUpdatedUser({
            ...updatedUser,
            [e.target.name]: e.target.value
        })
    }
    const handleUpdatePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '15%', marginLeft: '20%', marginRight: '20%', marginBottom: '20%', backgroundColor: 'white', borderRadius: '30px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', width: '100%' }}>
                        <div className="gradient-background" style={{ display: 'flex', flexDirection: 'column', maxWidth: '35%', justifyItems: 'center', justifyContent: 'center', padding: '15%', paddingTop: '8%', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                            <div className="profile-icon">
                                <Avatar src={imageUrl ? imageUrl : blank} alt="Click to change" className="picture" sx={{ width: 144, height: 144, border: '1px solid white' }} />
                            </div>
                            <p style={{ fontSize: '30px', color: 'white' }}>{user.userName}</p>
                            <p style={{ fontSize: '20px', color: 'white' }}>{t(user.roleName)}</p>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Tooltip title={t('Edit Profile')}>
                                    <IconButton onClick={() => { handleEditButton() }} sx={{ height: "50px", width: "50px" }} >
                                        <img src={editIcon} height='100%' alt='' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('Change Password')}>
                                    <IconButton onClick={() => { setEditingPassword(true) }} sx={{ height: "50px", width: "50px" }} >
                                        <img src={passwordIcon} height='100%' alt='' />
                                    </IconButton>
                                </Tooltip>
                                {user.roleName === 'User' && (
                                    <Tooltip title={t('View My Reports')}>
                                        <IconButton onClick={() => { setOpenReports(true) }} sx={{ height: "50px", width: "50px" }} >
                                            <img src={reportsIcon} height='100%' alt='' />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '5%', width: '100%', paddingLeft: '5%', paddingRight: '5%' }}>
                            <h3 style={{ textAlign: 'left', borderBottom: '1px solid gray', justifyItems: 'center', fontSize: '25px', color: 'gray' }}>{t('Information')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                    <h2>Email</h2>
                                    <a style={{ color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                    <h2>{t('Username')}</h2>
                                    <a style={{ color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.userName}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                    <h2>{t('Full Name')}</h2>
                                    <a style={{ color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                    <h2>{t('Phone Number')}</h2>
                                    <a style={{ color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.phoneNumber}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                    <h2>{t('Address')}</h2>
                                    <a style={{ color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.address}</a>
                                </div>
                                {user.dataProvider && (
                                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                        <h2>{t('Data Provider')}</h2>
                                        <a style={{ color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.dataProvider.name}</a>
                                    </div>
                                )}
                            </div>
                            {user.roleName === 'User' && (
                                <>
                                    <h3 style={{ textAlign: 'left', borderBottom: '1px solid gray', justifyItems: 'center', fontSize: '25px', color: 'gray' }}>{t('Reports')}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                            <a>{t('Available Reports')}: {user.maxReportNumber}</a>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                            <a>{t('Purchased Reports')}: {reports.length}</a>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
            {isEditing && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { if (!updating) { setEditing(false); setUpdatedUser(user); setError(null) } }}>&times;</span>
                        <h2>{t('Edit Profile')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <>
                                <div className="profile-edit-icon">
                                    <input type="file" id="profile-picture" accept="image/*" className="profile-edit-picture" onChange={onImageChange} />
                                    <img src={imageUrl ? imageUrl : blank} id="picture" alt="Click to change" title="Click to change" className="edit-picture" onClick={handleImageClick} />
                                </div>
                                <div className="pol-crash-form-column">
                                    <label>{t('First Name')}</label>
                                    <TextField type="text" name="firstName" value={updatedUser.firstName} onChange={handleUpdateUser} style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-crash-form-column">
                                    <label>{t('Last Name')}</label>
                                    <TextField type="text" name="lastName" value={updatedUser.lastName} onChange={handleUpdateUser} style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-crash-form-column">
                                    <label>{t('Address')}</label>
                                    <TextField type="text" name="address" value={updatedUser.address} onChange={handleUpdateUser} style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-crash-form-column">
                                    <label>{t('Phone Number')}</label>
                                    <TextField type="text" name="phoneNumber" value={updatedUser.phoneNumber} onChange={handleUpdateUser} style={{ width: '100%' }} size='small' />
                                </div>
                            </>
                        </div>
                        {error && (
                            <MuiAlert elevation={6} variant="filled" severity="error" sx={{ zIndex: '2000', marginTop: '20px' }}>
                                {error}
                            </MuiAlert>
                        )}
                        <button onClick={handleUpdateButton} disabled={updating} className="reg-reg-model-add-btn">
                            {updating ? (<div className="pol-crash-model-inline-spinner"></div>) : t('Finish')}
                        </button>
                    </div>
                </div>
            )}
            {isEditingPassword && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => {
                            if (!updating) {
                                setEditingPassword(false); setUpdatedPassword({
                                    usernameOrEmail: '',
                                    oldPassword: '',
                                    password: '',
                                    rePassword: ''
                                }); setError(null)
                            }
                        }}>&times;</span>
                        <h2>{t('Change Password')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <>
                                <div className="pol-crash-form-column">
                                    <label>{t('Old password')}</label>
                                    <TextField type="password" name="oldPassword" value={updatedPassword.oldPassword} onChange={handleUpdatePassword} style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-crash-form-column">
                                    <label>{t('New password')}</label>
                                    <TextField type="password" name="password" value={updatedPassword.password} onChange={handleUpdatePassword} style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-crash-form-column">
                                    <label>{t('Re-enter new password')}</label>
                                    <TextField type="password" name="rePassword" value={updatedPassword.rePassword} onChange={handleUpdatePassword} style={{ width: '100%' }} size='small' />
                                </div>
                            </>
                        </div>
                        {error && (
                            <MuiAlert elevation={6} variant="filled" severity="error" sx={{ zIndex: '2000', marginTop: '20px' }}>
                                {error}
                            </MuiAlert>
                        )}
                        <button onClick={handleEditPasswordButton} disabled={updating} className="reg-reg-model-add-btn">
                            {updating ? (<div className="pol-crash-model-inline-spinner"></div>) : t('Finish')}
                        </button>
                    </div>
                </div>
            )}
            {openReports && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setOpenReports(false) }}>&times;</span>
                        <h2>{t('Purchased Reports')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column, index) => {
                                                return (
                                                    <TableCell
                                                        key={column.id + '-' + index}
                                                        align={column.align}
                                                        style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '10px', textAlign: 'left' }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reports.length > 0 ? reports
                                            .map((row, index1) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                        {columns.map((column, index) => {
                                                            if (column.id === 'carId') {
                                                                return (
                                                                    <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                        {row.carId}
                                                                    </TableCell>
                                                                )
                                                            } else if (column.id === 'actions') {
                                                                return (
                                                                    <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                        <button onClick={() => { navigate(`/car-report/${row.carId}/${row.createdDate}`) }} className="pol-crash-action-button-2">
                                                                            {t('See Report')}
                                                                        </button>
                                                                    </TableCell>
                                                                )
                                                            } else {
                                                                return (
                                                                    <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                        {row.createdDate}
                                                                    </TableCell>
                                                                )
                                                            }
                                                        })}
                                                    </TableRow>
                                                );
                                            }) :
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    {t('You do not have any reports')}
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;