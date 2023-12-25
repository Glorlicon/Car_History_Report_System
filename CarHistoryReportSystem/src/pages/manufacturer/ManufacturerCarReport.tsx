import { Snackbar, Accordion, AccordionSummary, Typography, AccordionDetails, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AddCar, AddOldCarToStorage, CheckCar, EditCar, ListCarByManu, ListDealerCarStorage } from "../../services/api/Car";
import { ListManufacturerModel, ListManufacturer } from "../../services/api/CarForSale";
import { ListAllCarModels } from "../../services/api/CarModel";
import { RootState } from "../../store/State";
import { Paging, CarModel, Manufacturer, Car, APIResponse, CarModelSearchParams, CarStorageSearchParams, CarManuSearchParams } from "../../utils/Interfaces";
import { JWTDecoder } from "../../utils/JWTDecoder";
import { isValidVIN } from "../../utils/Validators";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAlert from '@mui/material/Alert';
interface Column {
    id: 'vinId' | 'modelId' | 'colorName' | 'currentOdometer' | 'engineNumber' | 'isModified'
    | 'isCommercialUse' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function ManufacturerCarReport() {
    const { t, i18n } = useTranslation()
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const columns: readonly Column[] = [
        { id: 'vinId', label: t('VIN'), minWidth: 100 },
        { id: 'modelId', label: t('Model ID'), minWidth: 100 },
        { id: 'colorName', label: t('Color'), minWidth: 100 },
        { id: 'currentOdometer', label: t('Odometer'), minWidth: 100 },
        { id: 'engineNumber', label: t('Engine Number'), minWidth: 100 },
        { id: 'isModified', label: t('Modified'), minWidth: 100 },
        { id: 'isCommercialUse', label: t('Commercial Use'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [searchManufacturer, setSearchManufacturer] = useState('')
    const [searchVin, setSearchVin] = useState('')
    const [searchModel, setSearchModel] = useState('')
    const [searchOdometerMin, setSearchOdometerMin] = useState('')
    const [searchOdometerMax, setSearchOdometerMax] = useState('')
    const [searchReleaseDateMin, setSearchReleaseDateMin] = useState('')
    const [searchReleaseDateMax, setSearchReleaseDateMax] = useState('')
    const [searchModelList, setSearchModelList] = useState<CarModel[]>([])
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);




    const handleResetFilters = () => {
        setSearchManufacturer('')
        setSearchModel('')
        setSearchOdometerMax('')
        setSearchOdometerMin('')
        setSearchReleaseDateMax('')
        setSearchReleaseDateMin('')
        setSearchVin('')
        setSearchModelList([])
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: CarManuSearchParams = {
            vin: searchVin,
            model: searchModel,
            odometerMax: searchOdometerMax,
            odometerMin: searchOdometerMin,
            releaseDateMax: searchReleaseDateMax,
            releaseDateMin: searchReleaseDateMin
        }
        const carListResponse: APIResponse = await ListCarByManu(id, token, page + 1, connectAPIError, language, searchParams)
        if (carListResponse.error) {
            setError(carListResponse.error)
        } else {
            const ManufacturerModelResponse: APIResponse = await ListManufacturerModel(connectAPIError, language, id);
            if (!ManufacturerModelResponse.error) {
                setSearchModelList(ManufacturerModelResponse.data);
            }
            setCarList(carListResponse.data)
            setPaging(carListResponse.pages)
        }
        setLoading(false)
    }
    const [vin, setVin] = useState('')
    const [vinError, setVinError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleVINCheck = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        if (!vin) {
            setVinError(t('Please enter VIN'));
        } else if (!isValidVIN(vin)) {
            setVinError(t('The VIN entered is invalid. Please check and try again'));
        } else {
            const checkCar: APIResponse = await CheckCar(vin, connectAPIError, language)
            if (checkCar.error) {
                setVinError(checkCar.error)
                return
            }
            setVinError(null);
            setIsLoading(true);
            navigate(`/manufacturer/car-report/${vin}`)
        }
    };
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
            <div style={{maxWidth:'600px',margin:'0 auto',padding:'20px',fontFamily:'Arial, sans-serif'}}>
                <h2>{t('Car History Reports')}</h2>
                <a>{t('View detailed information about the car using CHRS Report')}</a>
                <div className="report-search-section">
                    <label>{t('Search by VIN')}</label>
                    <input type="text" value={vin} onChange={(e) => setVin(e.target.value)} placeholder={t('Enter VIN')} />
                    <button onClick={handleVINCheck}>
                        {isLoading ? (
                            <div className="report-loading-spinner"></div>
                        ) : (
                            t('Get CHRS Report')
                        )}
                    </button>
                    {vinError &&
                        <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%', zIndex: '2000', marginTop: '5px' }}>
                            {vinError}
                        </MuiAlert>}
                </div>
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
                        <div className="reg-inspec-search-filter-container-3">
                            <div className="reg-inspec-search-filter-container-2">
                                <div className="reg-inspec-search-filter-item-2">
                                    <label>{t('Release Year')}</label>
                                    <div className="reg-inspec-search-filter-item-2-dates">
                                        <label>{t('From')}: </label>
                                        <input
                                            type="number"
                                            className="reg-inspec-search-bar"
                                            value={searchReleaseDateMin}
                                            onChange={(e) => setSearchReleaseDateMin(e.target.value)}
                                            min="1900"
                                            max="2099"
                                            step="1"
                                        />
                                        <label>{t('To')}: </label>
                                        <input
                                            type="number"
                                            className="reg-inspec-search-bar"
                                            value={searchReleaseDateMax}
                                            onChange={(e) => setSearchReleaseDateMax(e.target.value)}
                                            min="1900"
                                            max="2099"
                                            step="1"
                                        />
                                    </div>
                                </div>
                                <div className="reg-inspec-search-filter-item-2">
                                    <label>{t('Odometer')}</label>
                                    <div className="reg-inspec-search-filter-item-2-dates">
                                        <label>{t('From')}: </label>
                                        <input
                                            type="number"
                                            className="reg-inspec-search-bar"
                                            value={searchOdometerMin}
                                            onChange={(e) => setSearchOdometerMin(e.target.value)}
                                            min="0"
                                        />
                                        <label>{t('To')}: </label>
                                        <input
                                            type="number"
                                            className="reg-inspec-search-bar"
                                            value={searchOdometerMax}
                                            onChange={(e) => setSearchOdometerMax(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="reg-inspec-search-filter-container-2">
                                <div className="reg-inspec-search-filter-item">
                                    <label>{t('Car ID')}</label>
                                    <input
                                        type="text"
                                        className="reg-inspec-search-bar"
                                        placeholder={t('Search by Car ID')}
                                        value={searchVin}
                                        onChange={(e) => setSearchVin(e.target.value)}
                                    />
                                </div>
                                <div className="reg-inspec-search-filter-item">
                                    <label>{t('Car Model')}</label>
                                    <select
                                        className="reg-inspec-search-bar"
                                        onChange={(e) => setSearchModel(e.target.value)}
                                        disabled={searchModelList.length === 0}
                                        value={searchModel}
                                    >
                                        <option value="">{t('Any Model')}</option>
                                        {searchModelList.length > 0 ? (
                                            searchModelList.map((model, index) => (
                                                <option key={index} value={model.modelID}>{model.modelID}</option>
                                            ))
                                        ) : (
                                            <option value="" disabled>{t('Loading')}...</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="reg-inspec-search-filter-item-4">
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
                        <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom: '15px', paddingTop: '15px' }}>
                            {t('Car List')}
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
                                            <TableCell colSpan={8}>
                                                <div className="pol-crash-spinner"></div>
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                {error}
                                                <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                            </TableCell>
                                        </TableRow>
                                    ) : carList.length > 0 ? carList
                                        .map((row, index1) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.vinId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column, index) => {
                                                        if (column.id !== 'actions' && column.id !== 'isModified' && column.id !== 'isCommercialUse') {
                                                            let value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                    {value}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'isModified' || column.id === 'isCommercialUse') {
                                                            let value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                    {value ? t('Yes') : t('No')}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'actions') {
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">
                                                                    <button onClick={() => { navigate(`/manufacturer/car-report/${row.vinId}`) }} className="pol-crash-action-button-2">
                                                                        {t('View Report For Car')}
                                                                    </button>
                                                                </TableCell>
                                                            )
                                                        }
                                                    })}
                                                </TableRow>
                                            );
                                        }) :
                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                {t('No cars found')}
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
        </div>
    );
}
export default ManufacturerCarReport