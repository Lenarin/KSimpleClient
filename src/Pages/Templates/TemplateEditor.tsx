import React, {ChangeEvent, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Grid, Typography, TextField, Select, MenuItem} from "@material-ui/core";
import {map, TreeItem} from 'react-sortable-tree';
import ValueTypes from "../../Models/ValueTypes";

const useStyles = makeStyles((theme) => ({
    form: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "0 20px 20px 40px",
        marginTop: "20px"
    },
    form__field: {
        marginBottom: "12px"
    },
    field__text: {
        padding: "0px 5px"
    },
    field__input: {
        padding: "0px 5px"
    },
    field__select_outlined: {
        paddingTop: "10.5px",
        paddingBottom: "10.5px"
    }
}))

interface TemplateEditorProps {
    node: TreeItem
}

const TemplateEditor = (props: TemplateEditorProps) => {
    const classes = useStyles()
    const [node, setNode] = useState<TreeItem>(props.node)

    useEffect(() => {
        setNode(props.node);
    }, [props])

    const handleOnChangeId = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = e.target.value;
        setNode((prevState: TreeItem) =>  ({...prevState, id: val}));
    }

    const handleOnChangeName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = e.target.value;
        setNode((prevState: TreeItem) =>  ({...prevState, name: val}));
    }
    
    const handleOnChangeType = (e: React.ChangeEvent<{ value: unknown }>) => {
        const val: string = e.target.value as string;
        setNode((prevState: TreeItem) =>  ({...prevState, type: val}));
    }
    
    const handleOnChangeValueType = (e: React.ChangeEvent<{ value: unknown }>) => {
        const val: string = e.target.value as string;
        const init: any = ValueTypes.get(val)?.defaultValue;
        if (init !== undefined)
            setNode((prevState: TreeItem) =>  ({...prevState, valueType: val, initValue: init}));
    }
    
    const handleOnChangeInitValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = e.target.value;
        setNode((prevState: TreeItem) =>  ({...prevState, initValue: val}));
    }

    return (
        <div className={classes.form}>
            <Grid container className={classes.form__field} alignContent={"space-between"} alignItems={"flex-end"}>
                <Grid item md={4} sm={12} className={classes.field__text}>
                    <Typography>Id</Typography>
                </Grid>
                <Grid item md={8} sm={12} className={classes.field__input}>
                    <TextField variant={"outlined"}
                               size={"small"}
                               fullWidth
                               required
                               onChange={handleOnChangeId}
                               value={node.id}/>
                </Grid>
            </Grid>
            <Grid container className={classes.form__field} alignContent={"space-between"} alignItems={"flex-end"}>
                <Grid item md={4} sm={12} className={classes.field__text}>
                    <Typography>Name</Typography>
                </Grid>
                <Grid item md={8} sm={12} className={classes.field__input}>
                    <TextField variant={"outlined"}
                               size={"small"}
                               fullWidth
                               required
                               onChange={handleOnChangeName}
                               value={node.name}/>
                </Grid>
            </Grid>
            <Grid container className={classes.form__field} alignContent={"space-between"} alignItems={"flex-end"}>
                <Grid item md={4} sm={12} className={classes.field__text}>
                    <Typography>Type</Typography>
                </Grid>
                <Grid item md={8} sm={12} className={classes.field__input}>
                    <Select variant={"outlined"}
                            fullWidth
                            required
                            classes={{outlined: classes.field__select_outlined}}
                            value={node.type}
                            onChange={handleOnChangeType}>
                        <MenuItem value={"folder"}>folder</MenuItem>
                        <MenuItem value={"value"}>value</MenuItem>
                        <MenuItem value={"action"}>action</MenuItem>
                    </Select>
                </Grid>
            </Grid>
            {(node.type === "value") ?
                <React.Fragment>
                    <Grid container className={classes.form__field} alignContent={"space-between"} alignItems={"flex-end"}>
                        <Grid item md={4} sm={12} className={classes.field__text}>
                            <Typography>Value Type</Typography>
                        </Grid>
                        <Grid item md={8} sm={12} className={classes.field__input}>
                            <Select variant={"outlined"}
                                    fullWidth
                                    required
                                    classes={{outlined: classes.field__select_outlined}}
                                    value={node.valueType?.toLowerCase() || ''}
                                    onChange={handleOnChangeValueType}>
                                <MenuItem value={"number"}>Number</MenuItem>
                                <MenuItem value={"boolean"}>Boolean</MenuItem>
                                <MenuItem value={"string"}>String</MenuItem>
                                <MenuItem value={"object"}>Object</MenuItem>
                                <MenuItem value={"number[]"}>Number[]</MenuItem>
                                <MenuItem value={"boolean[]"}>Boolean[]</MenuItem>
                                <MenuItem value={"string[]"}>String[]</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.form__field} alignContent={"space-between"} alignItems={"flex-end"}>
                        <Grid item md={4} sm={12} className={classes.field__text}>
                            <Typography>Init Value</Typography>
                        </Grid>
                        <Grid item md={8} sm={12} className={classes.field__input}>
                            <TextField variant={"outlined"}
                                       size={"small"}
                                       fullWidth
                                       required
                                       disabled={ValueTypes.get(node.valueType)?.canChangeDefaultValue === false}
                                       onChange={handleOnChangeInitValue}
                                       value={node.initValue as string}/>
                        </Grid>
                    </Grid>
                </React.Fragment>
                : null}
        </div>
    );
}

export default TemplateEditor;