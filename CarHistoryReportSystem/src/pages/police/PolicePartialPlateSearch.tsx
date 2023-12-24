/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { APIResponse, Car, CarModel, Manufacturer, Paging, PartialPlateSearchParams } from '../../utils/Interfaces';
import { PlateSearch } from '../../services/api/Car';
import '../../styles/PolicePlateSearch.css'
import { useNavigate } from 'react-router-dom';
import { ListManufacturer, ListManufacturerModel } from '../../services/api/CarForSale';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface Column {
    id: 'licensePlateNumber' | 'vinId' | 'modelId' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
const getSearchPlate = (plateCharacters: string[]) => {
    const plateArrayCopy = [...plateCharacters];
    const separatorPosition = (plateArrayCopy.length === 7 || plateArrayCopy.length === 8) ? 3 : null;
    if (separatorPosition !== null) {
        plateArrayCopy.splice(3, 0, ' ');
    }
    for (let i = 0; i < plateArrayCopy.length; i++) {
        if (plateArrayCopy[i] === '') plateArrayCopy[i] = '*'
    }
    let result = plateArrayCopy.join('')
    return result
}

function PolicePartialPlateSearch() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [page, setPage] = useState(0);
    const [searchVin, setSearchVin] = useState('')
    const [searchManufacturer, setSearchManufacturer] = useState('')
    const [searchModel, setSearchModel] = useState('')
    const [selectedManu, setSelectedManu] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [manufacturerList, setManufacturerList] = useState<Manufacturer[]>([]);
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [carList, setCarList] = useState<Car[]>([])
    const [plateLength, setPlateLength] = useState(8)
    const [plateCharacters, setPlateCharacters] = useState<string[]>(Array(plateLength).fill('*'));
    const [selectedRow, setSelectedRow] = useState<Car | null>();
    const [message, setMessage] = useState('')
    const columns: readonly Column[] = [
        { id: 'licensePlateNumber', label: t('License Plate Number'), minWidth: 170 },
        { id: 'vinId', label: t('VIN'), minWidth: 100 },
        { id: 'modelId', label: t('modelId'), minWidth: 100 },
        { id: 'action', label: t('Action'), minWidth: 100 }
    ];
    const handleCharacterChange = (value: string, position: number) => {
        if (value.length === 1) {
            const updatedCharacters = [...plateCharacters];
            updatedCharacters[position] = value.toUpperCase();
            setPlateCharacters(updatedCharacters);
            if (position < plateCharacters.length - 1) {
                const nextInput = document.getElementById(`input-${position + 1}`);
                if (nextInput) {
                    (nextInput as HTMLInputElement).focus();
                }
            }
        } else if (value.charAt(0) === '*') {
            const updatedCharacters = [...plateCharacters];
            updatedCharacters[position] = value.charAt(1).toUpperCase();
            setPlateCharacters(updatedCharacters);
            if (position < plateCharacters.length - 1) {
                const nextInput = document.getElementById(`input-${position + 1}`);
                if (nextInput) {
                    (nextInput as HTMLInputElement).focus();
                }
            }
        } else if (value.length === 0) {
            const updatedCharacters = [...plateCharacters];
            updatedCharacters[position] = "*";
            setPlateCharacters(updatedCharacters);
        }
    };

    const updatePlateLength = (newLength: number) => {
        if (newLength !== plateLength) {
            setPlateLength(newLength);
            setPlateCharacters(Array(newLength).fill('*'));
        }
    };
    const handleViewReport = (vin: string) => {
        navigate(`/police/car-report/${vin}`)
    }
    const fetchData = async () => {
        const response: APIResponse = await ListManufacturer()
        setManufacturerList(response.data)
    }
    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Number(e.target.value);
        setSelectedManu(selectedValue);
        let make = manufacturerList.find(m => m.id === selectedValue)
        setSearchManufacturer(make ? make.name : '')
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const ManufacturerModelResponse: APIResponse = await ListManufacturerModel(connectAPIError, language, selectedValue);

        if (!ManufacturerModelResponse.error) {
            setModelList(ManufacturerModelResponse.data);
        }
    };
    const validatePlateSearch = (plate: string): boolean => {
        const wildCharacterCount = plate.split('*').length - 1
        if (wildCharacterCount > 2) return false
        else return true
    }
    const handleClearSearch = () => {
        setPlateCharacters(Array(plateLength).fill('*'));
        setSearchManufacturer('')
        setSearchModel('')
        setSearchVin('')
        setModelList([])
        setSelectedManu(0)
    };
    const handleSearch = async () => {
        if (!validatePlateSearch(getSearchPlate(plateCharacters))) {
            setError(t('Only maximum of 2 wildcard characters allowed'))
            setOpenError(true)
            return
        }
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: PartialPlateSearchParams = {
            manufacturer: searchManufacturer,
            model: searchModel,
            partialPlate: getSearchPlate(plateCharacters),
            partialVin: searchVin
        }
        const response = await PlateSearch(page, token, connectAPIError, language, searchParams)
        if (response.error) {
            setError(response.error)
            setOpenError(true)
        } else {
            setCarList(response.data)
            setMessage(t('Search succesfully. Please check the results'))
            setOpenSuccess(true)
            setPage(0)
        }
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
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
        fetchData()
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <div className="pol-plate-search-page">
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                    {message}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%', zIndex: '2000' }}>
                    {error}
                </MuiAlert>
            </Snackbar>
            <div className="pol-plate-search-action">
                <h2>{t('Search by Partial Plate')}</h2>
                <div className="plate-length-selector">
                    <label>
                        {t('Number of Plate Characters')}:
                        <input
                            type='number'
                            value={plateLength}
                            onChange={(e) => updatePlateLength(Number.parseInt(e.target.value))}
                            min="7"
                            max="8"
                        />
                    </label>
                </div>
                <div className="plate-inputs">
                    {plateCharacters.map((char, index) => (
                        <input
                            key={index}
                            id={`input-${index}`}
                            type="text"
                            maxLength={2}
                            value={char}
                            onChange={(e) => handleCharacterChange(e.target.value, index)}
                            className="plate-character-input"
                        />
                    ))}
                </div>
                <div className="plate-search-filters">
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
                        <label>{t('Manufacturer')}</label>
                        <select onChange={handleSelectChange} value={selectedManu} className="reg-inspec-search-bar">
                            <option value="">{t('All')}</option>
                            {manufacturerList.length > 0 ? (
                                manufacturerList.map((manufacturer, index) => (
                                    <option key={index} value={manufacturer.id}>{manufacturer.name}</option>
                                ))
                            ) : (
                                <option value="" disabled>{t('Loading')}...</option>
                            )}
                        </select>
                    </div>
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('Model')}</label>
                        <select
                            onChange={(e) => setSearchModel(e.target.value)}
                            disabled={modelList.length === 0}
                            value={searchModel}
                            className="reg-inspec-search-bar"
                        >
                            <option value="">{t('Any Model')}</option>
                            {modelList.length > 0 ? (
                                modelList.map((model, index) => (
                                    <option key={index} value={model.modelID}>{model.modelID}</option>
                                ))
                            ) : (
                                <option value="" disabled>{t('Loading')}...</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="search-actions-2">
                    <button onClick={handleSearch}>{t('Search License Plates')}</button>
                    <button onClick={handleClearSearch}>{t('Clear Search')}</button>
                </div>
            </div>
            <div className="plate-search-page-row">
                <div className="plate-search-page-item-2">
                    <div className="plate-search-page-item-3">
                        <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom: '15px', paddingTop: '15px' }}>
                            {t('Cars Found')}
                        </span>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'left' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {carList.length > 0 ? carList
                                        .map((row, index1) => {
                                            if (index1 >= 6 * page && index1 < 6 * (page + 1))
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.vinId} onClick={() => setSelectedRow(row)} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                        {columns.map((column) => {
                                                            if (column.id !== 'action') {
                                                                let value = row[column.id]
                                                                return (
                                                                    <TableCell
                                                                        key={column.id + '-' + index1}
                                                                        align={column.align}
                                                                        style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'left' }}
                                                                    >
                                                                        {value}
                                                                    </TableCell>
                                                                );
                                                            } else {
                                                                return (
                                                                    <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'left' }} sx={{ position: 'sticky', right: 0, background: index1 % 2 === 1 ? 'white' : '#E1E1E1', borderRight: selectedRow === row ? '5px solid blue' : 'None' }} component="th" scope="row">
                                                                        <button className="pol-crash-action-button-2" style={{ fontSize: '15px' }} onClick={() => { handleViewReport(row.vinId) }} >{t('View Report For Car')}</button>
                                                                    </TableCell>
                                                                )
                                                            }
                                                        })}
                                                    </TableRow>
                                                );
                                        }) :
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                {t('No cars found')}
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[6]}
                            component="div"
                            count={carList.length > 0 ? carList.length : 0}
                            rowsPerPage={6}
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
                <div className="plate-search-page-item">
                    <h3 style={{ textAlign: 'center', borderBottom: '1px solid gray', justifyItems: 'center', fontSize: '25px', color: 'gray' }}>{t('Car Details')}</h3>
                    {selectedRow ? (
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap', paddingBottom:'5%', marginLeft:'5%', marginRight:'5%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('VIN')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.vinId ? selectedRow.vinId : t('None')}</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('License Plate Number')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.licensePlateNumber ? selectedRow.licensePlateNumber : t('None')}</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('Color')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.colorName ? selectedRow.colorName : t('None')}</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('Current Odometer')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.currentOdometer ? selectedRow.currentOdometer + ' KM' : t('None')}</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('Engine Number')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.engineNumber ? selectedRow.engineNumber : t('None')}</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('Modified')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.isModified ? t('Yes') : t('No')}</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('Commercial Use')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.isCommercialUse ? t('Yes') : t('No')}</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', textAlign: 'left', width: '50%' }}>
                                <h2 style={{fontSize:'30px'}}>{t('Model ID')}</h2>
                                <a style={{ fontSize:'20px',color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRow.modelId ? selectedRow.modelId : t('None')}</a>
                            </div>
                        </div>
                    ) : (
                        <a>
                            
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PolicePartialPlateSearch;