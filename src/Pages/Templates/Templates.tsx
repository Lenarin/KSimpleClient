import React, {useEffect, useLayoutEffect, useState} from "react";
import {
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {RouteComponentProps} from "@reach/router";
import {useStores} from "../../hooks/use-stores";
import {observer} from "mobx-react";
import ModelTreeNode from "../../Models/ModelTreeNode";
import {map, TreeItem} from 'react-sortable-tree';
import TemplateTree from "./TemplateTree/TeplateTree";
import TemplateEditor from "./TemplateEditor";
import makeId from "../../misc/makeId";
import {NavIconButtonProps, NavTextButtonProps} from "../../Stores/navigationStore";
import clsx from "clsx";
import MonacoEditor from "react-monaco-editor";

// TODO Add save editor changes. With validations!!!

const useStyles = makeStyles((theme) =>( {
    template: {
      height: "100%",
      display: "flex"  
    },
    template__list: {
        minWidth: 200,
        width: 200,
        boxShadow: "2px 0 4px -2px rgba(0,0,0,0.3)",
        transition: theme.transitions.create(['width', 'min-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    template__editor: {
        display: "flex",
        width: "100%"
    },
    template__tree: {
        width: "30%",
        padding: 10,
        boxShadow: "2px 0 2px -2px rgba(0,0,0,0.3)"
    },
    template__model: {
        width: "70%"
    },
    tree__node: {
        border: "none"
    },
    template__list_hidden: {
        width: 0,
        minWidth: 0,
        transition: theme.transitions.create(['width', 'min-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }
}))

const AnotherEditor = (props: {model: ModelTreeNode}) => {
    const [code, setCode] = useState<string>(["{", "}"].join("\n"));
    const [language, setLanguage] = useState<string>("json");
    const [editor, setEditor] = useState<any>(null);
    
    useEffect(() => {
        setCode(JSON.stringify(props.model));
        if (editor) editor.trigger("anyString", 'editor.action.formatDocument', null);
    }, [props])
    
    const editorWillMount = (monaco: any) => {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [
                {
                    schema: {
                        $ref: "#/definitions/node",
                        definitions: {
                            node: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    type: { enum: ["folder", "value", "action"] },
                                    status: { enum: ["ok"] },
                                    valueType: { enum: ["number", "number[]", "boolean", "boolean[]", "string", "string[]", "object"] },
                                    initValue: { type: ["string", "number", "object", "array"] },
                                    children: { type: "array", items: {$ref: "#/definitions/node"} }
                                },
                            }
                        }
                    },
                    fileMatch: "*"
                },
            ],
        });
    }

    const editorDidMount = (editor: any) => {
        // eslint-disable-next-line no-console
        console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
        setEditor(editor);
        editor.trigger("anyString", 'editor.action.formatDocument', null);
    };
    
    return (
        <MonacoEditor
            width="95%"
            height="96%"
            language={language}
            value={code}
            editorWillMount={editorWillMount}
            editorDidMount={editorDidMount}
        />
    );
}

const Templates = observer((props: RouteComponentProps) => {
    const classes = useStyles();
    const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);
    const { templateStore, navigationStore } = useStores();
    const [treeData, setTreeData] = useState<TreeItem[]>([{title: "root", children: []}]);
    const [selectedNode, setSelectedNode] = useState<TreeItem | undefined>(undefined);
    const [templateHidden, setTemplateHidden] = useState<boolean>(false);
    const [openedWindow, setOpenedWindow] = useState<string>("editor");
    const [selectedModel, setSelectedModel] = useState<ModelTreeNode>(new ModelTreeNode())

    useLayoutEffect(() => {
        navigationStore.setCurrentPageName("Templates");

        let buttons: (NavIconButtonProps | NavTextButtonProps)[] = [];

        if (templateHidden) buttons.push({text: "Show templates", onClick: () => setTemplateHidden(false)})
        else buttons.push({text: "Hide templates", onClick: () => setTemplateHidden(true)})

        if (openedWindow === "editor") buttons.push({text: "Code", onClick: () => setOpenedWindow("code")})
        else buttons.push({text: "Editor", onClick: () => setOpenedWindow("editor")})

        navigationStore.setButtons(buttons);
    }, [templateHidden, openedWindow]);
    
    useEffect(() => {
        if (templateStore.templates === undefined)
            templateStore.pullTemplates().finally(() => handleSelectTemplate(templateStore.templates?.keys().next().value));
        else
            handleSelectTemplate(templateStore.templates?.keys().next().value);

    }, [templateHidden, openedWindow])
    
    useEffect(() => {
        if (selectedTemplate)
            handleSelectTreeNode(treeData[0])
    }, [selectedTemplate])
    
    const handleSelectTemplate = async (id: string | undefined) => {
        if (id) {
            if (templateStore.templates && !templateStore.templates.get(id)?.modelTree) {
                await templateStore.pullTemplateTree(id);
            }

            const nodes = templateStore.templates?.get(id)?.modelTree
            if (nodes) {
                setTreeData([parseTree(nodes)]);
                setSelectedModel(nodes);
            }

            setSelectedTemplate(id);
        }
    }
    
    const handleTemplateTreeClick = (node: TreeItem, e: any) => {
        const clickedItemClassName = e.target.className;
        if (
            /.*expandButton.*/.test(clickedItemClassName) ||
            /.*collapseButton.*/.test(clickedItemClassName)
        ) return;
        
        handleSelectTreeNode(node.node);
    }
    
    const handleSelectTreeNode = (node: TreeItem) => {
        const newTree = map({
            treeData: treeData,
            getNodeKey: node => node.node.id,
            callback: (n: any) => {
                n.node.isSelected = (n.node.id === node.id);
                return n.node;
            },
            ignoreCollapsed: false
        })

        setTreeData(newTree);
        setSelectedNode(node);
    }

    const parseTree = (nodes : ModelTreeNode) => {
        const tree: TreeItem = {...nodes, localId: makeId(7), expanded: true}
        return tree;
    }
    
    return (
        <div className={classes.template}>
            <List className={clsx(classes.template__list, {[classes.template__list_hidden]: templateHidden})}>
                {templateStore.templates && !templateHidden
                    ? Array.from(templateStore.templates.values()).map((temp) => 
                        <ListItem 
                            button
                            selected={selectedTemplate === temp.id}
                            onClick={() => handleSelectTemplate(temp.id)}
                            key={temp.id}
                        >
                            <ListItemText primary={temp.name}/>
                        </ListItem>
                    )
                    : null}
            </List>
            { openedWindow === "editor" ?
                <div className={classes.template__editor}>
                    <div id="template-tree" className={classes.template__tree}>
                        {templateStore.templates !== undefined && selectedTemplate
                            ? <TemplateTree
                                onChange={treeData => setTreeData(treeData)}
                                onLabelClickHandler={handleTemplateTreeClick}
                                treeData={treeData}
                            />
                            : null}
                    </div>
                    {selectedNode
                        ? <TemplateEditor node={selectedNode}/>
                        : null}
                </div>
                :
                <AnotherEditor model={selectedModel}/>
            }
        </div>
    )
})

export default Templates;