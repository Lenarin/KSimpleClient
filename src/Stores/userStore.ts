import {action, observable} from "mobx";
import User from "../Models/User";
import agent from '../ajent';


class UserStore {
    @observable currentUser: User | undefined = undefined;
    @observable loadingUser: boolean = false;
    @observable updatingUser: boolean = false;
    @observable updatingUserErrors: Error | null = null;

    @action pullUser() {
        this.loadingUser = true;
        return agent.Auth.current()
            .then(action(( user ) => { this.currentUser = user }))
            .finally(action(() => { this.loadingUser = false }))
    }
    
    @action setUser(user: User) {
        this.currentUser = user;
    }

    @action forgetUser() {
        this.currentUser = undefined;
    }
}

export default new UserStore();