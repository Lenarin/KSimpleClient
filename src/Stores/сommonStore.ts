import {action, observable, reaction} from "mobx";

interface AuthObject {
    authToken: string;
    authTokenExpiresIn: string;
    refreshToken: string;
    refreshTokenExpiresIn: string;
}

class CommonStore {
    @observable appName = "KSimple";
    @observable tokens: AuthObject | undefined;
    @observable appLoaded = false;

    constructor() {
        const authString = window.localStorage.getItem('auth');
        if (authString) this.tokens = JSON.parse(authString);

        reaction(
            () => this.tokens,
            auth => {
                if (auth) {
                    window.localStorage.setItem('auth', JSON.stringify(auth));
                } else  {
                    window.localStorage.removeItem('auth');
                }
            }
        )
    }

    @action setAuth(auth: AuthObject | undefined) {
        if (auth) {
            console.log(auth);
            this.tokens = {
                authToken: auth.authToken,
                authTokenExpiresIn: auth.authTokenExpiresIn,
                refreshToken: auth.refreshToken,
                refreshTokenExpiresIn: auth.refreshTokenExpiresIn
            }
        } else {
            this.tokens = undefined;
        }
    }

    @action setAppLoaded() {
        this.appLoaded = true;
    }
}

export default new CommonStore();