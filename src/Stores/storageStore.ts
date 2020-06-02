import {action, observable} from "mobx";
import agent from '../ajent';
import Storage from "../Models/Storage";

class StorageStore {
    @observable storages: Map<string, Storage> | undefined;
    @observable loading: boolean = false;

    @action setStorages(storages: Map<string, Storage>) {
        this.storages = storages;
    }

    @action pullStorages() {
        this.loading = true;
        return agent.Storages.pull()
            .then(action((response) => {
                this.storages = new Map<string, Storage>();
                (response as unknown as Array<Storage>).forEach((elem) => {
                    if (elem.id) this.storages?.set(elem.id, elem);
                })
            }))
            .then(action(() => this.loading = false));
    }

    @action pullAllPacketsById(storageId: string) {
        this.loading = true;
        return agent.Storages.pullPackets(storageId, 1, 3587483986)
            .then(action((response) => {
                if (this.storages) {
                    const storage = this.storages.get(storageId);
                    if (storage) storage.packets = response;
                } else {
                    throw new Error("Storages not found");
                }
            }))
            .finally(action(() => this.loading = false));
    }
}

export default new StorageStore();