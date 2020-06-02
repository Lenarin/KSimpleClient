import React, {useEffect, useLayoutEffect, useState} from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "@reach/router";
import navigationStore from "../../Stores/navigationStore";
import {useStores} from "../../hooks/use-stores";
import {makeStyles} from "@material-ui/core/styles";
import {List, ListItem, ListItemText, AppBar, Tabs, Tab, Box} from "@material-ui/core";
import TabPanel from "./TabPanel";
import MaterialTable, {Column} from "material-table";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Packet from "../../Models/Packet";
import StorageField from "../../Models/StorageField";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props}  />),
    Check: forwardRef((props, ref) => <Check {...props}  />),
    Clear: forwardRef((props, ref) => <Clear {...props}  />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props}  />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props}  />),
    Edit: forwardRef((props, ref) => <Edit {...props} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} />),
    Search: forwardRef((props, ref) => <Search {...props} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} />)
};

const useStyles = makeStyles((theme) =>({
    storage: {
        height: "100%",
        display: "flex"
    },
    storage__list: {
        minWidth: 200,
        width: 200,
        zIndex: 5,
        boxShadow: "2px 0 4px -2px rgba(0,0,0,0.3)",
        transition: theme.transitions.create(['width', 'min-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    storage__view: {
        display: "flex",
        width: "100%",
        zIndex: 1
    },
}));


const Storages = observer((props: RouteComponentProps) => {
    const { storageStore } = useStores();
    const classes = useStyles();
    const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);
    const [packets, setPackets] = useState<Array<Packet>>([]);
    const [tabValue, setTabValue] = useState(0);
    const [tableColumns, setTableColumns] = useState<Column<object>[]>([]);
    const [tableData, setTableData] = useState<object[]>([]);
    const [tableName, setTableName] = useState<string>('');

    useLayoutEffect(() => {
        navigationStore.setCurrentPageName("Storages");
        navigationStore.setButtons([]);
    }, [])

    useEffect(() => {
        if (storageStore.storages === undefined)
            storageStore.pullStorages().finally(() => handleSelectStorage(storageStore.storages?.keys().next().value));
        else
            handleSelectStorage(storageStore.storages?.keys().next().value);
    }, [])

    useEffect(() => {
        const storage = storageStore.storages?.get(selectedStorage || '');
        if (storage && storage.storageFields) {
            let columns: Column<object>[] = [];
            for (const key in storage.storageFields) {

                columns.push({title: (storage.storageFields as any)[key].name || '', field: key})
            }
            setTableColumns(columns);

            let data: any[] = [];

            packets.forEach((packet) => {
                let dat: any = {};
                columns.forEach((column) => {
                    if (column.field)
                        dat[column.field as string] = JSON.stringify((packet.data as any)[column.field as string]);
                })
                data.push(dat);
            });
            setTableData(data);

            setTableName(storage.name);

            console.log(data);
        }
    }, [packets])

    useEffect(() => {
        if (selectedStorage) {
            const storage = storageStore.storages?.get(selectedStorage || '');

            if (storage) {
                if (!storage.packets) {
                    storageStore.pullAllPacketsById(selectedStorage).finally(() => setPackets(storage.packets || []));
                }
                else {
                    setPackets(storage.packets);
                }
            }
        }
    }, [selectedStorage])

    const handleSelectStorage = async (id: string | undefined) => {
        if (id) {
            setSelectedStorage(id);
        }
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };


    return (
        <div className={classes.storage}>
            <List className={classes.storage__list}>
                {
                    storageStore.storages
                    ? Array.from(storageStore.storages.values()).map((storage) =>
                        <ListItem
                            button
                            selected={selectedStorage === storage.id}
                            onClick={() => handleSelectStorage(storage.id)}
                            key={storage.id}
                        >
                            <ListItemText primary={storage.name}/>
                        </ListItem>
                        )
                        : null
                }
            </List>
            <div className={classes.storage__view}>
                <AppBar position="static" color="default" elevation={0}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Journal" id="tabJournal"/>
                        <Tab label="Edit" id="tabEdit"/>
                        <Tab label="Handlers" id="tabHandlers"/>
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <MaterialTable
                            columns={tableColumns}
                            data={tableData}
                            // @ts-ignore
                            icons={tableIcons}
                            title={tableName}
                        />
                    </TabPanel>
                    <TabPanel index={1} value={tabValue}>
                        {"Hello Edit"}
                    </TabPanel>
                    <TabPanel index={2} value={tabValue}>
                        {"Hello Handlers"}
                    </TabPanel>
                </AppBar>
            </div>
        </div>
    )
});

export default Storages;