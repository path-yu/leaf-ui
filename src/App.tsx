import Alert from "./components/Alert/Alert";
import Button from "./components/Button/Button";
import Menu from './components/Menu/Menu';
import { MenuItem } from './components/Menu/MenuItem';
import SubMenu from './components/Menu/SubMenu';
function App() {
  return (
    <div className="App">
      <Button autoFocus>
        <span>button 按钮</span>
      </Button>
      <Button disabled>
        <span>button 按钮</span>
      </Button>
      <Button
        target="_blank"
        className="43434"
        href="www.baidu.com"
        btnType="link"
        autoFocus
      >
        43
      </Button>
      <Button href="www.baidu.com" btnType="danger">
        danger
      </Button>
      <Button size="lg" share="circle" href="www.baidu.com" btnType="primary">
        danger
      </Button>
      {/* <Alert title="this is Alert" description="hello alert" /> */}
      <Alert type="danger" title="this is Alert" description="hello alert" />
      <Alert type="warning" title="this is Alert" description="hello alert" />
      <Menu
        defaultIndex="1"
        mode="vertical"
        defaultOpenSubMenus={['3']}
        onSelect={(index) => {
          alert(index);
        }}
      >
        <MenuItem disabled>one</MenuItem>
        <MenuItem>two</MenuItem>
        <MenuItem>three</MenuItem>
        <SubMenu title="SubMenu">
          <MenuItem>active</MenuItem>
          <MenuItem>test</MenuItem>
        </SubMenu>
      </Menu>
    </div>
  );
}

export default App;
