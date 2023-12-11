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

interface Column {
    id: 'licensePlateNumber' | 'vinId' | 'modelId';
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
        if (plateArrayCopy[i] === '') plateArrayCopy[i]='*'
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
    const [plateLength, setPlateLength] = useState(7)
    const [plateCharacters, setPlateCharacters] = useState<string[]>(Array(plateLength).fill('*'));
    const [selectedRow, setSelectedRow] = useState<Car | null>();
    const columns: readonly Column[] = [
        { id: 'licensePlateNumber', label: t('License Plate Number'), minWidth: 170 },
        { id: 'vinId', label: t('VIN'), minWidth: 100 },
        { id: 'modelId', label: t('modelId'), minWidth: 100 }
    ];
    const handleCharacterChange = (value: string, position: number) => {
        console.log("Value", value.length)
        if (value.length === 1) {
            console.log('Here1')
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
            console.log('Here2')
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
            console.log("empty")
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
    const handleViewReport = () => {
        navigate(`/car-report/${selectedRow?.vinId}`)
    }
    const fetchData = async() => {
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
            setError('Invalid number of wildcard characters')
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
        } else {
            setCarList(response.data)
            setPage(0)
        }
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    useEffect(() => {
        fetchData()
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <div className="pol-plate-search-page">
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
                {error && (
                    <p className="pol-stolen-error">{error}</p>
                )}
                <div className="search-actions">
                    <button onClick={handleSearch}>{t('Search License Plates')}</button>
                    <button onClick={handleClearSearch}>{t('Clear Search')}</button>
                </div>
            </div>
            <div className="plate-search-page-row">
                <div className="plate-search-page-item-2">
                    <div className="plate-search-page-item-3">
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                                            {t('Cars Found')}
                                            </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {carList.length > 0 ? carList
                                        .map((row, index) => {
                                            if (index >= 3 * page && index < 3*(page+1))
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.vinId} onClick={() => setSelectedRow(row)} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id] ? row[column.id]?.toString() : 'Unknown';
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {value}
                                                            </TableCell>
                                                        );
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
                            rowsPerPageOptions={[3]}
                            component="div"
                            count={carList.length > 0 ? carList.length : 0}
                            rowsPerPage={3}
                            page={page}
                            onPageChange={handleChangePage}
                            labelDisplayedRows={
                                ({ from, to, count }) => {
                                    return '' + from + '-' + to +' '+ t('of') + ' ' +count
                                }
                            }
                        />
                    </div>
                    <div className="plate-search-page-item-4">
                        <h3>{t('Car Report')}</h3>
                        {selectedRow ? 
                            <div className="plate-view-report-button-div">
                                {t('Click on button to see report for car ') + selectedRow.vinId}
                                <button className="plate-view-report-button" onClick={handleViewReport} disabled={selectedRow ? false : true}>{t('View Report For Car')}</button>
                            </div> :
                        <a>
                                {t('Click on the car to see able to access car report')}
                        </a>}
                    </div>
                </div>
                <div className="plate-search-page-item">
                    <h3>{t('Car Details')}</h3>
                    {selectedRow ?
                        <div className="dealer-car-sales-details-section">
                            <p>
                                <strong>{t('VIN')}:</strong> {selectedRow.vinId}
                            </p>
                            <p>
                                <strong>{t('License Plate Number')}:</strong> {selectedRow.licensePlateNumber}
                            </p>
                            <p>
                                <strong>{t('Color')}:</strong> {selectedRow.colorName}
                            </p>
                            <p>
                                <strong>{t('Current Odometer')}:</strong> {selectedRow.currentOdometer}
                            </p>
                            <p>
                                <strong>{t('Engine Number')}:</strong> {selectedRow.engineNumber}
                            </p>
                            <p>
                                <strong>{t('Modified')}:</strong> {selectedRow.isModified ? t('Yes') : t('No')}
                            </p>
                            <p>
                                <strong>{t('Commercial Use')}:</strong> {selectedRow.isCommercialUse ? t('Yes') : t('No')}
                            </p>
                            <p>
                                <strong>{t('Model ID')}:</strong> {selectedRow.modelId}
                            </p>
                        </div> :
                        <a>
                            {t('Click on the car to see the details')}
                        </a>}
                </div>
            </div>
        </div>
  );
}

export default PolicePartialPlateSearch;