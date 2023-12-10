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

interface Column {
    id: 'carId' | 'isFollowing' | 'createdTime' | 'actionStatus';
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
    const [actionStatus, setActionStatus] = useState('')
    const [currentActionId, setCurrentActionId] = useState('')
    const columns: readonly Column[] = [
        { id: 'carId', label: t('VIN'), minWidth: 170 },
        { id: 'createdTime', label: t('Created Time'), minWidth: 100 },
        { id: 'isFollowing', label: t('Actions'), minWidth: 100 },
        { id: 'actionStatus', label: t('Actions Status'), minWidth: 100 }
    ];
    const handleAddNewAlert = async() => {
        setAdding(true);
        setAddError(null);
        if (!isValidVIN(alertVin)) {
            setAddError(t('VIN is invalid'));
            setAdding(false);
            return;
        }
        if (!alertVin) {
            setAddError(t('VIN must be filled out'));
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
        } else {
            setAlertVin('')
            fetchData();
        }
    }
    const handleAddAlertButtonClick = async (carId: string) => {
        setCurrentActionId(carId)
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await AddCarToAlertList({
            carId: carId,
            userId: id
        } as CarTracking, token, connectAPIError, language);
        setActionStatus(t('Running'))
        if (response.error) {
            setActionStatus(response.error);
        } else {
            setActionStatus('');
            fetchData();
        }
    }
    const handleRemoveAlertButtonClick = async (carId: string) => {
        setCurrentActionId(carId)
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await RemoveCarFromAlertList({
            carId: carId,
            userId: id
        } as CarTracking, token, connectAPIError, language);
        setActionStatus(t('Running'))
        if (response.error) {
            setActionStatus(response.error);
        } else {
            setActionStatus('');
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
        } else {
            setCarList(response.data)
            setPaging(response.pages)
        }
        setLoading(false)
    }
    const handleViewReport = (vin: string) => {
        navigate(`/car-report/${vin}`)
    }
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
            <div className="pol-alert-action">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{t('Create a VIN Alert')}</Typography>
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
                                {addError && (
                                    <p className="pol-stolen-error">{addError}</p>
                                )}
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
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
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
                                                    {error}
                                                    <button onClick={fetchData} className="pol-stolen-retry-btn">{t('Retry')}</button>
                                                </TableCell>
                                            </TableRow>
                                    ) : carList.length > 0 ? carList
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.carId}>
                                                    {columns.map((column) => {
                                                        if (column.id === 'isFollowing') {
                                                            const value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {value ? (
                                                                        <button className="ad-user-suspend-btn" onClick={() => handleRemoveAlertButtonClick(row.carId)}>{t('Stop tracking')}</button>
                                                                    ) : (
                                                                        <button className="ad-user-unsuspend-btn" onClick={() => handleAddAlertButtonClick(row.carId)}>{t('Resume tracking')}</button>
                                                                    )}
                                                                    <button className="plate-view-report-button" onClick={() => { handleViewReport(row.carId) }}>{t('View Report For Car')}</button>
                                                                </TableCell>
                                                            )
                                                        } else if (column.id !== 'actionStatus') {
                                                            const value = row[column.id] ? row[column.id]?.toString() : 'Unknown';
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {value}
                                                                </TableCell>
                                                            )
                                                        } else {
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {currentActionId === row.carId && (
                                                                        <p className="pol-stolen-error">{actionStatus}</p>
                                                                    )}
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
                        />
                    </div>
                </div>
            </div>
      </div>
  );
}

export default PoliceVinAlertPage;

