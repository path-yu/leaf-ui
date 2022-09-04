import React, { ChangeEvent, FC, Key, ReactNode, useEffect, useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';
import AnimateList from '../AnimateList/AnimateList';
import './Tree.scss';
import { Checkbox } from '../../index';
import classNames from 'classnames';

export interface DataNode extends DataNodeItem {
  children?: DataNode[];
}
interface DataNodeItem {
  title: string | ReactNode;
  key: Key;
  disabled?: boolean;
  disableCheckbox?: boolean;
}
export interface DataNodeListItem extends DataNodeItem {
  indent: number;
  hasChildren: boolean;
  expand?: boolean; //是否展开 默认为true
  parent?: DataNodeListItem | null;
  checked?: boolean;
  indeterminate?: boolean;
}
export interface TreeProps {
  /**
   * @description treeNodes数据
   */
  treeData: DataNode[];
  /**
   * @description 默认展开指定的树节点
   */
  defaultExpandedKeys?: Key[];
  /**
   * @description 默认选中的树节点
   */
  defaultCheckedKeys?: Key[];
  /**
   * @description 展开/收起节点时触发
   */
  onExpand?: (expandedKeys: Key[], expand: boolean, node: DataNodeListItem) => void;
  /**
   * @description 点击复选框触发
   */
  onCheck?: (
    checkedKeys: Key[],
    payload: { e: ChangeEvent<HTMLInputElement>; node: DataNodeListItem; checked: boolean },
  ) => void;
  /**
   * @description 节点前添加复选框
   * @default false
   */
  checkable?: boolean;
}
function treeToArray({
  tree,
  result = [],
  parent,
  indent,
  defaultExpandedKeys = [],
  defaultCheckedKeys = [],
  checkable = false,
}: {
  tree: DataNode[];
  result?: DataNodeListItem[];
  parent?: DataNodeListItem | null;
  indent?: number;
  defaultExpandedKeys?: Key[];
  defaultCheckedKeys?: Key[];
  checkable?: boolean;
}) {
  tree.forEach((item, index) => {
    const { children = [], ...props } = item;
    let current: DataNodeListItem = {
      ...props,
      indent: indent === undefined ? 0 : indent + 1,
      hasChildren: children.length > 0,
      parent,
    };
    if (children.length) {
      current.expand = defaultExpandedKeys.includes(current.key);
    }

    if (item.disableCheckbox === undefined) {
      current.disableCheckbox = false;
    }
    if (item.disabled === undefined) {
      current.disabled = false;
    }
    if (item.disabled) {
      current.disableCheckbox = true;
    }
    if (checkable) {
      current.indeterminate = false;
      current.checked = current.disabled
        ? false
        : current.disableCheckbox
        ? false
        : defaultCheckedKeys.includes(current.key);
    }
    result.push(current);
    treeToArray({
      tree: children,
      result,
      parent: current,
      indent: current.indent,
      defaultExpandedKeys,
      defaultCheckedKeys,
      checkable,
    });
  });
  return result;
}
function handleTreeExpandAndChecked(
  treeList: DataNodeListItem[],
  expendNodeChildListMap: expandNodeChildMap,
  checkable?: boolean,
) {
  let newList = [...treeList];
  let newTreeList = newList.map((current) => {
    let target = expendNodeChildListMap.get(current.key);
    if (target) {
      current.expand = current.expand
        ? current.expand
        : target.childList.some((item) => item.expand);
      target.expand = current.expand;
    }
    return current;
  });
  expendNodeChildListMap.forEach((item, current) => {
    // 不展开则删除对应的子节点
    if (!item.expand) {
      let startIndex = treeListFindByKey(newTreeList, current);
      if (newTreeList[startIndex]) {
        newTreeList.splice(startIndex + 1, item.childList.length);
      }
    }
  });
  if (checkable) {
    initTreeChecked(newTreeList, expendNodeChildListMap);
  }
  return newTreeList;
}
const initTreeChecked = (
  treeList: DataNodeListItem[],
  expendNodeChildListMap: expandNodeChildMap,
) => {
  treeList.forEach((item) => {
    // 父节点已选中, 选中子节点
    if (item.hasChildren && item.checked && !item.disabled) {
      let { childList } = expendNodeChildListMap.get(item.key)!;
      childList.forEach((child) => {
        if (!child.disableCheckbox) {
          child.checked = true;
        }
      });
    }
  });
  handleChildNodeCheckParent(treeList, expendNodeChildListMap);
};
const handleChildNodeCheckParent = (
  treeList: DataNodeListItem[],
  expendNodeChildListMap: expandNodeChildMap,
) => {
  treeList.forEach((item) => {
    if (item.hasChildren) {
      let { childList } = expendNodeChildListMap.get(item.key)!;
      // 过滤掉被禁用元素
      childList = childList.filter(
        (child) => !child.parent?.disabled && !child.disabled && !child.disableCheckbox,
      );
      // 子节点选中 和父节点进行联动
      let checkedList = childList.filter((child) => child.checked);
      if (!item.disableCheckbox) {
        item.checked = checkedList.length === childList.length;
        item.indeterminate = !!checkedList.length && checkedList.length < childList.length;
        expendNodeChildListMap.get(item.key)!.checked = item.checked;
        expendNodeChildListMap.get(item.key)!.rawTarget.checked = item.checked;
      }
    }
  });
};
const updateExpandNodeChildListChecked = (
  expendNodeChildListMap: expandNodeChildMap,
  targetKey: Key,
  checked: boolean,
  parentKey?: Key,
) => {
  expendNodeChildListMap.forEach((item) => {
    item.childList.forEach((child) => {
      if (child.key === targetKey || child.key === parentKey) {
        child.checked = checked;
      }
    });
    // 更新父节点
    item.checked = item.childList
      .filter((child) => !child.parent?.disabled && !child.disabled && !child.disableCheckbox)
      .every((c) => c.checked);
  });
};

const computedExpandNodeChildListMap = (treeList: DataNodeListItem[]) => {
  let map = new Map();
  treeList.forEach((item, index) => {
    if (item.hasChildren) {
      let sliceTreeList = treeList.slice(index + 1, treeList.length + 1);
      let childList = getCurrentChildrenTreeList(sliceTreeList, item);
      map.set(item.key, {
        childList,
        expand: item.expand,
        checked: item.checked,
        rawTarget: item,
      });
    }
  });
  return map;
};
function treeListFindByKey(treeList: DataNodeListItem[], current: any) {
  return treeList.findIndex((node) => node.key === current);
}
const getCurrentChildrenTreeList = (list: DataNodeListItem[], target: DataNodeListItem) => {
  let result = [];
  for (let item of list) {
    if (item.indent > target.indent) {
      result.push(item);
    } else {
      return result;
    }
  }
  return result;
};
const filterCheckedKeys = (treeList: DataNodeListItem[]) => {
  return treeList.filter((item) => item.checked).map((item) => item.key);
};
type expandNodeChildMap = Map<
  any,
  { childList: DataNodeListItem[]; expand: boolean; checked: boolean; rawTarget: DataNodeListItem }
>;
const Tree: FC<TreeProps> = (props) => {
  const {
    treeData,
    onExpand,
    defaultExpandedKeys = [],
    defaultCheckedKeys = [],
    checkable = false,
    onCheck,
  } = props;
  let flatTreeList = useMemo(
    () => treeToArray({ tree: treeData, defaultExpandedKeys, defaultCheckedKeys, checkable }),
    [treeData],
  );
  //保存所有可以展开节点的所有子节点列表map
  const expendNodeChildListMap = useMemo<expandNodeChildMap>(
    () => computedExpandNodeChildListMap(flatTreeList),
    [treeData],
  );
  const [treeList, setTreeList] = useState<DataNodeListItem[]>([]);
  const handleExpandClick = (index: number) => {
    let current = treeList[index];
    let target = expendNodeChildListMap.get(current.key);
    let { childList } = target!;
    let newList = cloneDeep(treeList);
    let firstIndex = treeList.findIndex((node) => node.key === current.key);
    if (current.expand) {
      let sliceTreeList = getCurrentChildrenTreeList(
        treeList.slice(index + 1, treeList.length + 1),
        current,
      );
      newList.splice(firstIndex + 1, sliceTreeList.length);
    } else {
      let list = childList.filter(
        (item) =>
          item.expand ||
          item.parent?.expand ||
          (item.parent?.expand !== undefined && item.indent === current.indent + 1),
      );
      newList.splice(firstIndex + 1, 0, ...(list.length ? list : childList));
    }
    newList[index].expand = !newList[index].expand;
    target!.expand = newList[index].expand!;
    expendNodeChildListMap.forEach((item) => {
      item.childList.forEach((child) => {
        if (child.key === current.key) {
          child.expand = newList[index].expand;
        }
        if (child.parent?.key === current.key) {
          child.parent!.expand = newList[index].expand;
        }
      });
    });
    let expandKeys = Array.from(expendNodeChildListMap.keys()).filter(
      (key) => expendNodeChildListMap.get(key)!.expand,
    );
    if (typeof onExpand === 'function') {
      onExpand(expandKeys, target!.expand, current);
    }
    setTreeList(newList);
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    let checked = e.target.checked;
    let newTreeList = cloneDeep(treeList);
    let current = newTreeList[index];
    newTreeList[index].checked = checked;
    updateExpandNodeChildListChecked(
      expendNodeChildListMap,
      current.key,
      checked,
      current.parent?.key,
    );
    if (current.hasChildren) {
      let target = expendNodeChildListMap.get(current.key)!;
      target.checked = checked;
      target.childList.forEach((child) => {
        if (!child.disableCheckbox) {
          child.checked = checked;
        }
      });
      newTreeList.forEach((item) => {
        let isChild = target.childList.find((child) => child.key === item.key);
        if (isChild && !item.disableCheckbox) {
          item.checked = checked;
        }
      });
    }
    handleChildNodeCheckParent(newTreeList, expendNodeChildListMap);
    let checkedKeys: Key[] = [];
    expendNodeChildListMap.forEach((item) => {
      checkedKeys.push(...filterCheckedKeys(item.childList));
    });
    let expandNodeList = [...expendNodeChildListMap.values()].map((item) => item.rawTarget);
    checkedKeys.push(...filterCheckedKeys(expandNodeList));
    onCheck?.(Array.from([...new Set(checkedKeys)]), { e, node: current, checked });
    setTreeList(newTreeList);
  };
  useEffect(() => {
    setTreeList(handleTreeExpandAndChecked(flatTreeList, expendNodeChildListMap, checkable));
  }, [treeData]);
  const renderTreeItem = (item: DataNodeListItem, index: number) => {
    return (
      <div
        className={classNames('tree-item', {
          'tree-disabled': item.disabled,
        })}
      >
        {<span style={{ paddingLeft: `${item.indent! * 20}px` }}></span>}
        {item.hasChildren && (
          <span
            onClick={() => handleExpandClick(index)}
            style={{ paddingRight: '10px' }}
            className="tree-switcher"
          >
            <span className="anticon-icon">
              <svg
                viewBox="0 0 1024 1024"
                focusable="false"
                data-icon="caret-down"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                style={{
                  transform: `rotate(${item.expand ? 0 : '-90deg'})`,
                  transition: 'transform ease 300ms',
                }}
              >
                <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
              </svg>
            </span>
          </span>
        )}
        {!item.hasChildren && <span style={{ paddingLeft: '20px' }}></span>}
        {checkable && (
          <Checkbox
            onChange={(e) => handleCheckboxChange(e, index)}
            checked={item.disableCheckbox ? false : item.checked}
            indeterminate={item.indeterminate}
            disabled={item.disableCheckbox}
          />
        )}
        <span className="tree-item-title">{item.title}</span>
      </div>
    );
  };
  return (
    <div className="tree">
      <AnimateList
        duration={200}
        keys={(item: any) => item.key}
        items={treeList}
        buildItem={renderTreeItem}
      />
    </div>
  );
};
export default Tree;
