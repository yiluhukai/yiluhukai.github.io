#### [Portals](https://zh-hans.reactjs.org/docs/portals.html)

在了解`portals`之前我们先了解我为什么要用它，大概情况是这样子的：在一个`taps`中两个表格，每个表格`td`点击都会触发一个弹框效果，但是弹框没有全局而是和`table`元素同级的，点击第一个表格的弹窗时，发现可以正常显示，但是当`tab`切换到弹窗一直显示不出来，审查元素时发现样式什么都正常。为什么？

由于弹窗是`fixed`定位的，且什么设置了居中的效果，但是第一次可以显示而第二次显示，由于`fixed`定位是相对于`viewport`定位的，难道`fixed`定位的失效了，百度下发现真的会有失效的情况：当`fixed`定位的祖先元素中有使用`transform`的，会使`fixed`定位相对于该元素定位而不是`viewport`定位，审查元素发现父元素真的有`transform`。

虽然知道了出现问题的原因但是没有好的办法去修改这种情况，还是希望可以弹窗相对于`viewPort`去定位的。最后想到可以和组件库一样将一个组件的中使用的弹窗挂载到body下面。查了下资料，发小`portals`可以实现我的需求。

##### `Portals`简介

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

```jsx
ReactDOM.createPortal(child, container)
```

第一个参数（`child`）是任何[可渲染的 React 子元素](https://zh-hans.reactjs.org/docs/react-component.html#render)，例如一个元素，字符串或 fragment。第二个参数（`container`）是一个 DOM 元素。

利用该`api`我们可以实现我们的弹窗组件(挂载到`body`元素下面的)

```react
// CustomDialog.js
const modalRoot = document.body;

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // 在 Modal 的所有子元素被挂载后，
    // 这个 portal 元素会被嵌入到 DOM 树中，
    // 这意味着子元素将被挂载到一个分离的 DOM 节点中。
    // 如果要求子组件在挂载时可以立刻接入 DOM 树，
    // 例如衡量一个 DOM 节点，
    // 或者在后代节点中使用 ‘autoFocus’，
    // 则需添加 state 到 Modal 中，
    // 仅当 Modal 被插入 DOM 树中才能渲染子元素。
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    // Dialog来自组件库
    return ReactDOM.createPortal(
      <Dialog>...</Dialog>,
      this.el
    );
  }
}
```

```react
import MyDialog from './CustomDialog.js'
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: false};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 当子元素里的按钮被点击时，
    // 这个将会被触发更新父元素的 state，
    // 即使这个按钮在 DOM 中不是直接关联的后代
    this.setState(state => ({
      show: true
    }));
  }

  render() {
    return (
      <div >
  			<button onClick={this.handleClick}>click</button>
        {show  && <MyDialog/> }
      </div>
    );
  }
}
```

通过`show`来控制`MyDialog`的创建和销毁，创建时会挂在到`body`元素下面，销毁的时候从`body`元素上移除。

