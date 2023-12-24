import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { APIResponse, CarModel, CarRecalls, CarRecallStatus, CarServiceHistory, CarServices, Paging, RecallStatus, ServiceCarRecalls, Services, ServiceSearchParams } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import '../../styles/ManufacturerCarModels.css'
import { CreateServiceHistory, EditCarServices, GetCarRecalls, ListServices, ListServiceShopHistory, UpdateCarRecallStatus } from '../../services/api/CarServiceHistory';
import CarServiceModal from '../../components/forms/carservice/CarServiceModal';
import { isValidVIN } from '../../utils/Validators';
import { useTranslation } from 'react-i18next';
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
    id: 'id' | 'carId' | 'servicesName' | 'otherServices' | 'serviceTime' | 'reportDate' | 'odometer' | 'note' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function ServiceShopHistory() {
    const { t, i18n } = useTranslation();
    const stickyCellStyle = {
        position: "sticky",
        right: 0,
    };
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'carId', label: t('VIN'), minWidth: 50 },
        { id: 'servicesName', label: t('Main Services'), minWidth: 50 },
        { id: 'otherServices', label: t('Other Services'), minWidth: 50 },
        { id: 'serviceTime', label: t('Service Time'), minWidth: 50 },
        { id: 'reportDate', label: t('Report Date'), minWidth: 50 },
        { id: 'odometer', label: t('Odometer'), minWidth: 50 },
        { id: 'note', label: t('Note'), minWidth: 50 },
        { id: 'action', label: t('Actions'), minWidth: 50 }
    ];
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [carServiceHistory, setCarServiceHistory] = useState<CarServiceHistory[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [page, setPage] = useState(0)
    const [resetTrigger, setResetTrigger] = useState(0);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [totalServices, setTotalServices] = useState<Services[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editCarService, setEditCarService] = useState<CarServiceHistory | null>(null)
    const serviceShopId = JWTDecoder(token).nameidentifier
    const [searchServiceStartDate, setSearchServiceStartDate] = useState('')
    const [searchServiceEndDate, setSearchServiceEndDate] = useState('')
    const [availableServices, setAvailableServices] = useState<Services[]>([])
    const [searchVin, setSearchVin] = useState('')
    const [newServiceHistory, setNewServiceHistory] = useState<CarServiceHistory>({
        carId: "",
        note: "",
        odometer: 0,
        otherServices: "",
        serviceTime: "",
        reportDate: "",
        services: 0,
        servicesName: ""
    })
    const [remainingRecalls, setRemainingRecalls] = useState<CarRecallStatus[]>([])
    const [selectedRecalls, setSelectedRecalls] = useState<CarRecallStatus[]>([])
    const [totalRecalls, setTotalRecalls] = useState<CarRecallStatus[]>([])

    const validateCarService = (service: CarServiceHistory): boolean => {
        if (!isValidVIN(service.carId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!service.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!service.reportDate) {
            setAddError(t('Report Date must be chosen'));
            return false;
        }
        if (!service.serviceTime) {
            setAddError(t('Service Date must be chosen'));
            return false;
        }
        if (service.services === 0) {
            setAddError(t('Please choose at least 1 service'));
            return false;
        }
        return true;
    };
    const handleCloseModal = () => {
        setAddError('')
        setError('')
        setEditCarService(null)
        setNewServiceHistory({
            carId: "",
            note: "",
            odometer: 0,
            otherServices: "",
            serviceTime: "",
            reportDate: "",
            services: 0,
            servicesName: ""
        })
        setSelectedRecalls([])
        setShowModal(false)
        setRemainingRecalls([])
        setTotalRecalls([])
        setAvailableServices(totalServices)
    }

    const handleRemoveService = (value: number) => {
        if (editCarService) {
            setEditCarService({
                ...editCarService,
                services: editCarService.services - value,
            });
        } else {
            setNewServiceHistory({
                ...newServiceHistory,
                services: newServiceHistory.services - value,
            });

        }
        setAvailableServices([
            ...availableServices,
            ...totalServices.filter(s => s.value === value)
        ].sort((a, b) => a.value - b.value))
        //case for removing car recall repair
        if (value === 16) {
            setSelectedRecalls([])
            setRemainingRecalls(totalRecalls)
        }
    };
    const handleAddService = async (value: number) => {
        setAddError('')
        //case for choosing car recall repair
        if (value === 16) {
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            if (editCarService) {
                //nothing
            } else {
                if (!newServiceHistory.carId || !isValidVIN(newServiceHistory.carId)) {
                    setAddError(t('VIN is invalid. Please enter valid VIN to get car recalls!'))
                    return
                }
                const response: APIResponse = await GetCarRecalls(newServiceHistory.carId, token, connectAPIError, language);
                if (response.error) {
                    setAddError(response.error)
                } else {
                    setNewServiceHistory({
                        ...newServiceHistory,
                        services: newServiceHistory.services + value,
                    });
                    setTotalRecalls(response.data)
                    setRemainingRecalls(response.data)
                    setAvailableServices(availableServices.filter(s => s.value !== value))
                }
            }
        } else {
            if (editCarService) {
                setEditCarService({
                    ...editCarService,
                    services: editCarService.services + value,
                });
            } else {
                setNewServiceHistory({
                    ...newServiceHistory,
                    services: newServiceHistory.services + value,
                });
            }
            setAvailableServices(availableServices.filter(s => s.value !== value))
        }
    };
    //both only happen for new car service
    const handleAddRecall = (id: number) => {
        let index = remainingRecalls.findIndex(item => item.carRecallId === id)
        const [selectedRecall] = remainingRecalls.splice(index, 1)
        setSelectedRecalls([...selectedRecalls, selectedRecall])
    }
    const handleRemoveRecall = (id: number) => {
        let index = selectedRecalls.findIndex(item => item.carRecallId === id)
        const [selectedRecall] = selectedRecalls.splice(index, 1)
        setRemainingRecalls([...remainingRecalls, selectedRecall])
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (editCarService) {
            setEditCarService({
                ...editCarService,
                [e.target.name]: e.target.value,
            });
        } else {
            setNewServiceHistory({
                ...newServiceHistory,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleDateChange = (date: string, type: string) => {
        if (type === 'reportDate') {
            if (editCarService) {
                setEditCarService({
                    ...editCarService,
                    reportDate: date
                })
            } else {
                setNewServiceHistory({
                    ...newServiceHistory,
                    reportDate: date,
                });
            }
        } else if (type === 'serviceTime') {
            if (editCarService) {
                setEditCarService({
                    ...editCarService,
                    serviceTime: date
                })
            } else {
                setNewServiceHistory({
                    ...newServiceHistory,
                    serviceTime: date,
                });
            }
        }
    }
    const handleServiceClickEdit = async () => {
        if (editCarService != null && validateCarService(editCarService)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarServices(editCarService, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setMessage(t('Edit service history successfully'))
                setOpenSuccess(true)
                handleCloseModal()
                fetchData();
            }
        }
    }
    const handleServiceClick = async () => {
        if (newServiceHistory != null && validateCarService(newServiceHistory)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            let temp = {
                ...newServiceHistory
            }
            if (selectedRecalls.length > 0) {
                await Promise.all(selectedRecalls.map(async (recall) => {
                    let res: APIResponse = await UpdateCarRecallStatus(newServiceHistory.carId, recall.carRecallId, token, connectAPIError, language)
                    if (!res.error) {
                        temp.note = temp.note + `${t(' Repair Recall ')}${recall.carRecallId}`
                    }
                }))
            }
            const response: APIResponse = await CreateServiceHistory(temp, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setMessage(t('Add service history successfully'))
                setOpenSuccess(true)
                handleCloseModal()
                fetchData();
            }
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: ServiceSearchParams = {
            carId: searchVin,
            serviceTimeStart: searchServiceStartDate,
            serviceTimeEnd: searchServiceEndDate
        }
        const carServiceHistoryReponse: APIResponse = await ListServiceShopHistory(serviceShopId, token, page + 1, connectAPIError, language, searchParams)
        const carServicesReponse: APIResponse = await ListServices()
        if (carServiceHistoryReponse.error || carServicesReponse.error) {
            if (carServiceHistoryReponse.error)
                setError(carServiceHistoryReponse.error)
            else if (carServicesReponse.error)
                setError(carServicesReponse.error)
        } else {
            setCarServiceHistory(carServiceHistoryReponse.data)
            setPaging(carServiceHistoryReponse.pages)
            setTotalServices(carServicesReponse.data)
            setAvailableServices(carServicesReponse.data);
        }
        setLoading(false)
    };
    const handleResetFilters = () => {
        setSearchVin('')
        setSearchServiceStartDate('')
        setSearchServiceEndDate('')
        setResetTrigger(prev => prev + 1);
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
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop:'200px' }}>
                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                    {message}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop: '200px' }}>
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
                        <Typography style={{ fontWeight: 'bold' }}>+ {t('Add New Car Service')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {t('Add Manually')}
                        </Typography>
                        <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>{t('Add New Car Service')}</button>
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
                                <label>{t('VIN')}</label>
                                <input
                                    type="text"
                                    className="reg-inspec-search-bar"
                                    placeholder={t('Search by VIN')}
                                    value={searchVin}
                                    onChange={(e) => setSearchVin(e.target.value)}
                                />
                            </div>
                            <div className="reg-inspec-search-filter-item-2">
                                <label>{t('ServiceDate')}</label>
                                <div className="reg-inspec-search-filter-item-2-dates">
                                    <label>{t('From')}: </label>
                                    <input
                                        type="date"
                                        className="reg-inspec-search-bar"
                                        value={searchServiceStartDate}
                                        onChange={(e) => setSearchServiceStartDate(e.target.value)}
                                    />
                                    <label>{t('To')}: </label>
                                    <input
                                        type="date"
                                        className="reg-inspec-search-bar"
                                        value={searchServiceEndDate}
                                        onChange={(e) => setSearchServiceEndDate(e.target.value)}
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
                        <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom:'15px',paddingTop:'15px' }}>
                            {t('Performed Car Services List')}
                        </span>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => {
                                            if (column.id !== 'action') {
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
                                    ) : carServiceHistory.length > 0 ? carServiceHistory
                                        .map((row, index1) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column, index) => {
                                                        if (column.id !== 'action' && column.id !== 'serviceTime' && column.id !== 'servicesName') {
                                                            let value = row[column.id]
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                    {value}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'serviceTime') {
                                                            let value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                    {value.split('T')[0]}
                                                                </TableCell>
                                                            )
                                                        } else if (column.id === 'servicesName') {
                                                            let translatedServices: string[] = []
                                                            let value = row[column.id].split(', ');
                                                            value.map((service, index) => {
                                                                translatedServices[index] = t(service)
                                                            })
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                    {translatedServices.join(', ')}
                                                                </TableCell>
                                                            )
                                                        }  else if (column.id === 'action') {
                                                            return (
                                                                <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1' }} component="th" scope="row">

                                                                    <button onClick={() => { setEditCarService(row) }} disabled={adding} className="pol-crash-action-button">
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
                                            <TableCell colSpan={9}>
                                                {t('No Car Service History found')}
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                        style={{backgroundColor:'white', borderBottomLeftRadius:'10px', borderBottomRightRadius:'10px'}}
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
                            handleCloseModal()
                        }}>&times;</span>
                        <h2>{t('Add Car Services')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <CarServiceModal
                                action="Add"
                                totalServices={totalServices}
                                availableServices={availableServices}
                                model={newServiceHistory}
                                handleInputChange={handleInputChange}
                                handleDateChange={handleDateChange}
                                handleRemoveService={handleRemoveService}
                                handleAddService={handleAddService}
                                remainingRecalls={remainingRecalls}
                                totalRecalls={totalRecalls}
                                selectedRecalls={selectedRecalls}
                                handleAddRecall={handleAddRecall}
                                handleRemoveRecall={handleRemoveRecall}
                            />
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            <button onClick={() => { handleServiceClick()} } disabled={adding} className="ad-manu-add-btn">
                                {adding ? (
                                    <div className="ad-manu-inline-spinner"></div>
                                ) : t('Finish')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editCarService && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => {
                            handleCloseModal()
                        }}>&times;</span>
                        <h2>{t('Edit Car Services')}</h2>
                        <div className="pol-crash-modal-content-2">
                            <CarServiceModal
                                action="Edit"
                                totalServices={totalServices}
                                availableServices={availableServices}
                                model={editCarService}
                                handleInputChange={handleInputChange}
                                handleDateChange={handleDateChange}
                                handleRemoveService={handleRemoveService}
                                handleAddService={handleAddService}
                                remainingRecalls={remainingRecalls}
                                totalRecalls={totalRecalls}
                                selectedRecalls={selectedRecalls}
                                handleAddRecall={handleAddRecall}
                                handleRemoveRecall={handleRemoveRecall}
                            />
                            {addError && (
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                    {addError}
                                </MuiAlert>
                            )}
                            <button onClick={() => { handleServiceClickEdit() }} disabled={adding} className="ad-manu-add-btn">
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

export default ServiceShopHistory;