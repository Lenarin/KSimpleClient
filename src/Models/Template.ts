import ModelTreeNode from "./ModelTreeNode";

export default class Template {
    id: string | undefined;
    userDefinedId: string | undefined;
    name: string | undefined;
    templateGroups: Array<string> | undefined;
    storages: Array<string> | undefined;
    status: string | undefined;
    canModifyTemplate: boolean | undefined;
    
    modelTree: ModelTreeNode | undefined;
}