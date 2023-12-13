import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GetCrashInsuranceExcel, ListCarCrashInsurance } from '../../services/api/CarCrash';
import { RootState } from '../../store/State';
import { CAR_SIDES } from '../../utils/const/CarSides';
import { APIResponse, CarCrash, CarCrashSearchParams, Paging } from '../../utils/Interfaces';
import car from '../../car.jpg'
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
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
import Textarea from '@mui/joy/Textarea';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

interface Column {
    id: 'id' | 'carId' | 'location' | 'serverity' | 'description' | 'damageLocation' | 'accidentDate' | 'odometer' | 'reportDate' | 'note' | 'source' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function InsuranceCompanyCrashList() {
    const navigate = useNavigate()
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
        { id: 'source', label: t('Source'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carCrashList, setCarCrashList] = useState<CarCrash[]>([]);
    const [modalPage, setModalPage] = useState(1);
    const [searchVinId, setSearchVinId] = useState('')
    const [searchMinSeverity, setSearchMinSeverity] = useState('')
    const [searchMaxSeverity, setSearchMaxSeverity] = useState('')
    const [searchCrashStartDate, setSearchStartDate] = useState('')
    const [searchCrashEndDate, setSearchEndDate] = useState('')
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [showCarCrashReport, setShowCarCrashReport] = useState<CarCrash | null>(null)
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }

    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } 
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };

    const handleResetFilters = () => {
        setSearchEndDate('')
        setSearchMaxSeverity('')
        setSearchMinSeverity('')
        setSearchStartDate('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }
    const isSideColored = (sideValue: number): boolean => {
        if (showCarCrashReport)
            return (showCarCrashReport.damageLocation & sideValue) === sideValue;
        else return false
    };
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
        const carCrashReportResponse: APIResponse = await ListCarCrashInsurance(token, page+1, connectAPIError, language, searchParams)
        if (carCrashReportResponse.error) {
            setError(carCrashReportResponse.error)
        } else {
            setCarCrashList(carCrashReportResponse.data)
            setPaging(carCrashReportResponse.pages)
            const responseCsv: APIResponse = await GetCrashInsuranceExcel(token, page+1, connectAPIError, language, searchParams)
            setData(responseCsv.data)
        }
        setLoading(false)
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    function valuetext(value: number) {
        return `${value}%`;
    }
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
                            {t('Car Crash List')}
                        </span>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column,index) => (
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
                                            <TableCell colSpan={12}>
                                                <div className="pol-crash-spinner"></div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={12}>
                                                {error}
                                                <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                            </TableCell>
                                        </TableRow>
                                    ) : carCrashList.length > 0 ? carCrashList
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.carId+'-'+index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column, index) => {
                                                        if (column.id !== 'actions' && column.id !== 'damageLocation') {
                                                            let value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id+'-'+index} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {column.id === 'serverity' && typeof value === 'number' ? `${value*100}%` : value}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'damageLocation') {
                                                            let value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                    {getCarSides(value)}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'actions') {
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                    <div className="pol-crash-modal-content-2-buttons">
                                                                    <button onClick={() => { setShowCarCrashReport(row) }} className="pol-crash-action-button">
                                                                        {t('Details')} <InfoIcon/>
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
                                            <TableCell colSpan={12}>
                                                {t('No car crash report found')}
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
            {showCarCrashReport && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowCarCrashReport(null); setModalPage(1) }}>&times;</span>
                        <h2>{t('Car Crash Report Details')}</h2>
                        <div className="pol-crash-modal-content-2">
                            {modalPage === 1 && (
                                <>
                                        <div className="pol-crash-form-column">
                                            <label>Id</label>
                                            <TextField type="text" name="id" value={showCarCrashReport.id} disabled style={{ width: '100%' }} size='small' />
                                        </div>
                                        <div className="pol-crash-form-column">
                                            <label>{t('Description')}</label>
                                            <Textarea name="description" value={showCarCrashReport.description} disabled />
                                        </div>
                                        <div className="pol-crash-form-column">
                                            <label>{t('Car VIN')}</label>
                                            <TextField type="text" name="carId" value={showCarCrashReport.carId} disabled style={{ width: '100%' }} size='small' />
                                        </div>
                                        <div className="pol-crash-form-column">
                                            <label>{t('Note')}</label>
                                            <TextField type="text" name="note" value={showCarCrashReport.note} disabled style={{ width: '100%' }} size='small' />
                                        </div>
                                        <div className="pol-crash-form-column">
                                            <label>{t('Odometer')}</label>
                                            <TextField type="number" name="odometer" value={showCarCrashReport.odometer} disabled style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                                        </div>
                                        <div className="pol-crash-form-column">
                                            <label>{t('Source')}</label>
                                            <TextField type="text" name="source" value={showCarCrashReport.source} disabled style={{ width: '100%' }} size='small' />
                                        </div>
                                        <div className="pol-crash-form-column">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                <DatePicker label={t('Accident Date')} defaultValue={dayjs(showCarCrashReport.accidentDate)} disabled/>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        </div>
                                        <div className="pol-crash-form-column">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                <DatePicker label={t('Report Date')} defaultValue={dayjs(showCarCrashReport.reportDate)} disabled />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        </div>
                                </>
                            )}
                            {modalPage === 2 && (
                                <>
                                        <div className="pol-crash-form-column">
                                            <label>{t('Location')}</label>
                                            <TextField type="text" name="location" value={showCarCrashReport.location} disabled style={{ width: '100%' }} size='small' />
                                        </div>
                                        <div className="pol-crash-form-column">
                                        <label>{t('Severity')} (%)</label>
                                        <Slider defaultValue={showCarCrashReport.serverity * 100} aria-label="Always visible" valueLabelDisplay="on" min={0} max={100} marks={[{ value: 0, label: t('Low') }, { value: 50, label: t('Medium') }, { value: 100, label: t('High') }]} getAriaValueText={valuetext} size='medium' disabled />
                                        </div>
                                        <div className="pol-crash-form-column">
                                            <label>{t('Damage Location')}</label>
                                            <div className="pol-crash-car-container">
                                                <img src={car} alt="Car" className="pol-crash-car-image" style={{
                                                    borderTop: `5px solid ${isSideColored(CAR_SIDES.Front) ? 'red' : 'black'}`,
                                                    borderBottom: `5px solid ${isSideColored(CAR_SIDES.Rear) ? 'red' : 'black'}`,
                                                    borderLeft: `5px solid ${isSideColored(CAR_SIDES.Left) ? 'red' : 'black'}`,
                                                    borderRight: `5px solid ${isSideColored(CAR_SIDES.Right) ? 'red' : 'black'}`,
                                                }} />
                                            <div className="pol-crash-checkboxes">
                                                {Object.entries(CAR_SIDES).map(([key, value]) => (
                                                    <label key={key}>
                                                        {t(key.charAt(0).toUpperCase() + key.slice(1))}
                                                        <input
                                                            type="checkbox"
                                                            checked={isSideColored(value)}
                                                            disabled
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                            </div>
                                        </div>
                                </>
                            )}
                            <div className="pol-crash-modal-content-2-buttons">
                                <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                                    {t('Previous')}
                                </button>
                                <button onClick={handleNextPage} disabled={modalPage === 2} className="pol-crash-model-next-btn">
                                    {t('Next')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {paging && paging.TotalPages > 0 &&
                <div className="plate-search-page-row">
                    <button className="export-pol-crash-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                    <a
                        href={`data:text/csv;charset=utf-8,${escape(data)}`}
                        download={`crash-${Date.now()}.csv`}
                        hidden
                        id="excel"
                    />
                </div>
            }
        </div>
    )
}

export default InsuranceCompanyCrashList;