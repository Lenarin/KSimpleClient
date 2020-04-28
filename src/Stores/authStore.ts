import {action, observable} from "mobx";
import commonStore from './сommonStore';
import userStore from './userStore';
import agent from '../ajent';

interface authValues {
    username: string;
    email: string;
    password: string;
}

class AuthStore {
    @observable inProgress: boolean = false;
    @observable errors: any = undefined;

    @observable values: authValues = {
        username: '',
        email: '',
        password: ''
    }

    @action setUsername(username: string) {
        this.values.username = username;
    }

    @action setEmail(email: string) {
        this.values.email = email;
    }

    @action setPassword(password: string) {
        this.values.password = password;
    }

    @action reset() {
        this.values.username = '';
        this.values.email = '';
        this.values.password = '';
    }
    
    @action login() {
        this.inProgress = true;
        this.errors = undefined;
        return agent.Auth.login(this.values.username, this.values.password)
            .then((auth) => commonStore.setAuth(auth))
            .then(() => userStore.pullUser())
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(() => { this.inProgress = false}));
    }
    
    @action register() {
        this.inProgress = true;
        this.errors = undefined;
        return agent.Auth.register(this.values.username, this.values.password, this.values.email)
            .finally(action(() => { this.inProgress = false}));
    }

    @action logout() {
        commonStore.setAuth(undefined);
        userStore.forgetUser();
        return Promise.resolve();
    }
}

export default new AuthStore();