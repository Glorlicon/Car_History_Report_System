import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceVinAlert.css'
import { isValidVIN } from '../../utils/Validators';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { APIResponse, CarTracking, Paging, VinAlert } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { GetVinAlertList, AddCarToAlertList, RemoveCarFromAlertList } from '../../services/api/Car';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface Column {
    id: 'carId' | 'isFollowing' | 'createdTime';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function PoliceVinAlertPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).nameidentifier
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [alertVin, setAlertVin] = useState('')
    const [addError, setAddError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [page, setPage] = useState(0);
    const [paging, setPaging] = useState<Paging>()
    const [carList, setCarList] = useState<VinAlert[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const columns: readonly Column[] = [
        { id: 'carId', label: t('VIN'), minWidth: 170 },
        { id: 'createdTime', label: t('Created Time'), minWidth: 100 },
        { id: 'isFollowing', label: t('Actions'), minWidth: 100 }
    ];
    const handleAddNewAlert = async() => {
        setAdding(true);
        setAddError(null);
        if (!isValidVIN(alertVin)) {
            setAddError(t('VIN is invalid'));
            setOpenError(true)
            setAdding(false);
            return;
        }
        if (!alertVin) {
            setAddError(t('VIN must be filled out'));
            setOpenError(true)
            setAdding(false);
            return;
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await AddCarToAlertList({
            carId: alertVin,
            userId: id
        } as CarTracking, token, connectAPIError, language);
        setAdding(false);
        if (response.error) {
            setAddError(response.error);
            setOpenError(true)
        } else {
            setAlertVin('')
            setMessage(t('Add alert successfully'))
            setOpenSuccess(true)
            fetchData();
        }
    }
    const handleAddAlertButtonClick = async (carId: string) => {
        setAddError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await AddCarToAlertList({
            carId: carId,
            userId: id
        } as CarTracking, token, connectAPIError, language);
        if (response.error) {
            setAddError(response.error);
            setOpenError(true)
        } else {
            setMessage(t('Add alert successfully'))
            setOpenSuccess(true)
            fetchData();
        }
    }
    const handleRemoveAlertButtonClick = async (carId: string) => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await RemoveCarFromAlertList({
            carId: carId,
            userId: id
        } as CarTracking, token, connectAPIError, language);
        if (response.error) {
            setAddError(response.error);
            setOpenError(true)
        } else {
            setMessage(t('Remove alert successfully'))
            setOpenSuccess(true)
            fetchData();
        }
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await GetVinAlertList(id, page+1, token, connectAPIError, language)
        if (response.error) {
            setError(response.error)
            setOpenError(true)
        } else {
            setCarList(response.data)
            setPaging(response.pages)
        }
        setLoading(false)
    }
    const handleViewReport = (vin: string) => {
        navigate(`/police/car-report/${vin}`)
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
    return (
      <div className="pol-plate-search-page">
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
                        <Typography style={{ fontWeight:'bold' }}>{t('Create a VIN Alert')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {t("When new information gets reported to CHRS about car, you'll be notified")}
                        </Typography>
                    </AccordionDetails>
                    <AccordionDetails>
                        <div className="reg-inspec-search-filter-item">
                            <label>
                                {t('Car VIN')}
                            </label>
                            <input
                                type="text"
                                className="reg-inspec-search-bar"
                                placeholder={t('Enter VIN')}
                                value={alertVin}
                                onChange={(e) => setAlertVin(e.target.value)}
                            />
                        </div>
                        <div className="search-actions">
                            <button onClick={handleAddNewAlert} disabled={adding} className="pol-stolen-model-add-btn">
                                {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Add VIN Alert')}
                            </button>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className="plate-search-page-row">
                <div className="plate-alert-page-item">
                    <div className="plate-search-page-item-3">
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color:'white' }}>
                                            {t('VIN Alert List')}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign:'center' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <div className="pol-stolen-spinner"></div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <button onClick={fetchData} className="pol-stolen-retry-btn">{t('Retry')}</button>
                                                </TableCell>
                                            </TableRow>
                                    ) : carList.length > 0 ? carList
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.carId} style={{ backgroundColor: index % 2 === 1 ? 'white' :'#E1E1E1'}}>
                                                    {columns.map((column) => {
                                                        if (column.id === 'isFollowing') {
                                                            const value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {value ? (
                                                                        <button className="ad-user-suspend-btn" onClick={() => handleRemoveAlertButtonClick(row.carId)}>{t('Stop tracking')}</button>
                                                                    ) : (
                                                                        <button className="ad-user-unsuspend-btn" onClick={() => handleAddAlertButtonClick(row.carId)}>{t('Resume tracking')}</button>
                                                                    )}
                                                                    <button className="plate-view-report-button" onClick={() => { handleViewReport(row.carId) }}>{t('View Report For Car')}</button>
                                                                </TableCell>
                                                            )
                                                        } else {
                                                            let value;
                                                            if (column.id === 'createdTime') value = row[column.id].split('T')[0]
                                                            else value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {value}
                                                                </TableCell>
                                                            )
                                                        }
                                                    })}
                                                </TableRow>
                                            );
                                        }) :
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                {t('No cars found')}
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5]}
                            component="div"
                            count={paging ? paging.TotalCount : 0}
                            rowsPerPage={5}
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
      </div>
  );
}

export default PoliceVinAlertPage;

