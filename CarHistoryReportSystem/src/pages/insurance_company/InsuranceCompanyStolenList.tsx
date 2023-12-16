import { Pagination } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GetStolenInsuranceExcel, ListCarStolenInsurance } from '../../services/api/CarStolen';
import { RootState } from '../../store/State';
import { CAR_STOLEN_STATUS } from '../../utils/const/CarStolenStatus';
import { APIResponse, CarStolen, CarStolenSearchParams, Paging } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
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
import InfoIcon from '@mui/icons-material/Info';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

interface Column {
    id: 'id' | 'carId' | 'description' | 'status' | 'odometer' | 'source' |'reportDate' | 'note' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function InsuranceCompanyStolenList() {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'carId', label: t('VIN'), minWidth: 100 },
        { id: 'odometer', label: t('Odometer'), minWidth: 100 },
        { id: 'status', label: t('Status'), minWidth: 100 },
        { id: 'source', label: t('Source'), minWidth: 100 },
        { id: 'reportDate', label: t('Report Date'), minWidth: 100 },
        { id: 'note', label: t('Note'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [searchVinId, setSearchVinId] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carStolenList, setcarStolenList] = useState<CarStolen[]>([]);
    const [showCarStolenReport, setShowCarStolenReport] = useState<CarStolen | null>(null)
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")

    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }

    
    const handleResetFilters = () => {
        setSearchStatus('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarStolenSearchParams = {
            vinID: searchVinId,
            status: searchStatus
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carStolenReportResponse: APIResponse = await ListCarStolenInsurance(token, page+1, connectAPIError, language, searchParams)
        if (carStolenReportResponse.error) {
            setError(carStolenReportResponse.error)
        } else {
            setcarStolenList(carStolenReportResponse.data)
            setPaging(carStolenReportResponse.pages)
            const responseCsv: APIResponse = await GetStolenInsuranceExcel(token, page+1, connectAPIError, language, searchParams)
            setData(responseCsv.data)
        }
        setLoading(false)
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
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
        <div className="pol-stolen-list-page">
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
                            <div className="reg-inspec-search-filter-item">
                                <label>{t('Status')}</label>
                                <select className="reg-inspec-search-bar" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                    <option value=''>{t('All')}</option>
                                    <option value={CAR_STOLEN_STATUS.Stolen}>{t('Stolen')}</option>
                                    <option value={CAR_STOLEN_STATUS.Found}>{t('Found')}</option>
                                </select>
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
                        <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                            {t('Car Stolen List')}
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
                                                        style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
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
                                                        style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
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
                                            <TableCell colSpan={9}>
                                                <div className="pol-crash-spinner"></div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={9}>
                                                {error}
                                                <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                            </TableCell>
                                        </TableRow>
                                    ) : carStolenList.length > 0 ? carStolenList
                                        .map((row, index1) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.carId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column, index) => {
                                                        if (column.id !== 'actions' && column.id !== 'status') {
                                                            let value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {value}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'status') {
                                                            let value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {value === 1 ? t('Found') : t('Stolen')}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'actions') {
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">
                                                                    <div className="pol-crash-modal-content-2-buttons">
                                                                    <button onClick={() => { setShowCarStolenReport(row) }} className="pol-crash-action-button">
                                                                        {t('Details')} <InfoIcon />
                                                                    </button>
                                                                    <button onClick={() => { navigate(`/insurance/car-report/${row.carId}`) }} className="pol-crash-action-button">
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
                                            <TableCell colSpan={9}>
                                                {t('No stolen car reports found')}
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
            {showCarStolenReport && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowCarStolenReport(null) }}>&times;</span>
                        <h2>{t('Car Stolen Report Details')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <>
                                <div className="pol-stolen-form-column">
                                    <label>Id</label>
                                    <TextField type="text" name="id" value={showCarStolenReport.id} disabled style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Description')}</label>
                                    <Textarea name="description" value={showCarStolenReport.description} disabled />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Car VIN')}</label>
                                    <TextField type="text" name="carId" value={showCarStolenReport.carId} disabled style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Note')}</label>
                                    <TextField type="text" name="note" value={showCarStolenReport.note} disabled style={{ width: '100%' }} size='small' />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Odometer')}</label>
                                    <TextField type="number" name="odometer" value={showCarStolenReport.odometer} disabled style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                                            <DatePicker label={t('Report Date')} defaultValue={dayjs(showCarStolenReport.reportDate)} disabled />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Status')}</label>
                                    <select name="status" value={showCarStolenReport.status ? showCarStolenReport.status : CAR_STOLEN_STATUS.Stolen} disabled style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                                        <option value={CAR_STOLEN_STATUS.Stolen}>{t('Stolen')}</option>
                                        <option value={CAR_STOLEN_STATUS.Found}>{t('Found')}</option>
                                    </select>
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            )}
            {paging && paging.TotalPages > 0 &&
                <div className="plate-search-page-row">
                    <button className="export-pol-crash-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                    <a
                        href={`data:text/csv;charset=utf-8,${escape(data)}`}
                        download={`stolen-${Date.now()}.csv`}
                        hidden
                        id="excel"
                    />
                </div>
            }
        </div>
    );
}

export default InsuranceCompanyStolenList;