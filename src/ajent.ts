import superagent, {SuperAgentRequest} from 'superagent';
import commonStore from './Stores/сommonStore'
import authStore from "./Stores/authStore";
import userStore from "./Stores/userStore";
import User from "./Models/User";
import request from "superagent";

const API_ROOT = 'https://localhost:5001';

const encode = encodeURIComponent;

const handleErrors = (err: any) => {
    if (err && err.response && err.response.status === 401) {
        authStore.logout().then();
        return;
    }
    throw err;
}

const tokenPlugin = (req: SuperAgentRequest) => {
    if (commonStore.tokens?.authToken) {
        req.set('Authorization', `Bearer ${commonStore.tokens.authToken}`);
    }
}

const responseBody = (res: request.Response) => res.body;


const requests = {
    del: (url: string) =>
        superagent
            .del(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .then(responseBody)
            .catch(handleErrors),
    get: (url: string) =>
        superagent
            .get(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .then(responseBody)
            .catch(handleErrors),
    put: (url: string, body: string | object | undefined) =>
        superagent
            .put(`${API_ROOT}${url}`)
            .send(body)
            .use(tokenPlugin)
            .then(responseBody)
            .catch(handleErrors),
    post: (url: string, body: string | object | undefined) =>
        superagent
            .post(`${API_ROOT}${url}`)
            .send(body)
            .use(tokenPlugin)
            .then(responseBody)
            .catch(handleErrors),
}

const Auth = {
    current: () => 
        requests.get('/user'),
    login: (username: string, password: string) => 
        requests.post('/auth/token/login', {login: username,  password: password}),
    register: (username: string,  password: string, email: string | null) => 
        requests.post('/users', {name: username,  password: password}),
    save: (user: User) =>
        requests.post(`/users/${user.id}`, {...user})
}

const Templates = {
    pull: () => 
        requests.get('/templates'),
    pullModelTree: (id: string) => 
        requests.get(`/templates/${id}/tree`)
}

export default {
    Auth,
    Templates
};