import React from 'react';
import {createStyles, CssBaseline} from "@material-ui/core";
import NavigationMenu from "./Components/NavigationMenu/NavigationMenu";
import {Router, RouteComponentProps, Redirect} from "@reach/router"
import Auth from "./Pages/Auth/Auth";
import {makeStyles} from "@material-ui/core/styles";
import {useStores} from "./hooks/use-stores";

let Hello = (props: RouteComponentProps) => <div>Hello world!</div>
let Templates = (props: RouteComponentProps) => <div>Templates</div>

const useStyles = makeStyles(style => ({
    App: {
        display: 'flex'
    },
    App__content: {
        flexGrow: 1,
        paddingTop: style.spacing(6)
    }
}));

const Main = (props: RouteComponentProps) => {
    const classes = useStyles();

    return(
        <div className={classes.App}>
            <CssBaseline/>
            <NavigationMenu/>
            <Router className={classes.App__content}>
                <Hello path="/"/>
                <Templates path="templates"/>
            </Router>
        </div>
    )

}


function App() {
    const { commonStore } = useStores();
    
    return (
        <Router>
            <Auth path="/login" />
            <Auth path="/register" />
            
            {!commonStore.tokens ? <Redirect from='/*' to='/login' noThrow /> : null}
                
            <Main path="/*" />
        </Router>
  );
}

export default App;
