import React, {useState} from 'react'
import {Button, createStyles, makeStyles, TextField, Theme, Typography} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {changeLoading, fetchUserAuth, fetchUserRegistration} from "../redux/actions";

interface LoginComponent {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        },
        header: {
            marginTop: 150,
            fontSize: 40,
            fontFamily: "Roboto, sans-serif"
        },
        input: {
            marginTop: 15,
            width: "100%"
        },
        buttonsContainer: {
            marginTop: 20,
            display: "flex",
            justifyContent: "space-around",
        },
        loginContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 325,
            maxWidth: 325
        }
    }),
);

export const LoginComponent = (props: LoginComponent) => {
    const classes = useStyles();
    const dispatch = useDispatch()

    const [selectedAction, setSelectedAction] = useState<"reg" | "login" | null>("login");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        dispatch(changeLoading(true));
        dispatch(fetchUserAuth(login, password));
    }

    const handleRegistration = () => {
        dispatch(changeLoading(true));
        dispatch(fetchUserRegistration(login, password));
    }

    return (
        <div className={classes.root}>

            {selectedAction === "login" ?
                <div className={classes.loginContainer}>
                    <Typography className={classes.header}>Best Runner</Typography>
                    <TextField value={login} onChange={(e) => setLogin(e.target.value)} className={classes.input}
                               variant="outlined" margin="dense" label="Login"/>
                    <TextField value={password} onChange={(e) => setPassword(e.target.value)} className={classes.input}
                               variant="outlined" margin="dense" label="Password"/>
                    <Button style={{marginTop: 15}} fullWidth variant="contained" color="primary" onClick={() => {
                        handleLogin()
                    }}>
                        Войти
                    </Button>
                    <Typography style={{marginTop: 15, fontSize: 16}}>Еще нет аккаунта? <strong onClick={() => {
                        setSelectedAction("reg");
                        setPassword("");
                        setLogin("");
                    }} style={{color: "blue", cursor: "pointer"}}>Зарегистрироваться</strong></Typography>
                </div> : null
            }
            {selectedAction === "reg" ?
                <div className={classes.loginContainer}>
                    <Typography className={classes.header}>Регистрация</Typography>
                    <TextField value={login} onChange={(e) => setLogin(e.target.value)} className={classes.input}
                               variant="outlined" margin="dense" label="Login"/>
                    <TextField value={password} onChange={(e) => setPassword(e.target.value)} className={classes.input}
                               variant="outlined" margin="dense" label="Password"/>
                        <Button style={{marginTop: 15}} fullWidth variant="contained" color="primary" onClick={handleRegistration}>
                            Зарегистрироваться
                        </Button>
                    <Typography style={{marginTop: 15}}><strong onClick={() => {
                        setSelectedAction("login");
                        setPassword("");
                        setLogin("");
                    }} style={{color: "blue", cursor: "pointer"}}>Вернуться к авторизации</strong></Typography>
                </div>
                : null
            }
        </div>
    )
}
