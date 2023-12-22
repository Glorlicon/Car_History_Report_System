import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PoliceCarCrashDetailsForm from '../../components/forms/police/PoliceCarCrashDetailsForm';
import PoliceCarCrashIdentificationForm from '../../components/forms/police/PoliceCarCrashIdentificationForm';
import { AddCarCrash, DownloadCrashExcelFile, EditCarCrash, GetCrashExcel, ImportCrashFromExcel, ListCarCrash } from '../../services/api/CarCrash';
import { RootState } from '../../store/State';
import { APIResponse, CarCrash, CarCrashSearchParams, Paging } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/PoliceCrashCar.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CAR_SIDES } from '../../utils/const/CarSides';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Papa from 'papaparse';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

interface Column {
    id: 'id' | 'carId' | 'location' | 'serverity' | 'description' | 'damageLocation' | 'accidentDate' | 'odometer' | 'reportDate' | 'note' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function PoliceCarCrashList() {
    const navigate = useNavigate()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const { t, i18n } = useTranslation()
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'carId', label: t('VIN'), minWidth: 100 },
        { id: 'location', label: t('Location'), minWidth: 100 },
        { id: 'serverity', label: t('Severity'), minWidth: 100 },
        { id: 'description', label: t('Description'), minWidth: 100 },
        { id: 'damageLocation', label: t('Damage Location'), minWidth: 100 },
        { id: 'accidentDate', label: t('Accident Date'), minWidth: 100 },
        { id: 'odometer', label: t('Odometer'), minWidth: 100 },
        { id: 'reportDate', label: t('Report Date'), minWidth: 100 },
        { id: 'note', label: t('Note'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carCrashList, setCarCrashList] = useState<CarCrash[]>([]);
    const [modalPage, setModalPage] = useState(1);
    const [newCarCrashReport, setNewCarCrashReport] = useState<CarCrash>({
        description: '',
        carId: '',
        odometer: 0,
        serverity: 0,
        note: '',
        reportDate: '',
        damageLocation: 0,
        accidentDate: '',
        location: ''
    });
    const [searchVinId, setSearchVinId] = useState('')
    const [searchMinSeverity, setSearchMinSeverity] = useState('')
    const [searchMaxSeverity, setSearchMaxSeverity] = useState('')
    const [searchCrashStartDate, setSearchStartDate] = useState('')
    const [searchCrashEndDate, setSearchEndDate] = useState('')
    const [editCarCrashReport, setEditCarCrashReport] = useState<CarCrash | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [openImport, setOpenImport] = useState(false)
    const [template, setTemplate] = useState('')
    const [templateTrigger, setTemplateTrigger] = useState(0)
    const [importData, setImportData] = useState<FormData | null>(null)
    const [viewImportData, setViewImportData] = useState<CarCrash[]>([])
    const isFirstRender = useRef(true);
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const handleDownloadTemplate = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const res = await DownloadCrashExcelFile(token, connectAPIError, language)
        if (res.data) {
            setTemplate(res.data)
            setTemplateTrigger(prev => prev + 1)
        }
    }
    const handleDownloadTemplateClick = () => {
        const element = document.getElementById('template')
        element?.click()
    }
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            handleDownloadTemplateClick();
        }
    }, [templateTrigger])

    const handleImportExcel = async () => {
        if (importData) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await ImportCrashFromExcel(token, importData, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setOpenImport(false)
                setImportData(null)
                setViewImportData([])
                setMessage(t('Add car crash report successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleImportClick = () => {
        document.getElementById('excel-file')?.click()
    }

    const handleAddDataFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files[0]) {
            const file = files[0]
            Papa.parse(file, {
                complete: (result: any) => {
                    const transformedData = result.data.map((row: any) => {
                        const newRow: { [key: string]: any } = {};
                        Object.keys(row).forEach((key) => {
                            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
                            newRow[newKey] = row[key];
                        });
                        return newRow;
                    });
                    setViewImportData(transformedData);
                },
                header: true,
            });

            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result && typeof e.target.result === 'string') {
                    const fileContent = e.target.result
                    const formData = new FormData()
                    formData.append('file', file)
                    setImportData(formData)
                }
            }
            reader.readAsText(file);
        }
    }

    const getCarSides = (value: number): string => {
        const sides: string[] = []
        if (value & CAR_SIDES.Front) {
            sides.push(t('Front'));
        }
        if (value & CAR_SIDES.Rear) {
            sides.push(t('Rear'));
        }
        if (value & CAR_SIDES.Left) {
            sides.push(t('Left'));
        }
        if (value & CAR_SIDES.Right) {
            sides.push(t('Right'));
        }

        return sides.join(', ');
    }

    const validateCarCrashReport = (crashReport: CarCrash): boolean => {
        if (!isValidVIN(crashReport.carId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!crashReport.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!crashReport.description) {
            setAddError(t('Description must be filled out'));
            return false;
        }
        if (!crashReport.location) {
            setAddError(t('Location must be filled out'));
            return false;
        }
        if (!crashReport.odometer) {
            setAddError(t('Odometer must be chosen'));
            return false;
        }
        if (!crashReport.accidentDate) {
            setAddError(t('Accident Date must be chosen'));
            return false;
        }
        if (!crashReport.reportDate) {
            setAddError(t('Report Date must be chosen'));
            return false;
        }
        if (!crashReport.note) {
            setAddError(t('Note must be filled out'));
            return false;
        }
        if (crashReport.serverity <= 0) {
            setAddError(t('Severity must be higher than 0'));
            return false;
        }
        return true;
    };
    const handleDamageLocationChange = (sideValue: number) => {
        if (editCarCrashReport) {
            setEditCarCrashReport({
                ...editCarCrashReport,
                damageLocation: editCarCrashReport.damageLocation ^ sideValue
            })
        } else {
            setNewCarCrashReport({
                ...newCarCrashReport,
                damageLocation: newCarCrashReport.damageLocation ^ sideValue
            })
        }
    };


    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editCarCrashReport) handleEditCarCrashReport();
            else handleAddCarCrashReport();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };
    const handleAddCarCrashReport = async () => {
        if (validateCarCrashReport(newCarCrashReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarCrash(newCarCrashReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setModalPage(1)
                setNewCarCrashReport({
                    description: '',
                    carId: '',
                    odometer: 0,
                    serverity: 0,
                    note: '',
                    reportDate: '',
                    damageLocation: 0,
                    accidentDate: '',
                    location: ''
                })
                setMessage(t('Add car crash report successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleEditCarCrashReport = async () => {
        if (editCarCrashReport && editCarCrashReport.id && validateCarCrashReport(editCarCrashReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarCrash(editCarCrashReport.id, editCarCrashReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditCarCrashReport(null)
                setModalPage(1)
                setMessage(t('Edit car crash report successfully'))
                setOpenSuccess(true)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarCrashReport) {
            setEditCarCrashReport({
                ...editCarCrashReport,
                [e.target.name]: value
            })
        } else {
            setNewCarCrashReport({
                ...newCarCrashReport,
                [e.target.name]: value,
            });
        }
    };
    const handleDateChange = (date: string, type: string) => {
        if (type === 'accidentDate') {
            if (editCarCrashReport) {
                setEditCarCrashReport({
                    ...editCarCrashReport,
                    accidentDate: date
                })
            } else {
                setNewCarCrashReport({
                    ...newCarCrashReport,
                    accidentDate: date,
                });
            }
        } else if (type === 'reportDate') {
            if (editCarCrashReport) {
                setEditCarCrashReport({
                    ...editCarCrashReport,
                    reportDate: date
                })
            } else {
                setNewCarCrashReport({
                    ...newCarCrashReport,
                    reportDate: date,
                });
            }
        }
    }

    const handleSeverityChange = (value: number) => {
        if (editCarCrashReport) {
            setEditCarCrashReport({
                ...editCarCrashReport,
                serverity: value
            })
        } else {
            setNewCarCrashReport({
                ...newCarCrashReport,
                serverity: value,
            });
        }
    }

    const handleResetFilters = () => {
        setSearchEndDate('')
        setSearchMaxSeverity('')
        setSearchMinSeverity('')
        setSearchStartDate('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarCrashSearchParams = {
            vinId: searchVinId,
            accidentEndDate: searchCrashEndDate,
            accidentStartDate: searchCrashStartDate,
            minServerity: searchMinSeverity,
            maxServerity: searchMaxSeverity
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carCrashReportResponse: APIResponse = await ListCarCrash(id, token, page + 1, connectAPIError, language, searchParams)
        if (carCrashReportResponse.error) {
            setError(carCrashReportResponse.error)
        } else {
            setCarCrashList(carCrashReportResponse.data)
            setPaging(carCrashReportResponse.pages)
            const responseCsv: APIResponse = await GetCrashExcel(id, token, page + 1, connectAPIError, language, searchParams)
            let bom = '\uFEFF'
            setData(bom+responseCsv.data)
        }
        setLoading(false)
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
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
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop: '200px' }}>
                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                    {message}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop: '200px' }}>
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
                        <Typography style={{ fontWeight: 'bold' }}>+ {t('Add Car Crash Report')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {t('Add Manually')}
                        </Typography>
                        <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>{t('Add New Crash Car Report')}</button>
                    </AccordionDetails>
                    <AccordionDetails>
                        <Typography>
                            {t('Add Using Excel')}
                        </Typography>
                        <button className="add-pol-crash-btn" onClick={() => { handleDownloadTemplate() }}>&dArr; {t('Excel Template')}</button>
                        <a
                            href={`data:text/csv;charset=utf-8,${escape(template)}`}
                            download={`template.csv`}
                            hidden
                            id="template"
                        />
                        <button className="add-pol-crash-btn" onClick={() => { setOpenImport(true) }}>{t('Import From Excel')}</button>
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
                                <label>{t('Car ID')}</label>
                                <input
                                    type="text"
                                    className="reg-inspec-search-bar"
                                    placeholder={t('Search by Car ID')}
                                    value={searchVinId}
                                    onChange={(e) => setSearchVinId(e.target.value)}
                                />
                            </div>
                            <div className="reg-inspec-search-filter-item-2">
                                <label>{t('Severity')}</label>
                                <div className="reg-inspec-search-filter-item-2-dates">
                                    <label>{t('From')}: </label>
                                    <input
                                        type="number"
                                        className="reg-inspec-search-bar"
                                        value={searchMinSeverity}
                                        onChange={(e) => setSearchMinSeverity(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        max="1"
                                    />
                                    <label>{t('To')}: </label>
                                    <input
                                        type="number"
                                        className="reg-inspec-search-bar"
                                        value={searchMaxSeverity}
                                        onChange={(e) => setSearchMaxSeverity(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        max="1"
                                    />
                                </div>
                            </div>
                            <div className="reg-inspec-search-filter-item-2">
                                <label>{t('Accident Date')}</label>
                                <div className="reg-inspec-search-filter-item-2-dates">
                                    <label>{t('From')}: </label>
                                    <input
                                        type="date"
                                        className="reg-inspec-search-bar"
                                        value={searchCrashStartDate}
                                        onChange={(e) => setSearchStartDate(e.target.value)}
                                    />
                                    <label>{t('To')}: </label>
                                    <input
                                        type="date"
                                        className="reg-inspec-search-bar"
                                        value={searchCrashEndDate}
                                        onChange={(e) => setSearchEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                className="search-reg-inspec-btn"
                                onClick={() => { setPage(0); fetchData(); }}
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
                        <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom: '15px', paddingTop: '15px' }}>
                            {t('Car Crash List')}
                        </span>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => {
                                            if (column.id !== 'actions') {
                                                return (
                                                    <TableCell
                                                        key={column.id + '-' + index}
                                                        align={column.align}
                                                        style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'left' }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                )
                                            } else {
                                                return (
                                                    <TableCell
                                                        sx={stickyCellStyle}
                                                        key={column.id + '-' + index}
                                                        align={column.align}
                                                        style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'left' }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                )
                                            }
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={11}>
                                                <div className="pol-crash-spinner"></div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={11}>
                                                {error}
                                                <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                            </TableCell>
                                        </TableRow>
                                    ) : carCrashList.length > 0 ? carCrashList
                                        .map((row, index1) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column, index) => {
                                                        if (column.id !== 'actions' && column.id !== 'damageLocation') {
                                                            let value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                    {column.id === 'serverity' && typeof value === 'number' ? `${value * 100}%` : value}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'damageLocation') {
                                                            let value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                    {getCarSides(value)}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'actions') {
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">
                                                                    <div className="pol-crash-modal-content-2-buttons">
                                                                        <button onClick={() => { setEditCarCrashReport(row) }} disabled={adding} className="pol-crash-action-button">
                                                                            {t('Edit1')} &#x270E;
                                                                        </button>
                                                                        <button onClick={() => { navigate(`/police/car-report/${row.carId}`) }} className="pol-crash-action-button-2">
                                                                            {t('View Report For Car')}
                                                                        </button>
                                                                    </div>

                                                                </TableCell>
                                                            )
                                                        }
                                                    })}
                                                </TableRow>
                                            );
                                        }) :
                                        <TableRow>
                                            <TableCell colSpan={11}>
                                                {t('No car crash report found')}
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            style={{ backgroundColor: 'white', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
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
                            setShowModal(false); setModalPage(1); setNewCarCrashReport({
                                description: '',
                                carId: '',
                                odometer: 0,
                                serverity: 0,
                                note: '',
                                reportDate: '',
                                damageLocation: 0,
                                accidentDate: '',
                                location: ''
                            }); setError(''); setAddError('')
                        }}>&times;</span>
                        <h2>{t('Add Car Crash Report')}</h2>
                        <div className="pol-crash-modal-content-2">
                            {modalPage === 1 && (
                                <PoliceCarCrashIdentificationForm
                                    action="Add"
                                    model={newCarCrashReport}
                                    handleInputChange={handleInputChange}
                                    handleDateChange={handleDateChange}
                                />
                            )}
                            {modalPage === 2 && (
                                <PoliceCarCrashDetailsForm
                                    action="Add"
                                    model={newCarCrashReport}
                                    handleInputChange={handleInputChange}
                                    handleDamageLocationChange={handleDamageLocationChange}
                                    handleSeverityChange={handleSeverityChange}
                                />
                            )}
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : (
                                <div className="pol-crash-modal-content-2-buttons">
                                    <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                                        {t('Previous')}
                                    </button>
                                    <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                        {modalPage < 2 ? t('Next') : t('Finish')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {editCarCrashReport && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setEditCarCrashReport(null); setModalPage(1); setError(''); setAddError('') }}>&times;</span>
                        <h2>{t('Edit Car Crash Report')}</h2>
                        <div className="pol-crash-modal-content-2">
                            {modalPage === 1 && (
                                <PoliceCarCrashIdentificationForm
                                    action="Edit"
                                    model={editCarCrashReport}
                                    handleInputChange={handleInputChange}
                                    handleDateChange={handleDateChange}
                                />
                            )}
                            {modalPage === 2 && (
                                <PoliceCarCrashDetailsForm
                                    action="Edit"
                                    model={editCarCrashReport}
                                    handleInputChange={handleInputChange}
                                    handleDamageLocationChange={handleDamageLocationChange}
                                    handleSeverityChange={handleSeverityChange}
                                />
                            )}
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : (
                                <div className="pol-crash-modal-content-2-buttons">
                                    <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                                        {t('Previous')}
                                    </button>
                                    <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                        {modalPage < 2 ? t('Next') : t('Finish')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {openImport && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setOpenImport(false); setImportData(null); setViewImportData([]); setError(''); setAddError('') }}>&times;</span>
                        <h2>{t('Import from csv')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <div className="reg-reg-form-column-2">
                                <input type="file" id="excel-file" accept=".csv" className="csv-input" onChange={handleAddDataFromFile} />
                                <button onClick={handleImportClick} className="dealer-car-sales-form-image-add-button"> {t('Choose file')}</button>
                            </div>
                            <span style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                                {t('Car Crash List')}
                            </span>
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column, index) => {
                                                if (column.id !== 'id' && column.id !== 'actions')
                                                    return (
                                                        <TableCell
                                                            key={column.id + '-' + index}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    )
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {viewImportData.length > 0 ? viewImportData
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                        {columns.map((column, index) => {
                                                            if (column.id !== 'actions' && column.id !== 'damageLocation' && column.id !== 'id') {
                                                                let value = row[column.id]
                                                                return (
                                                                    <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                        {column.id === 'serverity' && typeof value === 'number' ? `${value * 100}%` : value}
                                                                    </TableCell>
                                                                )
                                                            } else if (column.id === 'damageLocation') {
                                                                let value = row[column.id];
                                                                return (
                                                                    <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                        {getCarSides(value)}
                                                                    </TableCell>
                                                                )
                                                            }
                                                        })}
                                                    </TableRow>
                                                );
                                            }) :
                                            <TableRow>
                                                <TableCell colSpan={9}>
                                                    {t('No car crash report found')}
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <MuiAlert elevation={6} variant="filled" severity="warning" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                {t('Import file must have all data correct to be able to import')} !
                            </MuiAlert>
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            <button onClick={handleImportExcel} disabled={adding} className="reg-reg-model-add-btn">
                                {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : t('Finish')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {paging && paging.TotalPages > 0 &&
                <div className="plate-search-page-row">
                    <button className="export-pol-crash-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                    <a
                        href={`data:text/csv;charset=utf-8,${encodeURIComponent(data)}`}
                        download={`crash-${Date.now()}.csv`}
                        hidden
                        id="excel"
                    />
                </div>
            }
        </div>
    )
}

export default PoliceCarCrashList;