import React, {
  ChangeEvent,
  Key,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { cloneDeep } from 'lodash';
import AnimateList from '../AnimateList/AnimateList';
import './Tree.scss';
import { Checkbox } from '../../index';
import classNames from 'classnames';
import { TreeExpose } from './TreeExpose.api';

export interface DataNode extends DataNodeItem {
  children?: DataNode[];
  [key: string]: any;
}
export interface DataNodeItem {
  //标题
  title: string | ReactNode;
  // 每个节点独一无二的key
  key: Key;
  // 禁掉响应
  disabled?: boolean;
  // 禁掉响应
  disableCheckbox?: boolean;
  // icon	自定义图标。可接收组件，props 为当前节点 props
  icon: ReactNode | iconRenderFn;
  // 当树为 checkable 时，设置独立节点是否展示 Checkbox
  checkable?: boolean;
  // 	设置节点是否可被选中
  selectable?: boolean;
}
type iconRenderFn = (props: unknown) => ReactNode;
export interface SelectNodeEventInfo {
  event: string;
  nativeEvent: MouseEvent;
  node: DataNodeListItem;
  selected: boolean;
  selectNodes: DataNodeListItem[];
}
export interface DataNodeListItem extends DataNodeItem {
  indent: number;
  hasChildren: boolean;
  expand?: boolean; //是否展开 默认为true
  parent?: DataNodeListItem | null;
  checked?: boolean;
  selected?: boolean;
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
   * @description 默认选中复选框的树节点
   * @default []
   */
  defaultCheckedKeys?: Key[];
  /**
   * @description 默认选中的树节点
   * @default []
   */
  defaultSelectedKeys?: Key[];
  /**
   * @description 展开/收起节点时触发
   */
  onExpand?: (expandedKeys: Key[], expand?: boolean, node?: DataNodeListItem) => void;
  /**
   * @description 点击复选框触发
   */
  onCheck?: (
    checkedKeys: Key[],
    payload?: { e: ChangeEvent<HTMLInputElement>; node: DataNodeListItem; checked: boolean },
  ) => void;
  /**
   * @description 选中节点触发
   */
  onSelect?: (selectedKeys: Key[], info?: SelectNodeEventInfo) => void;
  /**
   * @description 节点前添加复选框
   * @default false
   */
  checkable?: boolean;
  /**
   * @description 是否可选中
   * @default true
   */
  selectable?: boolean;
  /**
   * @description 节点title属性别名，treeNode默认取title属性作为标题，可以指定不同的属性来设置标题
   */
  titleAlias?: string;
  /**
   * @description 节点key属性别名
   */
  keyAlias?: string;
  /**
   * @description 支持点选多个节点
   * @default false
   */
  multiple?: boolean;
  /**
   * @description 默认展开所有节点
   * @default false
   */
  defaultExpandAll?: boolean;
  /**
   * @description 默认勾选所有复选框节点
   * @default false
   */
  defaultCheckedAll?: boolean;
  /**
   * @description 默认选中所有节点
   * @default false
   */
  defaultSelectedAll?: boolean;
  /**
   * @description 当复选框勾选为可以展开的节点时自动展开该节点
   * @default false
   */
  autoParentExpandNode?: boolean;
  /**
   * @description  tree内部会将树进行平铺，转成一维结构，使用该钩子对做一些过滤数据工作
   */
  filterTreeListCallback?: (item: DataNodeListItem) => boolean;
}
type expandNodeChildMap = Map<
  any,
  { childList: DataNodeListItem[]; expand: boolean; checked: boolean; rawTarget: DataNodeListItem }
>;
function computedExpandNodeChildListMap(treeList: DataNodeListItem[]) {
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
  return map as expandNodeChildMap;
}
function getCurrentChildrenTreeList(list: DataNodeListItem[], target: DataNodeListItem) {
  let result = [];
  for (let item of list) {
    if (item.indent > target.indent) {
      result.push(item);
    } else {
      return result;
    }
  }
  return result;
}
const Tree: ForwardRefRenderFunction<TreeExpose, TreeProps> = (props, ref) => {
  const {
    treeData,
    defaultExpandedKeys = [],
    defaultCheckedKeys = [],
    defaultSelectedKeys = [],
    checkable = false,
    multiple = false,
    selectable = true,
    keyAlias,
    titleAlias,
    onSelect,
    onExpand,
    onCheck,
    defaultExpandAll = false,
    defaultCheckedAll = false,
    defaultSelectedAll = false,
    autoParentExpandNode = false,
    filterTreeListCallback = (item) => true,
  } = props;
  const selectNodeKey = useRef<Key[]>([]);
  const ctrlAndCommandHasClick = useRef(false);
  let flatTreeList = useMemo(() => {
    let treeList = treeToArray({
      tree: treeData,
    });
    // 没有设置key, 用index代替
    treeList.forEach((item, index) => {
      if (!item.key) {
        item.key = index;
      }
    });
    return treeList.filter(filterTreeListCallback);
  }, [treeData]);
  //保存所有可以展开节点的所有子节点列表map
  const expendNodeChildListMap = useMemo<expandNodeChildMap>(
    () => computedExpandNodeChildListMap(flatTreeList),
    [treeData],
  );
  const [treeList, setTreeList] = useState<DataNodeListItem[]>([]);
  function treeToArray({
    tree,
    result = [],
    parent,
    indent,
  }: {
    tree: DataNode[];
    result?: DataNodeListItem[];
    parent?: DataNodeListItem | null;
    indent?: number;
  }) {
    tree.forEach((item, index) => {
      const { children = [], ...props } = item;
      let current: DataNodeListItem = {
        ...props,
        indent: indent === undefined ? 0 : indent + 1,
        hasChildren: children.length > 0,
        parent,
      };
      handleDataNodeParams({
        current,
        item,
      });
      result.push(current);
      treeToArray({
        tree: children,
        result,
        parent: current,
        indent: current.indent,
      });
    });
    return result;
  }
  const getSelectNode = () => {
    return treeList.reduce((prev, cur) => {
      if (selectNodeKey.current.some((key) => key === cur.key)) {
        prev.push(cloneDeep(cur));
      }
      return prev;
    }, [] as DataNodeListItem[]);
  };
  const getExpandedKeys = () => {
    return Array.from(expendNodeChildListMap.values())
      .filter((value) => value.expand)
      .map((c) => c.rawTarget.key);
  };
  const getCheckedKeys = () => {
    return flatTreeList.filter((tree) => tree.checked && !tree.disableCheckbox).map((c) => c.key);
  };
  const compareTreeList = (newTreeList: DataNodeListItem[]) => {
    return newTreeList.filter((item) => treeList.some((tree) => tree.key === item.key));
  };
  function handleDataNodeParams(data: { current: DataNodeListItem; item: DataNode }) {
    let { item, current } = data;
    if (keyAlias !== undefined) {
      current.key = item[keyAlias];
    }
    if (titleAlias !== undefined) {
      current.title = item[titleAlias];
    }
    if (item.children?.length) {
      current.expand = defaultExpandedKeys.includes(current.key);
      if (defaultExpandAll) {
        current.expand = true;
      }
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
      current.checked = defaultCheckedKeys.includes(current.key);
    }
    if (item.checkable === undefined) {
      current.checkable = checkable;
    }
    if (selectable) {
      current.selected = defaultSelectedKeys.includes(current.key);
    }
    if (item.selectable === undefined) {
      current.selectable = selectable;
    }
  }
  function initTree() {
    let list: DataNodeListItem[] = [];
    let allKey = flatTreeList.map((c) => c.key);
    if (checkable) {
      updateCheckedKeys(defaultCheckedAll ? allKey : defaultCheckedKeys, false);
    }
    if (selectable) {
      updateSelectKeys(defaultSelectedAll ? allKey : defaultSelectedKeys, false);
    }
    if (defaultExpandAll) {
      list = updateExpandedKeys(allKey, false);
    } else {
      list = updateExpandedKeys(defaultExpandedKeys, false);
    }
    return list;
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      ctrlAndCommandHasClick.current = true;
    }
  };
  const handleKeyup = () => {
    if (ctrlAndCommandHasClick.current) {
      ctrlAndCommandHasClick.current = false;
    }
  };
  const handleExpandClick = (index: number) => {
    let current = treeList[index];
    let expandedKeys = getExpandedKeys();
    if (current.expand) {
      expandedKeys = expandedKeys.filter((key) => current.key !== key);
    } else {
      expandedKeys.push(current.key);
    }
    updateExpandedKeys(expandedKeys);
    if (typeof onExpand === 'function') {
      onExpand(getExpandedKeys(), !current!.expand, current);
    }
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    let current = treeList[index];
    let checkedKeys = getCheckedKeys();
    let childListKey: Key[] = [];
    let parentKeys = getChildAllParentKeys(current);
    if (current.hasChildren) {
      childListKey = expendNodeChildListMap
        .get(current.key)!
        .childList.filter((c) => !c.disableCheckbox)
        .map((c) => c.key);
    }
    if (current.checked) {
      checkedKeys = checkedKeys.filter(
        (k) => k !== current.key && !parentKeys.includes(k) && !childListKey.includes(k),
      );
      updateCheckedKeys(checkedKeys, true);
    } else {
      checkedKeys.push(current.key);
      updateCheckedKeys(checkedKeys, true);
      if (current.hasChildren && autoParentExpandNode && !current.expand) {
        handleExpandClick(index);
      }
    }
  };
  const getChildAllParentKeys = (item: DataNodeListItem) => {
    let keys = [];
    let parent: DataNodeListItem | null | undefined = item.parent;
    while (parent) {
      keys.push(parent.key);
      parent = parent?.parent;
    }
    return keys;
  };
  const filterCheckboxChildList = (childList: DataNodeListItem[]) => {
    return childList.filter((child) => !child.disableCheckbox);
  };
  const handleTreeItemClick = (e: ReactMouseEvent, index: number) => {
    let current = treeList[index];
    if (!current.selectable || current.disabled) return;
    let newTreeList = [...treeList];
    let selected = !newTreeList[index].selected;
    // 单选
    if (!ctrlAndCommandHasClick.current || !multiple) {
      if (selected) {
        selectNodeKey.current = [current.key];
      } else {
        selectNodeKey.current = [];
      }
      newTreeList.forEach((tree) => (tree.selected = false));
      if (!multiple) {
        newTreeList[index].selected = selected;
      } else {
        newTreeList[index].selected = true;
      }
    } else {
      if (selected) {
        selectNodeKey.current.push(current.key);
      } else {
        selectNodeKey.current = selectNodeKey.current.filter((key) => key !== current.key);
      }
      newTreeList[index].selected = selected;
    }
    let info: SelectNodeEventInfo = {
      event: 'select',
      nativeEvent: e.nativeEvent,
      node: cloneDeep(current),
      selected,
      selectNodes: selectNodeKey.current.length ? getSelectNode() : [],
    };
    setTreeList(newTreeList);
    onSelect?.(selectNodeKey.current, info);
  };
  const updateCheckedKeys = (keys: Key[], setAction = true, init = true) => {
    if (!checkable) return [];
    let newTreeList = [...flatTreeList];
    newTreeList.forEach((item) => {
      item.checked = keys.includes(item.key);
      let expandNode = expendNodeChildListMap.get(item.key)!;
      if (item.hasChildren) {
        expandNode.checked = item.checked;
        expandNode.rawTarget.checked = item.checked;
      }
    });
    expendNodeChildListMap.forEach((expandNode) => {
      let filterChildList = filterCheckboxChildList(expandNode.childList);
      // 父节点选中, 选中子节点
      if (expandNode.checked) {
        filterChildList.forEach((c) => (c.checked = true));
      } else {
        if (filterChildList.every((c) => c.checked)) {
          expandNode.checked = true;
          expandNode.rawTarget.checked = true;
        }
      }
    });
    expendNodeChildListMap.forEach((expandNode) => {
      let filterChildList = filterCheckboxChildList(expandNode.childList);
      let checkedList = filterChildList.filter((c) => c.checked);
      // // 子节点选中 和父节点进行联动
      expandNode.checked = checkedList.length === filterChildList.length;
      expandNode.rawTarget.checked = checkedList.length === filterChildList.length;
      expandNode.rawTarget.indeterminate =
        !!checkedList.length && checkedList.length < filterChildList.length;
    });
    if (setAction) {
      let newList = compareTreeList(newTreeList);
      setTreeList(newList);
      onCheck?.(getCheckedKeys());
      return newList;
    }
    return newTreeList;
  };
  const updateExpandedKeys = (keys: Key[], setAction = true) => {
    let newTreeList = [...flatTreeList];
    // 确保key是可以展开的节点
    for (let key of keys) {
      if (!expendNodeChildListMap.has(key)) {
        keys = keys.filter((val) => val !== key);
      }
    }
    newTreeList.forEach((item) => {
      if (item.hasChildren) {
        item.expand = keys.includes(item.key);
        expendNodeChildListMap.get(item.key)!.expand = item.expand;
      }
    });
    let list = newTreeList.filter((item) => {
      if (!item.parent) return true;
      // 向上查找父节点, 直到找到未展开的节点为止
      let parent: DataNodeListItem | null | undefined = item.parent;
      while (parent) {
        if (!parent.expand) {
          return false;
        }
        parent = parent?.parent;
      }
      return true;
    });
    if (setAction) {
      setTreeList(list);
      onExpand?.(getExpandedKeys());
    }
    return list;
  };
  const updateSelectKeys = (keys: Key[], setAction = true) => {
    let list = [...flatTreeList];
    // 开启多选，才可以批量选择
    if (!multiple) {
      keys = [keys[0]];
    }
    list.forEach((item) => {
      item.selected = keys.includes(item.key);
    });
    let newTree = compareTreeList(list);
    selectNodeKey.current = keys;
    if (setAction) {
      setTreeList(newTree);
      onSelect?.(keys);
    }
    return newTree;
  };
  useEffect(() => {
    setTreeList(initTree());
    multiple && document.body.addEventListener('keydown', handleKeyDown);
    multiple && document.body.addEventListener('keyup', handleKeyup);
    return () => {
      multiple && document.body.removeEventListener('keydown', handleKeyDown);
      multiple && document.body.removeEventListener('keyup', handleKeyup);
    };
  }, [treeData]);
  useImperativeHandle(ref, () => {
    return {
      updateCheckedKeys,
      updateExpandedKeys,
      updateSelectKeys,
      getExpandedKeys,
      getCheckedKeys,
      getSelectedKeys: () => selectNodeKey.current,
      getFlatTreeList: () => flatTreeList,
    };
  });
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
        {item.checkable && (
          <Checkbox
            onChange={(e) => handleCheckboxChange(e, index)}
            checked={item.checked}
            indeterminate={item.indeterminate}
            disabled={item.disableCheckbox}
          />
        )}
        <span
          className={classNames('tree-item-wrapper', {
            'tree-item-selected': item.selected,
          })}
          onClick={(e) => handleTreeItemClick(e, index)}
        >
          {item.icon && (
            <span style={{ fontSize: '14px' }}>
              {typeof item.icon === 'function' ? item.icon(props) : item.icon}
            </span>
          )}
          <span className="tree-item-title">{item.title}</span>
        </span>
      </div>
    );
  };
  return (
    <div className="tree">
      <AnimateList
        duration={300}
        keys={(item: any) => item.key}
        items={treeList}
        buildItem={renderTreeItem}
      />
    </div>
  );
};
export default forwardRef(Tree);
