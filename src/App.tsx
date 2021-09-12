import Alert from './components/Alert/Alert';
import Button from './components/Button/Button';
import Icon from './components/Icon/Icon';
import Menu from './components/Menu/Menu';
import { MenuItem } from './components/Menu/MenuItem';
import SubMenu from './components/Menu/SubMenu';
import TabPane from './components/Tabs/TabPane';
import Tabs from './components/Tabs/Tabs';
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
      <Menu mode="horizontal" defaultIndex="1" defaultOpenSubMenus={['3']}>
        <MenuItem disabled>one</MenuItem>
        <MenuItem>two</MenuItem>
        <MenuItem>three</MenuItem>
        <SubMenu title="submenu">
          <MenuItem>two</MenuItem>
          <MenuItem>three</MenuItem>
        </SubMenu>
      </Menu>
      <Tabs
        onChange={(index) => {
          console.log(index);
        }}
        defaultIndex={3}
        type="line"
        activeBarMode="fill"
        animated
      >
        <TabPane label="tab1">content1</TabPane>
        <TabPane label="tab1">content2</TabPane>
        <TabPane label="tab1">content3</TabPane>
        <TabPane disabled tab={(index) => <span>tab55</span>} label="tab1">
          content4
        </TabPane>
        <TabPane tab={(index) => <span>tab55</span>} label="tab1">
          content4
        </TabPane>
      </Tabs>
      <Icon icon="film" theme="primary" size="10x" />
    </div>
  );
}

export default App;
