import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import RegistryRegistrationDetailsForm from '../../../components/forms/registry/RegistryRegistrationDetailsForm';
import { AddCarRegistration, DownloadRegistrationExcelFile, EditCarRegistration, GetRegistrationExcel, ImportRegistrationFromExcel, ListCarRegistration } from '../../../services/api/CarRegistration';
import { RootState } from '../../../store/State';
import { APIResponse, CarModel, CarRecalls, CarRecallSearchParams, CarRegistration, CarRegistrationSearchParams, Paging } from '../../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../../utils/Validators';
import '../../../styles/ManufacturerCarRecall.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../../utils/JWTDecoder';
import { Pagination } from '@mui/material';
import { AddCarRecalls, EditCarRecall, ListManufacturerRecallss, ListManufaturerCarModels } from '../../../services/api/Recall';
import CarRecallAddModal from '../../../components/forms/manufacturer/Recall/CarRecallAddModal';
import CarRecallEditModal from '../../../components/forms/manufacturer/Recall/CarRecallEditModal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface Column {
    id: 'id' | 'modelId' | 'description' | 'recallDate' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function ManufacturerCarRecallList() {
    const { t, i18n } = useTranslation();
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'modelId', label: t('ModelID'), minWidth: 100 },
        { id: 'description', label: t('Description'), minWidth: 100 },
        { id: 'recallDate', label: t('RecallDate'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [recallList, setRecallList] = useState<CarRecalls[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [newRecall, setNewRecall] = useState<CarRecalls>({
        modelId: "",
        description: "",
        recallDate: ""
    })
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [editRecall, setEditRecall] = useState<CarRecalls | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchModelId, setSearchModelId] = useState('')
    const [searchRecallStartDate, setSearchRecallStartDate] = useState('')
    const [searchRecallEndDate, setSearchRecallEndDate] = useState('')



    const validateCarRegistration = (recall: CarRecalls): boolean => {
        if (!recall.description) {
            setAddError(t('Description must be filled out'));
            setOpenError(true)
            return false;
        }
        if (!recall.modelId) {
            setAddError(t('Model must be chosen'));
            setOpenError(true)
            return false;
        }
        if (!recall.recallDate) {
            setAddError(t('Recall Date must be chosen'));
            setOpenError(true)
            return false;
        }
        return true;
    };
    const handleAddCarRegistration = async () => {
        if (validateCarRegistration(newRecall)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarRecalls(newRecall, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setNewRecall({
                    modelId: "",
                    description: "",
                    recallDate: ""
                })
                setShowModal(false);
                setMessage(t('Add car recall successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleEditCarRegistration = async () => {
        if (editRecall && editRecall.id && validateCarRegistration(editRecall)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarRecall(editRecall.id, editRecall, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
                setOpenError(true)
            } else {
                setEditRecall(null)
                setMessage(t('Edit car recall successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editRecall) {
            setEditRecall({
                ...editRecall,
                [e.target.name]: value
            })
        } else {
            setNewRecall({
                ...newRecall,
                [e.target.name]: value,
            });
        }
    };
    const handleResetFilters = () => {
        setSearchModelId('')
        setSearchRecallEndDate('')
        setSearchRecallStartDate('')
        setResetTrigger(prev => prev + 1);
    }
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarRecallSearchParams = {
            modelId: searchModelId,
            recallDateEnd: searchRecallEndDate,
            recallDateStart: searchRecallStartDate
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const CarRecallReponse: APIResponse = await ListManufacturerRecallss(id, token, page+1, connectAPIError, language, searchParams)
        const carModelResponse: APIResponse = await ListManufaturerCarModels(id, token)
        if (CarRecallReponse.error) {
            setError(CarRecallReponse.error)
        } else if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            setRecallList(CarRecallReponse.data)
            setModelList(carModelResponse.data)
            setPaging(carModelResponse.pages)
        }
        setLoading(false)
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleDateChange = (date: string, type: string) => {
        if (type === 'recallDate') {
            if (editRecall) {
                setEditRecall({
                    ...editRecall,
                    recallDate: date
                })
            } else {
                setNewRecall({
                    ...newRecall,
                    recallDate: date,
                });
            }
        }
    }
    const [message, setMessage] = useState('')
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openError, setOpenError] = useState(false)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, [page])
    useEffect(() => {
        fetchData();
    }, [resetTrigger]);
    return (
        <div className="pol-crash-list-page">
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                    {message}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%', zIndex: '2000' }}>
                    {error ? error : addError}
                </MuiAlert>
            </Snackbar>
            <div className="pol-alert-action">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography style={{ fontWeight: 'bold' }}>+ {t('Add New Car Recall')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            + {t('Add Manually')}
                        </Typography>
                        <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>+ {t('Add New Car Recall')}</button>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className="pol-alert-action">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography style={{ fontWeight: 'bold' }}>{t('Search Bars and Filters')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="reg-inspec-search-filter-container">
                            <div className="reg-inspec-search-filter-item">
                                <label>{t('ModelID')}</label>
                                <input
                                    type="text"
                                    className="reg-inspec-search-bar"
                                    placeholder={t('Search Recall By ModelID')}
                                    value={searchModelId}
                                    onChange={(e) => setSearchModelId(e.target.value)}
                                />
                            </div>
                            <div className="reg-inspec-search-filter-item-2">
                                <label>{t('RecallDate')}</label>
                                <div className="reg-inspec-search-filter-item-2-dates">
                                    <label>{t('From')}: </label>
                                    <input
                                        type="date"
                                        className="reg-inspec-search-bar"
                                        value={searchRecallStartDate}
                                        onChange={(e) => setSearchRecallStartDate(e.target.value)}
                                    />
                                    <label>{t('To')}: </label>
                                    <input
                                        type="date"
                                        className="reg-inspec-search-bar"
                                        value={searchRecallEndDate}
                                        onChange={(e) => setSearchRecallEndDate(e.target.value)}
                                    />
                                </div>
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
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className="plate-search-page-row">
                <div className="plate-alert-page-item">
                    <div className="plate-search-page-item-3">
                        <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                            {t('Car Recalls List')}
                        </span>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableCell
                                                key={column.id + '-' + index}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <div className="pol-crash-spinner"></div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                {error}
                                                <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                            </TableCell>
                                        </TableRow>
                                    ) : recallList.length > 0 ? recallList
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column, index) => {
                                                        if (column.id !== 'actions' && column.id !== 'recallDate') {
                                                            let value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {value}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'recallDate') {
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {row.recallDate ? new Date(row.recallDate).toLocaleDateString() : 'Date not available'}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'actions') {
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                        <button onClick={() => { setEditRecall(row); }} disabled={adding} className="pol-crash-action-button">
                                                                            {t('Edit1')} &#x270E;
                                                                        </button>
                                                                </TableCell>
                                                            )
                                                        }
                                                    })}
                                                </TableRow>
                                            );
                                        }) :
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                {t('No car recall found')}
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[15]}
                            component="div"
                            count={paging ? paging.TotalCount : 0}
                            rowsPerPage={15}
                            page={page}
                            onPageChange={handleChangePage}
                            labelDisplayedRows={
                                ({ from, to, count }) => {
                                    return '' + from + '-' + to + ' ' + t('of') + ' ' + count
                                }
                            }
                        />
                    </div>
                </div>
            </div>           
            {showModal && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => {
                            setShowModal(false); setNewRecall({
                                modelId: "",
                                description: "",
                                recallDate: ""
                            }); setError(''); setAddError('')}}>&times;</span>
                        <h2>{t('Add Car Registration')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <CarRecallAddModal
                                recall={newRecall}
                                models={modelList}
                                handleInputChange={handleInputChange}
                                handleDateChange={handleDateChange}
                            />
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            <button onClick={handleAddCarRegistration} disabled={adding} className="ad-manu-add-btn">
                                {adding ? (
                                    <div className="ad-manu-inline-spinner"></div>
                                ) : t('Finish')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editRecall && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setEditRecall(null); setError(''); setAddError('') }}>&times;</span>
                        <h2>{t('Edit Car Registration')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <CarRecallEditModal
                                action="Edit"
                                model={editRecall}
                                handleInputChange={handleInputChange}
                                handleDateChange={handleDateChange}
                            />
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            <button onClick={handleEditCarRegistration} disabled={adding} className="ad-manu-add-btn">
                                {adding ? (
                                    <div className="ad-manu-inline-spinner"></div>
                                ) : t('Finish')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManufacturerCarRecallList;