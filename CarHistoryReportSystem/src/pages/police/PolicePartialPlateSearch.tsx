import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
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
import { Car, Paging, PartialPlateSearchParams } from '../../utils/Interfaces';
import { PlateSearch } from '../../services/api/Car';
import '../../styles/PolicePlateSearch.css'
import { useNavigate } from 'react-router-dom';

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
const columns: readonly Column[] = [
    { id: 'licensePlateNumber', label: 'License Plate Number', minWidth: 170 },
    { id: 'vinId', label: 'VIN', minWidth: 100 },
    { id: 'modelId', label: 'modelId', minWidth: 100 }
];

function PolicePartialPlateSearch() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [page, setPage] = useState(0);
    const [searchVin, setSearchVin] = useState('')
    const [searchManufacturer, setSearchManufacturer] = useState('')
    const [searchModel, setSearchModel] = useState('')
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([])
    const [paging, setPaging] = useState<Paging>()
    const [plateLength, setPlateLength] = useState(7)
    const [plateCharacters, setPlateCharacters] = useState<string[]>(Array(plateLength).fill('*'));
    const [selectedRow, setSelectedRow] = useState<Car|null>();
    const handleCharacterChange = (value: string, position: number) => {
        if (value.length <= 1) {
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
        }
    };

    const updatePlateLength = (newLength: number) => {
        if (newLength !== plateLength) {
            setPlateLength(newLength);
            setPlateCharacters(Array(newLength).fill(''));
        }
    };
    const handleViewReport = () => {
        navigate(`/car-report/${selectedRow?.vinId}`)
    }


    const handleClearSearch = () => {
        setPlateCharacters(Array(plateLength).fill(''));
        setSearchManufacturer('')
        setSearchModel('')
        setSearchVin('')
    };
    const handleSearch = async() => {
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
            setPaging(response.pages)
        }
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <div className="pol-plate-search-page">
            <div className="pol-plate-search-action">
                <h2>Search by Partial Plate</h2>
                <div className="plate-length-selector">
                    <label>
                        Number of Plate Characters:
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
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by Manufacturer Name')}
                            value={searchManufacturer}
                            onChange={(e) => setSearchManufacturer(e.target.value)}
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('Model')}</label>
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by Car Model')}
                            value={searchModel}
                            onChange={(e) => setSearchModel(e.target.value)}
                        />
                    </div>
                </div>
                <div className="search-actions">
                    <button onClick={handleSearch}>Search License Plates</button>
                    <button onClick={handleClearSearch}>Clear Search</button>
                </div>
            </div>
            <div className="plate-search-page-row">
                <div className="plate-search-page-item-2">
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
                                    {carList.length > 0 ? carList
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.vinId} onClick={() => setSelectedRow(row)}>
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
                            rowsPerPageOptions={[2]}
                            component="div"
                            count={carList.length > 0 ? carList.length : 0}
                            rowsPerPage={2}
                            page={page}
                            onPageChange={handleChangePage}
                        />
                    </div>
                    <div className="plate-search-page-item-4">
                        <h3>Car Report</h3>
                        <div className="plate-view-report-button-div">
                            <button className="plate-view-report-button" onClick={handleViewReport}>View Report For Car</button>
                        </div>
                    </div>
                </div>
                <div className="plate-search-page-item">
                    <h3>Car Details</h3>
                    {selectedRow ?
                        <div className="dealer-car-sales-details-section">
                            <p>
                                <strong>VIN ID:</strong> {selectedRow.vinId}
                            </p>
                            <p>
                                <strong>License Plate Number:</strong> {selectedRow.licensePlateNumber}
                            </p>
                            <p>
                                <strong>Color:</strong> {selectedRow.colorName}
                            </p>
                            <p>
                                <strong>Current Odometer:</strong> {selectedRow.currentOdometer}
                            </p>
                            <p>
                                <strong>Engine Number:</strong> {selectedRow.engineNumber}
                            </p>
                            <p>
                                <strong>Modified:</strong> {selectedRow.isModified ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>CommercialUse:</strong> {selectedRow.isCommercialUse ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>Model ID:</strong> {selectedRow.modelId}
                            </p>
                        </div> :
                        <a>
                        Click on the car to see the details
                        </a>}
                </div>
            </div>
        </div>
  );
}

export default PolicePartialPlateSearch;