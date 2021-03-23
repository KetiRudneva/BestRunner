import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Store} from "../redux/rootReducer";
import {
    AppBar,
    Button,
    createStyles,
    CssBaseline,
    Drawer, FormControl, InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles, MenuItem, Select,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import {_BACKEND_URL, changeWorkouts, fetchWorkouts, logOutAction} from "../redux/actions";
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MaterialTable from "material-table";
import {TableContainer} from "./TableContainer";

const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        logOutButton: {
            marginLeft: "auto",
            color: "white"
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 200,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export const AppPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [selectedType, setSelectedType] = useState('');

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedType(event.target.value as string);
    };

    const [columns, setColumns] = useState<any[]>([
        {
            title: 'Тип тренировки',
            field: 'type',
            lookup: {"run": 'бег', "bike": 'велосипед', "skiing": "лыжи", "walking": "ходьба"},
        },
        {title: 'Дата', field: 'date', type: 'date'},
        {title: 'Длина (км)', field: 'length', initialEditValue: '0', type: 'numeric'},
        {title: 'Комментарий', field: 'comment'},
    ]);

    const user = useSelector((state: Store) => state.app.user)!;
    const data = useSelector((state: Store) => state.app.workouts)!.filter(item => selectedType === '' ? item : item.type === selectedType);

    const logOut = () => {
        dispatch(logOutAction())
    }

    useEffect(() => {
        dispatch(fetchWorkouts(user._id))
    }, [])

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        {user.username}
                    </Typography>
                    <Button variant="outlined" className={classes.logOutButton} onClick={logOut}>
                        Выход
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar/>
                <div className={classes.drawerContainer}>
                    <List>
                        <ListItem button>
                            <ListItemIcon><InboxIcon/></ListItemIcon>
                            <ListItemText primary="Таблица тренировок"/>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar/>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Тип тренировки</InputLabel>
                    <Select
                        value={selectedType}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Не выбрано</MenuItem>
                        <MenuItem value="run">Бег</MenuItem>
                        <MenuItem value="bike">Велосипед</MenuItem>
                        <MenuItem value="skiing">Лыжи</MenuItem>
                        <MenuItem value="walking">Ходьба</MenuItem>
                    </Select>
                </FormControl>
                <div style={{maxWidth: '100%'}}>
                    <MaterialTable
                        localization={{
                            body: {emptyDataSourceMessage: "Нет записей"},
                            toolbar: {searchPlaceholder: "Поиск"}
                        }}
                        title={"Список тренировок"}
                        components={{Container: TableContainer}}
                        columns={columns}
                        data={data}
                        options={{
                            paging: false,
                            grouping: false
                        }}
                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    fetch(_BACKEND_URL + '/add', {
                                        method: "POST",
                                        headers: {"Content-Type": "application/json"},
                                        body: JSON.stringify({
                                            item: {...newData, user_id: user._id}
                                        })
                                    })
                                        .then(r => r.json())
                                        .then(r => {
                                            const newItem = {...newData, userId: user._id, _id: r.insertedId}
                                            dispatch(changeWorkouts([...data, newItem]));
                                            resolve(true);
                                        })
                                }),
                            onRowUpdate: (newData: any, oldData: any) =>
                                new Promise((resolve, reject) => {
                                    fetch(_BACKEND_URL + '/update', {
                                        method: "POST",
                                        headers: {"Content-Type": "application/json"},
                                        body: JSON.stringify({
                                            item: {...newData}
                                        })
                                    })
                                        .then(r => r.json())
                                        .then(r => {
                                            const dataUpdate = [...data];
                                            const index = oldData.tableData.id;
                                            dataUpdate[index] = newData;
                                            dispatch(changeWorkouts([...dataUpdate]));
                                            resolve(true);
                                        })
                                }),
                            onRowDelete: (oldData: any) =>
                                new Promise((resolve, reject) => {
                                    fetch(_BACKEND_URL + '/delete', {
                                        method: "POST",
                                        headers: {"Content-Type": "application/json"},
                                        body: JSON.stringify({
                                            item: {...oldData}
                                        })
                                    })
                                        .then(r => r.json())
                                        .then(r => {
                                            const dataDelete = [...data];
                                            const index = oldData.id;
                                            dataDelete.splice(index, 1);
                                            dispatch(changeWorkouts([...dataDelete]));
                                            resolve(true)
                                        })
                                }),
                        }}
                    />
                </div>
            </main>
        </div>
    );
}
