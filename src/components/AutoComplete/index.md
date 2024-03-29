## AutoComplete 自动完成

输入框自动完成功能。

### 简单演示

```tsx
import React from 'react';
import { AutoComplete } from 'leaf-react-ui';
const lakers = [
  'bradley',
  'pope',
  'caruso',
  'cook',
  'cousins',
  'james',
  'AD',
  'green',
  'howard',
  'kuzma',
  'McGee',
  'rando',
];
const handleFetch = (query: string) => {
  return lakers.filter((name) => name.includes(query)).map((name) => ({ value: name }));
};
export default () => (
  <AutoComplete
    fetchSuggestions={handleFetch}
    onSelect={(item) => {
      console.log(item);
    }}
    placeholder="输入湖人队球员英文名试试"
  />
);
```

### 自定义下拉选项

```tsx
import React from 'react';
import { AutoComplete } from 'leaf-react-ui';
const lakersWithNumber = [
  { value: 'bradley', number: 11 },
  { value: 'pope', number: 1 },
  { value: 'caruso', number: 4 },
  { value: 'cook', number: 2 },
  { value: 'cousins', number: 15 },
  { value: 'james', number: 23 },
  { value: 'AD', number: 3 },
  { value: 'green', number: 14 },
  { value: 'howard', number: 39 },
  { value: 'kuzma', number: 0 },
];
const handleFetch = (query: string) => {
  return lakersWithNumber.filter((player) => player.value.includes(query));
};
const renderOption = (item: DataSourceType) => {
  const itemWithNumber = item as DataSourceType<LakerPlayerProps>;
  return (
    <>
      <b>名字: {itemWithNumber.value}</b>
      <span>球衣号码: {itemWithNumber.number}</span>
    </>
  );
};
export default () => (
  <AutoComplete
    fetchSuggestions={handleFetch}
    onSelect={(item) => {
      console.log(item);
    }}
    placeholder="输入湖人队球员英文,自定义下拉模版"
    renderOption={renderOption}
  />
);
```

### 异步请求 Github 用户名

```tsx
import React from 'react';
import { AutoComplete } from 'leaf-react-ui';
const handleFetch = (query: string) => {
  return fetch(`https://api.github.com/search/users?q=${query}`)
    .then((res) => res.json())
    .then(({ items }) => {
      return items.slice(0, 10).map((item: any) => ({ value: item.login, ...item }));
    });
};
const renderOption = (item: DataSourceType) => {
  const itemWithGithub = item as DataSourceType<GithubUserProps>;
  return (
    <>
      <b>Name: {itemWithGithub.value}</b>
      <span>url: {itemWithGithub.url}</span>
    </>
  );
};
export default () => (
  <AutoComplete
    fetchSuggestions={handleFetch}
    onSelect={(item) => {
      console.log(item);
    }}
    placeholder="输入 Github 用户名试试"
    renderOption={renderOption}
  />
);
```

<API src="./AutoComplete.Api.tsx">
