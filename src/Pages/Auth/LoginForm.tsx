import {observer} from "mobx-react";
import {useStores} from "../../hooks/use-stores";
import {Link as RouterLink, useNavigate} from "@reach/router";
import React, {ChangeEvent, useEffect} from "react";
import {Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography} from "@material-ui/core";

const LoginForm = observer((classes: Record<"root" | "image" | "paper" | "avatar" | "form" | "submit", string>) => {
    const { authStore } = useStores();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            authStore.reset();
        }
    }, []);

    const handleLoginChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        authStore.setUsername(e.target.value);
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        authStore.setPassword(e.target.value);
    }

    const handleSubmitForm = async (e: any) => {
        e.preventDefault();
        await authStore.login();
        await navigate('/', {replace: true});
    }

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">
                Sing in
            </Typography>
            <form className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="login"
                    autoFocus
                    onChange={handleLoginChange}
                    value={authStore.values.username}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handlePasswordChange}
                    value={authStore.values.password}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmitForm}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link id="link-pass" component={RouterLink} to="/login" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link id="link-singin" component={RouterLink} to="/register" variant="body2" >
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
});

export default LoginForm;