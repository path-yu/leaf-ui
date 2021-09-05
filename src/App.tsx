import Button from "./components/Button/Button";
function App() {
  return (
    <div className="App">
      <Button autoFocus>
        <span>button 按钮</span>
      </Button>
      <Button disabled>
        <span>button 按钮</span>
      </Button>
      <Button target="_blank" className="43434" href="www.baidu.com" btnType="link" autoFocus>
        43
      </Button>
      <Button href="www.baidu.com" btnType="danger">
        danger
      </Button>
      <Button size="lg" href="www.baidu.com" btnType="primary">
        danger
      </Button>
    </div>
  );
}

export default App;
