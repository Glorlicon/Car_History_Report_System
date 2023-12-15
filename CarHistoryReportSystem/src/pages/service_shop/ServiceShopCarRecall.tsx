import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import RegistryRegistrationDetailsForm from '../../components/forms/registry/RegistryRegistrationDetailsForm';
import { AddCarRegistration, DownloadRegistrationExcelFile, EditCarRegistration, GetRegistrationExcel, ImportRegistrationFromExcel, ListCarRegistration } from '../../services/api/CarRegistration';
import { RootState } from '../../store/State';
import { APIResponse, CarRecalls, CarRecallSearchParams, CarRegistration, CarRegistrationSearchParams, Paging } from '../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/RegistryCarRegistration.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { Pagination } from '@mui/material';
import { ListServiceShopCarRecall } from '../../services/api/Recall';
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

interface Column {
    id: 'id' | 'modelId' | 'description' | 'recallDate';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function ServiceShopCarRecall() {
    const { t, i18n } = useTranslation();
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'modelId', label: t('ModelID'), minWidth: 100 },
        { id: 'description', label: t('Description'), minWidth: 100 },
        { id: 'recallDate', label: t('RecallDate'), minWidth: 100 }
    ];
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState<boolean>(false);
    const [recallList, setRecallList] = useState<CarRecalls[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [searchModelId, setSearchModelId] = useState('')
    const [searchRecallStartDate, setSearchRecallStartDate] = useState('')
    const [searchRecallEndDate, setSearchRecallEndDate] = useState('')

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
        const CarRecallReponse: APIResponse = await ListServiceShopCarRecall(token, page+1, connectAPIError, language, searchParams)
        if (CarRecallReponse.error) {
            setError(CarRecallReponse.error)
        } else {
            setRecallList(CarRecallReponse.data)
            setPaging(CarRecallReponse.pages)
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
                                            <TableCell colSpan={4}>
                                                <div className="pol-crash-spinner"></div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                {error}
                                                <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                            </TableCell>
                                        </TableRow>
                                    ) : recallList.length > 0 ? recallList
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column, index) => {
                                                        if (column.id !== 'recallDate') {
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
                                                        } 
                                                    })}
                                                </TableRow>
                                            );
                                        }) :
                                        <TableRow>
                                            <TableCell colSpan={4}>
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
        </div>
    );
}

export default ServiceShopCarRecall;