import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import TabPane from './tab-pane';
import Tabs, { TabsProps } from './tabs';

const testProps: TabsProps = {
  defaultIndex: 1,
  onChange: jest.fn(),
};
let wrapper: RenderResult;
describe('test Tabs Component', () => {
  beforeEach(() => {
    wrapper = render(
      <Tabs {...testProps} className="tabsContainer">
        <TabPane label="tab1">content1</TabPane>
        <TabPane label="tab2">content2</TabPane>
        <TabPane label="disabled" disabled>
          content3
        </TabPane>
        <TabPane tab={<span>custom Tab</span>}>content4</TabPane>
      </Tabs>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render the correct default Tabs', () => {
    const { queryByText, container } = wrapper;
    const nav = container.querySelector('.simple-tabs-nav') as HTMLElement;
    expect(getComputedStyle(nav.parentElement as HTMLElement).opacity).toEqual(
      '1',
    );
    expect(nav).toHaveClass('nav-line');
    expect(getComputedStyle(nav).justifyContent).toEqual('flex-start');
    const activeElement = queryByText('tab2');
    expect(activeElement?.parentElement).toHaveClass('is-active');
    expect(queryByText('content2')).toBeInTheDocument();
    expect(queryByText('content1')).not.toBeInTheDocument();
  });
  it('click tabItem should switch to content', () => {
    const { queryByText, getByText } = wrapper;
    const clickedElement = getByText('tab1');
    fireEvent.click(clickedElement);
    expect(testProps.onChange).toHaveBeenCalledWith(0);
    expect(clickedElement).toBeInTheDocument();
    expect(clickedElement.parentElement).toHaveClass('is-active');
    expect(queryByText('content3')).not.toBeInTheDocument();
    fireEvent.click(getByText('tab2'));
    expect(queryByText('content2')).toBeVisible();
    expect(queryByText('content2')).toBeInTheDocument();
  });
  it('click disabled tabPane should not works', () => {
    const { getByText } = wrapper;
    const disableElement = getByText('disabled');
    expect(disableElement.parentElement).toHaveClass('disabled');
    fireEvent.click(disableElement);
    expect(disableElement.parentElement).not.toHaveClass('is-active');
    expect(testProps.onChange).not.toHaveBeenCalled();
  });
  it('should render normally custom tabPane', () => {
    const { getByText, queryByText } = wrapper;
    const customTabElement = getByText('custom Tab');
    expect(customTabElement).toBeInTheDocument();
    expect(queryByText('content4')).not.toBeInTheDocument();
    fireEvent.click(customTabElement);
    expect(queryByText('content4')?.parentElement).toBeInTheDocument();
    expect(queryByText('content4')?.parentElement).toBeVisible();
  });
});
