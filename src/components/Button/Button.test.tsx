import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Button, { ButtonProps } from './button';
const defaultProps: ButtonProps = {
  onClick: jest.fn(),
};

const testProps: ButtonProps = {
  btnType: 'primary',
  size: 'lg',
  className: 'testClass',
};

const disabledProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn(),
};
describe('test Button Component', () => {
  it('should render the correct default Button', () => {
    const wrapper = render(<Button {...defaultProps}>Nice</Button>);
    const element = wrapper.getByText('Nice') as HTMLButtonElement;
    expect(element).toBeInTheDocument(); // 是否正常渲染在页面
    expect(element.tagName).toEqual('BUTTON'); // 渲染tagName 是否为BUTTON
    expect(element.disabled).toBeFalsy(); // disable是否为false
    fireEvent.click(element); //模拟点击事件触发
    expect(defaultProps.onClick).toHaveBeenCalled(); // 点击事件是否触发
  });
  it('should render a link when btnType equals link  and href is provided', () => {
    const wrapper = render(<Button {...testProps}>Nice</Button>);
    const element = wrapper.getByText('Nice');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('btn-primary btn-lg testClass');
  });
  it('should render a link when btnTYpe equals link and href is provided', () => {
    const wrapper = render(
      <Button btnType="link" href="http://dummyurl">
        Nice
      </Button>,
    );
    const element = wrapper.getByText('Nice');
    expect(element.tagName).toEqual('A');
    expect(element).toHaveClass('btn btn-link');
  });
  it('should render disabled button when disabled set to true', () => {
    const wrapper = render(<Button {...disabledProps}>Nice</Button>);
    const element = wrapper.getByText('Nice') as HTMLButtonElement;
    expect(element).toBeInTheDocument();
    expect(element.disabled).toBeTruthy();
    fireEvent.click(element);
    expect(disabledProps.onClick).not.toHaveBeenCalled();
  });
});
