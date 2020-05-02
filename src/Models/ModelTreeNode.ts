export default class ModelTreeNode {
    id: string | undefined;
    name: string | undefined;
    status: string | undefined;
    type: string | undefined;
    children: Array<ModelTreeNode> | undefined;
    valueType: string | undefined;
    initValue: string | number | object | boolean | undefined;
}
