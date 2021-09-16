import { FC } from 'react';
import Option, { SelectOptionProps } from './option';
import Select, { SelectProps } from './select';

export type ISelectComponent = FC<SelectProps> & {
  Option: FC<SelectOptionProps>;
};

const TransSelect = Select as ISelectComponent;
TransSelect.Option = Option;

export default TransSelect;
