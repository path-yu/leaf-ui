### Tree-树形控件

### 基础演示
```tsx
import React from 'react';
import { Tree } from 'leaf-ui';
export default () => {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

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
          disabled: true,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
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
              children:[
                {
                  title: <span style={{ color: '#1890ff' }}>4及</span>,
                  key: '0-0-2-0-0',
                }
              ]
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
  return (
    <Tree
      checkable
      onExpand={onExpand}
      defaultExpandedKeys={['0-0-0', '0-0-1']}
      defaultCheckedKeys={['0-0-0']}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
};
```
<API src="./Tree.Tsx">
