import commonStore from '../Stores/сommonStore'
import userStore from '../Stores/userStore'
import authStore from '../Stores/authStore'
import React from "react";

export const storesContext = React.createContext({
    commonStore: commonStore, userStore: userStore, authStore: authStore
})
