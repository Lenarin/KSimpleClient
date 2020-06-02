export default interface Packet{
    id: number;
    storageId: string;
    userTimestamp: number;
    serverTimestamp: number;
    data: Map<string, any>
}