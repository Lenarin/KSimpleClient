import React from "react";
import {
    CssBaseline,
    Grid, 
    Paper,
} from "@material-ui/core";
import {RouteComponentProps, useLocation, useNavigate} from "@reach/router";
import {makeStyles} from '@material-ui/core/styles';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Auth(props: RouteComponentProps) {
    const path = useLocation().pathname

    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={24} square>
                {path === '/login'
                    ? <LoginForm {...classes}/>
                    : <RegisterForm {...classes}/>}
            </Grid>
        </Grid>
    )
}