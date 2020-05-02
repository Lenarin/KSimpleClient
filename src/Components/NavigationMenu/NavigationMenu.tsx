import {
    AppBar, Button, createStyles,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Theme, Toolbar, Typography
} from "@material-ui/core";
import React, {useState} from "react";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "@reach/router";
import {makeStyles} from '@material-ui/core/styles';
import clsx from "clsx";
import CategoryIcon from '@material-ui/icons/Category';
import {useStores} from "../../hooks/use-stores";
import {NavIconButtonProps, NavTextButtonProps} from "../../Stores/navigationStore";
import {observer} from "mobx-react";

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            height: theme.spacing(6),
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap'
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(5) + 1
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            minHeight: theme.spacing(6),
        },
        root__toolbar: {
            minHeight: theme.spacing(6),
            paddingLeft: theme.spacing(1)
        },
        drawer__button: {
            padding: theme.spacing(1, 1)
        }
    }),
);

const NavigationMenu = observer(() => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const { navigationStore } = useStores();

    const handleDrawerClose = () => {
        setOpen(false);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar className={classes.root__toolbar} >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx( {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography>{navigationStore.currentPageName}</Typography>
                    <Divider orientation={"vertical"} variant={"middle"}/>
                    {navigationStore.buttons.map((elem) => {
                        if ((elem as NavIconButtonProps).icon !== undefined) 
                            return (<IconButton
                                color="inherit"
                                onClick={elem.onClick}
                            >
                                {React.createElement((elem as NavIconButtonProps).icon, {})}
                            </IconButton>)
                        if ((elem as NavTextButtonProps).text !== undefined)
                            return (<Button
                                color="inherit"
                                onClick={elem.onClick}
                            >
                                <Typography>{(elem as NavTextButtonProps).text}</Typography>
                            </Button>)
                    })}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key="templates" component={Link} to="/templates" className={classes.drawer__button}>
                        <ListItemIcon><CategoryIcon /></ListItemIcon>
                        <ListItemText primary={"Templates"} />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
})

export default NavigationMenu;