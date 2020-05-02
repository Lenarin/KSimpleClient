import React from "react";
import SortableTree, {ThemeProps, TreeItem} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import styles from "./node-content-renderer.module.scss";
import {SvgIcon, SvgIconProps} from "@material-ui/core"; // This only needs to be imported once in your app

function HomeIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

function isDescendant(older: TreeItem, younger: TreeItem): boolean {
    return (
        !!older.children &&
        typeof older.children !== 'function' &&
        older.children.some(
            child => child === younger || isDescendant(child, younger)
        )
    );
}

const theme: ThemeProps = {
    nodeContentRenderer: (props, context) => {
        const {
            scaffoldBlockPxWidth,
            toggleChildrenVisibility,
            connectDragPreview,
            connectDragSource,
            isDragging,
            canDrop,
            canDrag,
            node,
            title,
            subtitle,
            draggedNode,
            path,
            treeIndex,
            isSearchMatch,
            isSearchFocus,
            icons,
            buttons,
            className,
            style,
            didDrop,
            lowerSiblingCounts,
            listIndex,
            swapFrom,
            swapLength,
            swapDepth,
            treeId, // Not needed, but preserved for other renderers
            isOver, // Not needed, but preserved for other renderers
            parentNode, // Needed for dndManager
            ...otherProps
        } = props;
        const nodeTitle = title || node.name;
        const nodeSubtitle = subtitle || node.subtitle;

        const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
        const isLandingPadActive = !didDrop && isDragging;

        const nodeContent = connectDragPreview(
            <div
                className={
                    styles.row +
                    (isLandingPadActive ? ` ${styles.rowLandingPad}` : '') +
                    (isLandingPadActive && !canDrop ? ` ${styles.rowCancelPad}` : '') +
                    (isSearchMatch ? ` ${styles.rowSearchMatch}` : '') +
                    (isSearchFocus ? ` ${styles.rowSearchFocus}` : '') +
                    (className ? ` ${className}` : '') +
                    (node.isSelected ? ` ${styles.selected}` : '')
                }
                style={{
                    opacity: isDraggedDescendant ? 0.5 : 1,
                    ...style,
                }}
            >
                <div
                    className={
                        styles.rowContents +
                        (!canDrag ? ` ${styles.rowContentsDragDisabled}` : '')
                    }
                >
                    <HomeIcon fontSize={"small"}/>
                    <div className={styles.rowLabel}>
                <span
                    className={
                        styles.rowTitle +
                        (node.subtitle ? ` ${styles.rowTitleWithSubtitle}` : '')
                    }
                >
                  {typeof nodeTitle === 'function'
                      ? nodeTitle({
                          node,
                          path,
                          treeIndex,
                      })
                      : nodeTitle}
                </span>

                        {nodeSubtitle && (
                            <span className={styles.rowSubtitle}>
                {typeof nodeSubtitle === 'function'
                    ? nodeSubtitle({
                        node,
                        path,
                        treeIndex,
                    })
                    : nodeSubtitle}
              </span>
                        )}
                    </div>

                    <div className={styles.rowToolbar}>
                        {buttons?.map((btn, index) => (
                            <div
                                key={index} // eslint-disable-line react/no-array-index-key
                                className={styles.toolbarButton}
                            >
                                {btn}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        return (
            <div style={{ height: '100%' }} {...otherProps}>
                {toggleChildrenVisibility &&
                node.children &&
                (node.children.length > 0 || typeof node.children === 'function') && (
                    <div>
                        <button
                            type="button"
                            aria-label={node.expanded ? 'Collapse' : 'Expand'}
                            className={
                                node.expanded ? styles.collapseButton : styles.expandButton
                            }
                            style={{ left: -0.5 * scaffoldBlockPxWidth }}
                            onClick={() =>
                                toggleChildrenVisibility({
                                    node,
                                    path,
                                    treeIndex,
                                })
                            }
                        />

                        {node.expanded &&
                        !isDragging && (
                            <div
                                style={{ width: scaffoldBlockPxWidth }}
                                className={styles.lineChildren}
                            />
                        )}
                    </div>
                )}

                <div
                    className={
                        styles.rowWrapper +
                        (!canDrag ? ` ${styles.rowWrapperDragDisabled}` : '')
                    }
                >
                    {canDrag
                        ? connectDragSource(nodeContent, { dropEffect: 'copy' })
                        : nodeContent}
                </div>
            </div>
        );
    }
}

interface TemplateTreeProps {
    treeData: TreeItem[],
    onChange: (treeData: TreeItem[]) => void,
    onLabelClickHandler: (node: TreeItem, e: any) => any
}

const TemplateTree = (props: TemplateTreeProps) => {
    return (
        <SortableTree
            treeData={props.treeData}
            onChange={props.onChange}
            theme={theme}
            scaffoldBlockPxWidth={15}
            rowHeight={22}
            slideRegionSize={50}
            generateNodeProps={node => {
                return {
                    onClick: (e:any) => props.onLabelClickHandler(node, e),
                    id: node.node.id,
                }
            }}
        />
    )
}

export default TemplateTree;