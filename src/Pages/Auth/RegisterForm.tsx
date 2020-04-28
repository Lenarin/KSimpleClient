import {observer} from "mobx-react";
import {useStores} from "../../hooks/use-stores";
import {Link as RouterLink, useNavigate} from "@reach/router";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography} from "@material-ui/core";
import { validateEmail } from "../../misc/validators";

const RegisterForm = observer((classes: Record<"root" | "image" | "paper" | "avatar" | "form" | "submit", string>) => {
    const { authStore } = useStores();
    const navigate = useNavigate();
    
    const [passwordTest, setPasswordTest] = useState<string>("");
    const [passwordTestPassed, setPasswordTestPassed] = useState<boolean>(true);
    const [emailPassed, setEmailPassed] = useState<boolean>(true);

    useEffect(() => {
        return () => {
            authStore.reset();
        }
    }, []);

    const handleLoginChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        authStore.setUsername(e.target.value);
    }
    
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        authStore.setEmail(e.target.value);
        
        if (!validateEmail(e.target.value)) 
            setEmailPassed(false);
        else
            setEmailPassed(true);
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        authStore.setPassword(e.target.value);
    }
    
    const handlePasswordTestChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPasswordTest(e.target.value);
        
        if (e.target.value !== "" && e.target.value !== authStore.values.password) {
            setPasswordTestPassed(false);
        } else {
            setPasswordTestPassed(true);
        }
    }

    const handleSubmitForm = (e: any) => {
        e.preventDefault();
        authStore.register().then(() => navigate('/login', {replace: true}));
    }

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="login"
                            value={authStore.values.username}
                            onChange={handleLoginChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={authStore.values.email}
                            onChange={handleEmailChange}
                            error={!emailPassed}
                            helperText={!emailPassed ? 'Not valid email' : ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={authStore.values.password}
                            onChange={handlePasswordChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password-test"
                            label="Password (one more time)"
                            type="password"
                            id="password-test"
                            autoComplete="current-password"
                            value={passwordTest}
                            onChange={handlePasswordTestChange}
                            error={!passwordTestPassed}
                            helperText={!passwordTestPassed ? 'Passwords not match' : ''}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="I want to receive notifications via email"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmitForm}
                >
                    Sign Up
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
})

export default RegisterForm;