import { ReactElement } from 'react';

interface DataSourceObject {
  value: string;
}
export enum keyBoardEnum {
  'ArrowUp' = 'ArrowUp',
  'ArrowDown' = 'ArrowDown',
  'Enter' = 'Enter',
  'Escape' = 'Escape',
}

export type DataSourceType<T = {}> = T & DataSourceObject;
export interface AutoCompleteProps {
  /**
   * 返回输入建议的方法，可以拿到当前的输入，然后返回同步的数组或者是异步的 Promise
   */
  fetchSuggestions: (
    str: string,
  ) => DataSourceType[] | Promise<DataSourceType[]>;
  /** 点击选中建议项时触发的回调*/
  onSelect: (item: DataSourceType) => void;
  /** 支持自定义渲染下拉选项 */
  renderOption?: (item: DataSourceType) => ReactElement;
}
export default (props: AutoCompleteProps) => {};
