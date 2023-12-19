import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarInspectionDetail, CarInspectionHistory } from '../../../utils/Interfaces';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from '@mui/material/TextField'
interface RegistryInspectionInspectedCategoriesFormProps {
    action: "Add" | "Edit"
    model: CarInspectionHistory
    handleAddInspectionCategory: () => void
    handleRemoveInspectionCategory: (index: number) => void
    handleInspectionCategoryStatus: (index: number) => void
    handleChangeInspectionCategory: (index: number, name: string) => void
    handleChangeInspectionNote: (index: number, name: string) => void
}
interface Column {
    id: 'inspectionCategory' | 'status' | 'note' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
const RegistryInspectionInspectedCategoriesForm: React.FC<RegistryInspectionInspectedCategoriesFormProps> = ({
    action,
    model,
    handleAddInspectionCategory,
    handleRemoveInspectionCategory,
    handleInspectionCategoryStatus,
    handleChangeInspectionCategory,
    handleChangeInspectionNote
}) => {
    const { t, i18n } = useTranslation();
    const columns: readonly Column[] = [
        { id: 'inspectionCategory', label: t('Inspection Category') },
        { id: 'status', label: t('Status') },
        { id: 'note', label: t('Note') },
        { id: 'actions', label: t('Action') },
    ];
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const edit = action === "Edit"
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
          <>
              <div style={{marginBottom:'5px'}}>
              <label>{t('Inspected Categories')}: </label>
              <button className="reg-inspec-add-inspec-category-btn" type="button" onClick={handleAddInspectionCategory}>+{t('Add Inspection Category')}</button>
              </div>
              <TableContainer style={{borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}>
                  <Table stickyHeader aria-label="sticky table" >
                      <TableHead>
                          <TableRow>
                              {columns.map((column, index) => {
                                  if (column.id !== 'inspectionCategory' && column.id !== 'actions') {
                                      return (
                                          <TableCell
                                              key={column.id + '-' + index}
                                              align={column.align}
                                              style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '10px', textAlign: 'center', border: '1px solid black' }}
                                          >
                                              {column.label}
                                          </TableCell>
                                      )
                                  } else if (column.id === 'inspectionCategory') {
                                      return (
                                          <TableCell
                                              key={column.id + '-' + index}
                                              align={column.align}
                                              style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '10px', textAlign: 'center', borderTopLeftRadius: '20px', border: '1px solid black' }}
                                          >
                                              {column.label}
                                          </TableCell>
                                      )
                                  } else if (column.id === 'actions') {
                                      return (
                                          <TableCell
                                              key={column.id + '-' + index}
                                              align={column.align}
                                              style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '10px', textAlign: 'center', borderTopRightRadius: '20px', border: '1px solid black' }}
                                          >
                                              {column.label}
                                          </TableCell>
                                      )
                                  }
                              })}
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {model.carInspectionHistoryDetail.length > 0 ? model.carInspectionHistoryDetail
                              .map((row, index1) => {
                                  return (
                                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                          {columns.map((column, index) => {
                                              if (column.id === 'inspectionCategory') {
                                                  let value = row[column.id]
                                                  return (
                                                      <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                          <TextField type="text" name={`category${index}`} value={value} onChange={(e) => handleChangeInspectionCategory(index1, e.target.value)} style={{ width: '100%' }} size='small' />
                                                      </TableCell>
                                                  )
                                              } else if (column.id === 'status') {
                                                  let value = row.isPassed;
                                                  return (
                                                      <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                          <input type="checkbox" name={`passed${index}`} checked={value} onChange={() => handleInspectionCategoryStatus(index1)} />
                                                          <label>{value ? t('Passed') : t('Not passed')}</label>
                                                      </TableCell>
                                                  )
                                              } else if (column.id === 'actions') {
                                                  return (
                                                      <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                          <IconButton onClick={() => handleRemoveInspectionCategory(index1)}>
                                                              <DeleteIcon />
                                                          </IconButton>
                                                      </TableCell>
                                                  )
                                              } else if (column.id === 'note') {
                                                  let value = row[column.id]
                                                  return (
                                                      <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                          <TextField type="text" name={`note${index}`} value={value} onChange={(e) => handleChangeInspectionNote(index1, e.target.value)} style={{ width: '100%' }} size='small' />
                                                      </TableCell>
                                                  )
                                              }
                                          })}
                                      </TableRow>
                                  );
                              }) :
                              <TableRow>
                                  <TableCell colSpan={11}>
                                      {t('No car crash report found')}
                                  </TableCell>
                              </TableRow>
                          }
                      </TableBody>
                  </Table>
              </TableContainer>
          </>
  );
}

export default RegistryInspectionInspectedCategoriesForm;