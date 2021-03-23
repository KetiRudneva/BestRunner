import React from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {Store} from "./redux/rootReducer";
import {Backdrop, CircularProgress} from '@material-ui/core';
import {changeLoading} from "./redux/actions";
import {LoginComponent} from "./components/LoginComponent";
import {AppPage} from "./components/AppPage";

function App() {
    const dispatch = useDispatch()
    const isLoading = useSelector((state: Store) => state.app.loading)
    const user = useSelector((state: Store) => state.app.user)

    return (
        <div>
            {user ? <AppPage/> : <LoginComponent/>}
            <Backdrop open={isLoading}><CircularProgress/></Backdrop>
        </div>
    );
}

export default App;
