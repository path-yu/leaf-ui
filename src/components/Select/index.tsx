import { FC } from 'react';
import Option, { SelectOptionProps } from './Option';
import Select, { SelectProps } from './Select';
import './_style.scss';
export type ISelectComponent = FC<SelectProps> & {
  Option: FC<SelectOptionProps>;
};

const TransSelect = Select as ISelectComponent;
TransSelect.Option = Option;

export default TransSelect;
