import { Key } from 'react';
import { DataNodeListItem } from './Tree';

export interface TreeExpose {
  /**
   * @description 更新当前展开的节点
   */
  updateExpandedKeys: (keys: Key[]) => DataNodeListItem[];
  /**
   * @description 更新当前复选框勾选节点
   */
  updateCheckedKeys: (keys: Key[]) => DataNodeListItem[];
  /**
   * @description 更新当前选中的节点
   */
  updateSelectKeys: (Keys: Key[]) => DataNodeListItem[];
  /**
   * @description 获取当前展开节点key列表
   */
  getExpandedKeys: () => Key[];
  /**
   * @description 获取当前复选框选中的节点key列表
   */
  getCheckedKeys: () => Key[];
  /**
   * @description 获取当前选中的节点key列表
   */
  getSelectedKeys: () => Key[];
  /**
   * @description 获取Tree内部平铺结构的树列表
   */
  getFlatTreeList: () => DataNodeListItem[];
}
export default (props: Partial<TreeExpose>) => () => {};
