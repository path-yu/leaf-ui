## AutoComplete

```tsx
import React from 'react';
import { AutoComplete } from 'react-element';
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
  const res = lakers
    .filter((name) => name.includes(query))
    .map((name) => ({ value: name }));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(res);
    }, 500);
  });
};
export default () => (
  <AutoComplete
    placeholder="输入湖人队球员英文名试试"
    fetchSuggestions={handleFetch}
    onSelect={(item) => {
      console.log(item);
    }}
  />
);
```
