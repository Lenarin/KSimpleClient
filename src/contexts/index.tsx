import commonStore from '../Stores/сommonStore'
import userStore from '../Stores/userStore'
import authStore from '../Stores/authStore'
import navigationStore from "../Stores/navigationStore";
import templateStore from "../Stores/templateStore";
import React from "react";
import storageStore from "../Stores/storageStore";

export const storesContext = React.createContext({
    commonStore: commonStore, 
    userStore: userStore, 
    authStore: authStore,
    navigationStore: navigationStore,
    templateStore: templateStore,
    storageStore: storageStore
})
