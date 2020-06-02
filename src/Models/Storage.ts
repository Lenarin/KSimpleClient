import StorageField from "./StorageField";
import Packet from "./Packet";

export default class Storage {
    id: string = '';
    userDefinedId = '';
    name: string = '';
    storageFields: Map<string, StorageField> | undefined;
    status: string = 'ok';
    templateId: string | undefined;
    storageGroups: Array<string> | undefined;
    userCanModifyStorage: boolean = false;

    packets: Array<Packet> | undefined;
}