import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { Add, AutoAwesomeMosaicOutlined, Edit } from '@mui/icons-material';
import CreateAccount from 'src/pages/Admin/CreateAccount/CreateAccount';
import authService from 'src/services/auth.services';
import EditForm from 'src/pages/Admin/EditForm/EditForm';
import { Dialog, DialogActions, DialogContent, Button, DialogContentText, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { getDateOneYearLater } from 'src/common/cardExp';
import CustomRenewButton from './CustomRenewButton';
import { useNavigate } from 'react-router-dom';

function createData(id, cardId, name, email, role, limit, cards, expDate) {
  return {
    id,
    cardId,
    name,
    email,
    role,
    limit,
    cards,
    expDate,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'limit',
    numeric: true,
    disablePadding: false,
    label: 'Card Limit',
  },
  {
    id: 'cards',
    numeric: true,
    disablePadding: false,
    label: 'Total Cards',
  },
  {
    id: 'expDate',
    numeric: true,
    disablePadding: false,
    label: 'Expires on',
  },
  {
    id: 'renew',
    numeric: true,
    disablePadding: false,
    label: 'Renew',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { rowId, numSelected, setSelected, trigger, setTrigger, handleRowEdit } = props;
  const [open, setOpen] = React.useState(false);
  const [deleteUser, setDeleteUser] = React.useState(false);

  const navigate = useNavigate();

  const handleDeleteRow = (id) => {
    if (id) {
      authService
        .deleteUser(id)
        .then((resp) => {
          setSelected([]);
          
          setTrigger(!trigger);
          setDeleteUser(false);
        })
        .catch((error) => {
          
        });
    }
  };

  const handleUserEdit = (id) => {
    id && navigate(`detail/${id}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <CreateAccount open={open} setOpen={setOpen} trigger={trigger} setTrigger={setTrigger} />

      <Dialog open={deleteUser} onClose={() => setDeleteUser(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm user Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setDeleteUser(false)}>
            Cancel
          </Button>
          <LoadingButton onClick={() => handleDeleteRow(rowId)}>Yes</LoadingButton>
        </DialogActions>
      </Dialog>

      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Users
        </Typography>

        {numSelected > 0 ? (
          <>
            <Tooltip title="Modify">
              <IconButton onClick={() => handleUserEdit(rowId)}>
                <AutoAwesomeMosaicOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleRowEdit(rowId)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => setDeleteUser(true)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Add Account">
            <IconButton onClick={handleClickOpen}>
              <Add />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  trigger: PropTypes.bool.isRequired,
  setSelected: PropTypes.func.isRequired,
  setTrigger: PropTypes.func.isRequired,
  handleRowEdit: PropTypes.func.isRequired,
};

export default function CustomTable({ dataList, trigger, setTrigger }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedRowId, setSelectedRowId] = React.useState(null);

  const [editing, setEditing] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    if (dataList?.length > 0) {
      _getUserPayload(dataList);
    }
  }, [dataList]);

  const _getUserPayload = (list) => {
    let rows = [];

    list.forEach((item) => {
      rows.push(
        createData(
          item.user.id,
          item?.card?.id,
          `${item.user.first_name} ${item.user.last_name}`,
          item.user.email,
          item.user.role,
          item.user.limit,
          item.user.totalCards,
          getDateOneYearLater(item?.card?.expiredAt)
        )
      );
    });

    setRows(rows);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, id) => {
    let newSelected = [];

    if (selected.includes(name)) {
      newSelected = [];
      setSelectedRowId(null);
    } else {
      newSelected = [name];
      setSelectedRowId(id);
    }

    setSelected(newSelected);
  };

  const handleRowEdit = (recordId) => {
    if (recordId && rows) {
      setEditing(true);
      const user = rows.find((user) => user.id === recordId);
      setUserData(user ? user : null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <EditForm open={editing} setOpen={setEditing} trigger={trigger} setTrigger={setTrigger} data={userData} />

      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          rowId={selectedRowId}
          numSelected={selected.length}
          setSelected={setSelected}
          trigger={trigger}
          setTrigger={setTrigger}
          handleRowEdit={handleRowEdit}
        />
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'small'}
            stickyHeader
            aria-label="sticky table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows &&
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                      <TableCell align="right">{row.limit}</TableCell>
                      <TableCell align="right">{row.cards}</TableCell>
                      <TableCell align="right">{row.expDate ?? '-'}</TableCell>
                      <TableCell align="right">
                        <CustomRenewButton cardId={row.cardId} setTrigger={setTrigger} trigger={trigger} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" /> */}
    </Box>
  );
}
