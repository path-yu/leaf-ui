import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Collapse, { CollapseProps } from './Collapse';
import CollapseItem, { CollapseItemProps } from './CollapseItem';

const generateCollapse = (collapseProps?: CollapseProps, collapseItemProps?: CollapseItemProps) => {
  return (
    <Collapse data-testid="container" {...collapseProps}>
      <CollapseItem title="JavaScript" name="1" {...collapseItemProps}>
        <div>nodejs</div>
        <div>vue</div>
        <div>react</div>
      </CollapseItem>
      <CollapseItem title="java" name="2" {...collapseItemProps}>
        <div>springBoot</div>
        <div>myBatisPlus</div>
        <div>shiro</div>
        <div>Redis</div>
        <div>mysql</div>
      </CollapseItem>
    </Collapse>
  );
};
const testProps: CollapseProps = {
  onItemHeaderClick: jest.fn(),
};
describe('test default Collapse component', () => {
  test('should render the correct default Collapse', () => {
    const wrapper = render(generateCollapse());
    const containerEle = wrapper.getByTestId('container');
    const firstCollapseItemEle = wrapper.getByText('JavaScript');
    let arrow = firstCollapseItemEle.previousElementSibling;
    // test is render
    expect(containerEle).not.toBeNull();
    expect(containerEle.children.length).toEqual(2);
    expect(firstCollapseItemEle).toBeInTheDocument();
    expect(firstCollapseItemEle.nextElementSibling).not.toBeInTheDocument();
    expect(arrow).toBeInTheDocument();
    expect(arrow!.className).toEqual('icon-transition');
    expect(arrow!.getAttribute('style')).toEqual('transform: rotate( 0deg );');
    expect(wrapper.queryByText('vue')).toBeNull();
    expect(wrapper.queryByText('react')).toBeNull();
    expect(wrapper.queryByText('Redis')).toBeNull();
    expect(wrapper.queryByText('java')).toBeInTheDocument();
  });
  test('should the arrow position correctly', () => {
    const wrapper = render(generateCollapse({ arrowPlacement: 'right' }));
    const titleEle = wrapper.getByText('JavaScript');
    expect(titleEle!.nextElementSibling).toBeInTheDocument();
    expect(titleEle!.previousElementSibling).not.toBeInTheDocument();
  });
  test('test whether clicking the title calls', () => {
    const wrapper = render(generateCollapse(testProps));
    const titleEle = wrapper.getByText('JavaScript') as HTMLSpanElement;
    fireEvent.click(titleEle);
    expect(titleEle).toBeInTheDocument();
    expect(testProps.onItemHeaderClick).toBeCalled();
  });
  test('test accordion effect', async () => {
    const wrapper = render(generateCollapse({ accordion: true }));
    const fistTitle = wrapper.getByText('JavaScript') as HTMLSpanElement;
    const lastTitle = wrapper.getByText('java') as HTMLSpanElement;
    fireEvent.click(fistTitle);
    await waitFor(() => {
      expect(wrapper.queryByText('vue')!.parentElement!.className).toEqual('');
      expect(wrapper.queryByText('springBoot')).not.toBeInTheDocument();
    });
    fireEvent.click(lastTitle);
    await waitFor(() => {
      expect(wrapper.queryByText('vue')!.parentElement!.className).toEqual('hidden');
      expect(wrapper.queryByText('springBoot')!.parentElement!.className).toEqual('');
    });
  });
});
