### Tree-树形控件

### 基础演示

```tsx
import React from 'react';
import { Tree, DataNode } from 'leaf-ui';
export default () => {
  const treeData: DataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
              // disableCheckbox: true,
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            {
              title: '三级节点',
              key: '0-0-2-0',
              children: [
                {
                  title: <span style={{ color: '#1890ff' }}>4及</span>,
                  key: '0-0-2-0-0',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'parent 2',
      key: '0-1',
      children: [
        {
          title: 'leaf',
          key: 'test1',
          disableCheckbox: true,
        },
        {
          title: 'leaf',
          key: 'test12',
        },
      ],
    },
  ];
  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
  };
  return <Tree onExpand={onExpand} defaultExpandedKeys={['0-0-0', '0-0-1']} treeData={treeData} />;
};
```

### 节点前添加复选框

```tsx
import React from 'react';
import { Tree } from 'leaf-ui';
export default () => {


  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys);
  };
  const treeData: DataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
              checkable: false,
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            {
              title: '三级节点',
              key: '0-0-2-0',
              children: [
                {
                  title: <span style={{ color: '#1890ff' }}>4及</span>,
                  key: '0-0-2-0-0',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'parent 2',
      children: [
        {
          title: 'leaf',
          disableCheckbox: true,
        },
        {
          title: 'leaf',
        },
      ],
    },
  ];
  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
  };
  return (
    <Tree
      checkable
      onExpand={onExpand}
      defaultExpandedKeys={['0-0-0', '0-0-1']}
      defaultCheckedKeys={['0-0-0', '0-0-1']}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
};
```

### 设置属性别名

```tsx
import React from 'react';
import { Tree, DataNode } from 'leaf-ui';
export default () => {
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys);
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const treeData: DataNode[] = [
    {
      name: 'parent 1',
      id: '0-0',
      children: [
        {
          name: 'parent 1-0',
          id: '0-0-0',
          children: [
            {
              name: 'leaf',
              id: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              name: 'leaf',
              id: '0-0-0-1',
            },
          ],
        },
        {
          name: 'parent 1-1',
          id: '0-0-1',
          children: [
            { name: <span style={{ color: '#1890ff' }}>sss</span>, id: '0-0-1-0' },
            { name: <span style={{ color: '#1890ff' }}>ssss</span>, id: '0-0-1-1' },
          ],
        },
      ],
    },
    {
      name: 'parent 2',
      id: '000',
      children: [
        {
          name: 'leaf',
          id: '0001',
          disableCheckbox: true,
        },
        {
          name: 'leaf',
          id: '0002',
        },
      ],
    },
  ];
  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
  };
  return (
    <Tree
      checkable
      onExpand={onExpand}
      defaultCheckedKeys={['0-0-0', '0-0-1']}
      defaultSelectedKeys={['0-0-0', '0-0-1']}
      onCheck={onCheck}
      onSelect={onSelect}
      treeData={treeData}
      titleAlias="name"
      keyAlias="id"
    />
  );
};
```
### 多选
`multiple` 模式支持 `ctrl(Windows)` / `command(Mac)` 复选。
```tsx
import React from 'react';
import { Tree, DataNode } from 'leaf-ui';
export default () => {
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys);
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const treeData: DataNode[] = [
    {
      name: 'parent 1',
      id: '0-0',
      children: [
        {
          name: 'parent 1-0',
          id: '0-0-0',
          children: [
            {
              name: 'leaf',
              id: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              name: 'leaf',
              id: '0-0-0-1',
            },
          ],
        },
        {
          name: 'parent 1-1',
          id: '0-0-1',
          children: [
            { name: <span style={{ color: '#1890ff' }}>sss</span>, id: '0-0-1-0' },
            { name: <span style={{ color: '#1890ff' }}>ssss</span>, id: '0-0-1-1' },
          ],
        },
      ],
    },
    {
      name: 'parent 2',
      id: '000',
      children: [
        {
          name: 'leaf',
          id: '0001',
          disableCheckbox: true,
        },
        {
          name: 'leaf',
          id: '0002',
        },
      ],
    },
  ];
  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
  };
  return (
    <Tree
      checkable
      multiple
      onExpand={onExpand}
      defaultExpandAll
      defaultCheckedKeys={['0-0-0', '0-0-1']}
      onCheck={onCheck}
      onSelect={onSelect}
      treeData={treeData}
      titleAlias="name"
      keyAlias="id"
    />
  );
};
```
### TreeProps
<API hideTitle src="./Tree.Tsx">

### TreeNode Props

| name            | description                         | type                                             | default   |
|-----------------|-------------------------------------|--------------------------------------------------|-----------|
| checkable       | 当树为 checkable 时，设置独立节点是否展示 Checkbox | `boolean`                                        | `--`      |
| disableCheckbox | 禁掉 checkbox                         | `boolean`                                        | `false`   |
| disabled        | 禁掉响应                                | 	`boolean`                                       | `false`   |
| icon            | 	自定义图标。可接收组件，props 为当前节点 props      | `ReactNode &#124; ReactNode(props) => ReactNode` | `--`      |
| key             | 树节点的唯一标识，整个树范围内的所有节点的 key 值不能重复！    | `string`                                         | 内部计算节点的位置 |
| selectable      | 设置节点是否可被选中                          | `boolean`                                        | `true`    |
| title           | 节点标题                                | `ReactNode`                                      | `--`      |
