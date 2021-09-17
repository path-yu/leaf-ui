## Upload-文件上传

文件选择上传和拖拽上传控件。

### 简单演示

```tsx
import React from 'react';
import { Upload, Button, Icon } from 'ease-element';
const action = (status) => {
  return () => {
    console.log(status);
  };
};
const simpleUpload = () => (
  <Upload
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    onChange={action('changed')}
    onSuccess={action('success')}
    onProgress={action('progress')}
    onRemove={action('removed')}
  >
    <Button size="lg" btnType="primary">
      <Icon icon="upload" /> 点击上传{' '}
    </Button>
  </Upload>
);
export default simpleUpload;
```

### 上传前检查大小

```tsx
import React from 'react';
import { Upload, Button, Icon } from 'ease-element';
const checkUpload = () => {
  const checkFileSize = (file: File) => {
    if (Math.round(file.size / 1024) > 50) {
      alert('file too big');
      return false;
    }
    return true;
  };
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={() => {
        console.log('checked');
      }}
      beforeUpload={checkFileSize}
    >
      <Button size="lg" btnType="primary">
        <Icon icon="upload" /> 不能传大于50Kb！{' '}
      </Button>
    </Upload>
  );
};
export default checkUpload;
```

### 拖动上传

```tsx
import React from 'react';
import { Upload, Button, Icon } from 'ease-element';
const dragUpload = () => (
  <Upload
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    onChange={() => {
      console.log('checked');
    }}
    onRemove={() => {
      console.log('removed');
    }}
    name="fileName"
    multiple
    drag
  >
    <Icon icon="upload" size="5x" theme="secondary" />
    <br />
    <p>点击或者拖动到此区域进行上传</p>
  </Upload>
);
export default dragUpload;
```

<API src="./upload.tsx">
