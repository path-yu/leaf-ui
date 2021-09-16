## Upload

```tsx
import React from 'react';
import { Upload } from 'react-element';
const checkFileSize = (file: File) => {
  if (Math.round(file.size / 1024) > 50) {
    alert('file too big');
    return false;
  }
  return true;
};
const createNewFile = (file: File) => {
  const newFile = new File([file], 'new_name', { type: file.type });
  return Promise.resolve(newFile);
};
export default () => (
  <Upload
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    onChange={() => {
      console.log('changeEd');
    }}
    onProgress={() => {
      console.log('onProgress');
    }}
    onError={() => {
      console.log('error');
    }}
    onSuccess={() => {
      console.log('onSuccess');
    }}
    beforeUpload={createNewFile}
  ></Upload>
);
```
