import {
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react';
import Menu, { MenuProps } from './Menu';
import { MenuItem } from './MenuItem';
import SubMenu from './SubMenu';

const testProps: MenuProps = {
  defaultIndex: '0',
  onSelect: jest.fn(),
  className: 'test',
};
const testVerticalProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical',
  defaultOpenSubMenus: ['4'],
};
const createStyleFile = () => {
  const cssFile: string = `
   .simple-submenu {
      display: none;
    }
    .menu-opened {
      display:block;
    } 
  `;
  const style = document.createElement('style');
  style.innerHTML = cssFile;
  return style;
};
const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem index="0">active</MenuItem>
      <MenuItem index="1">two</MenuItem>
      <MenuItem index="2" disabled>
        disabled
      </MenuItem>
      <SubMenu title="dropdown">
        <MenuItem>drop1</MenuItem>
      </SubMenu>
      <SubMenu title="opened">
        <MenuItem>opened1</MenuItem>
      </SubMenu>
    </Menu>
  );
};
let wrapper: RenderResult,
  wrapper2: RenderResult,
  menuElement: HTMLElement,
  activeElement: HTMLElement,
  disabledElement: HTMLElement;
describe('test Menu and MenuItem component in default(horizontal) mode', () => {
  beforeEach(() => {
    wrapper = render(generateMenu(testProps));
    wrapper.container.append(createStyleFile());
    menuElement = wrapper.getByTestId('test-menu');
    activeElement = wrapper.getByText('active');
    disabledElement = wrapper.getByText('disabled');
  });
  it('should render correct Menu and MenuItem based on default props', () => {
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass('simple-menu test');
    expect(menuElement.children.length).toEqual(5);
    expect(activeElement).toHaveClass('menu-item is-active');
    expect(disabledElement).toHaveClass('menu-item is-disabled');
  });
  it('click item should change active and call the right callback', () => {
    const thirdItem = wrapper.getByText('two');
    fireEvent.click(thirdItem);
    expect(thirdItem).toHaveClass('is-active');
    expect(testProps.onSelect).toHaveBeenCalledWith('1');
    fireEvent.click(disabledElement);
    expect(disabledElement).not.toHaveClass('is-active');
    expect(testProps.onSelect).not.toHaveBeenCalledWith('2');
  });
  it('should show dropdown items when hover on SubMenu', async () => {
    expect(wrapper.queryByText('drop1')).not.toBeVisible();
    const dropdownElement = wrapper.getByText('dropdown');
    fireEvent.mouseEnter(dropdownElement);
    await waitFor(
      () => {
        expect(wrapper.queryByText('drop1')).toBeVisible();
      },
      { timeout: 300 }
    );
    fireEvent.click(wrapper.getByText('drop1'));
    expect(testProps.onSelect).toHaveBeenCalledWith('3-0');
    fireEvent.mouseLeave(dropdownElement);
    await waitFor(
      () => {
        expect(wrapper.queryByText('drop1')).not.toBeVisible();
      },
      { timeout: 300 }
    );
  });
});
describe('test menu and MenuItem component in vertical mode', () => {
  beforeEach(() => {
    wrapper2 = render(generateMenu(testVerticalProps));
    wrapper2.container.append(createStyleFile());
  });
  it('should render vertical mode when mode is set to vertical', () => {
    const menuElement = wrapper2.getByTestId('test-menu');
    expect(menuElement).toHaveClass('menu-vertical');
  });
  it('should show dropdown items when click on subMenu for vertical mode', () => {
    const dropDownItem = wrapper2.getByText('drop1');
    expect(dropDownItem).not.toBeVisible();
    fireEvent.click(wrapper2.getByText('dropdown'));
    expect(dropDownItem).toBeVisible();
  });
   it('should show subMenu dropdown when defaultOpenSubMenus contains SubMenu index', () => {
     expect(wrapper2.queryByText('opened1')).toBeVisible();
   });
});
