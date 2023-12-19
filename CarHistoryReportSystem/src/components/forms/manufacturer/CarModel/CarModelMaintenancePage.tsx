import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, ModelMaintenance } from '../../../../utils/Interfaces';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField'
import TableRow from '@mui/material/TableRow';
interface CarModelMaintenancePageProps {
    model: CarModel,
    handleChangeOdometerPerMaintainance: (index: number, name: string) => void
    handleChangeDayPerMaintainance: (index: number, name: string) => void
}
interface Column {
    id: 'maintenancePart' | 'odometerPerMaintainance' | 'dayPerMaintainance';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
const CarModelMaintenancePage: React.FC<CarModelMaintenancePageProps> = ({
    model,
    handleChangeOdometerPerMaintainance,
    handleChangeDayPerMaintainance
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const columns: readonly Column[] = [
        { id: 'maintenancePart', label: t('Maintenance Part'), minWidth: 100 },
        { id: 'odometerPerMaintainance', label: t('Odometer Per Maintainance'), minWidth: 100 },
        { id: 'dayPerMaintainance', label: t('Days Per Maintainance'), minWidth: 100 }
    ];
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="pol-crash-modal-content-2">
          <span style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
              {t('Maintenance Recommendations')}
          </span>
          <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                      <TableRow>
                          {columns.map((column, index) => {
                              return (
                                  <TableCell
                                      key={column.id + '-' + index}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}
                                  >
                                      {column.label}
                                  </TableCell>
                              )
                          })}
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {model.modelOdometers.length > 0 && model.modelOdometers
                          .map((row, index1) => {
                              return (
                                  <TableRow hover role="checkbox" tabIndex={-1} key={row.modelId + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                      {columns.map((column, index) => {
                                          if (column.id !== 'odometerPerMaintainance' && column.id !== 'dayPerMaintainance') {
                                              let value = row[column.id]
                                              return (
                                                  <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'center' }}>
                                                      {t(value)}
                                                  </TableCell>
                                              )
                                          } else if (column.id === 'odometerPerMaintainance') {
                                              let value = row[column.id];
                                              return (
                                                  <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                      <TextField type="number" name={`odometerPerMaintainance${index1}`} value={value} onChange={(e) => handleChangeOdometerPerMaintainance(index1, e.target.value)} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                                                  </TableCell>
                                              )
                                          } else if (column.id === 'dayPerMaintainance') {
                                              let value = row[column.id];
                                              return (
                                                  <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                      <TextField type="number" name={`dayPerMaintainance${index1}`} value={value} onChange={(e) => handleChangeDayPerMaintainance(index1, e.target.value)} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                                                  </TableCell>
                                              )
                                          }
                                      })}
                                  </TableRow>
                              );
                          })}
                  </TableBody>
              </Table>
          </TableContainer>
      </div>
  );
}

export default CarModelMaintenancePage;