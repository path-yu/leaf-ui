import axios from 'axios';
import React, { FC, useRef, useState } from 'react';
import { ChangeEvent } from 'react-router/node_modules/@types/react';
import Dragger from './drag';
import UploadList from './upload-list';
export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';
export interface UploadFile {
  uid: string;
  name: string;
  size: number;
  status?: UploadFileStatus;
  percent: number;
  raw?: File;
  response?: any;
  error?: any;
}

export interface UploadProps {
  /**必选参数, 上传的地址 */
  action: string;
  /**上传的文件列表,*/
  defaultFileList?: UploadFile[];
  /** 上传文件前的钩子参数为上传的文件，若返回 false 或者 Promise 则停止上传*/
  beforeUpload?: (file: File) => boolean | Promise<File>;
  /**文件上传时的钩子 */
  onProgress?: (percentage: number, file: UploadFile) => void;
  /**文件上传成功时的钩子 */
  onSuccess?: (data: any, file: UploadFile) => void;
  /**文件上传失败时的钩子 */
  onError?: (err: any, file: UploadFile) => void;
  /**文件状态改变时的钩子，上传成功或者失败时都会被调用	 */
  onChange?: (file: UploadFile) => void;
  /**文件列表移除文件时的钩子 */
  onRemove?: (file: UploadFile) => void;
  /** 设置上传的请求头部' */
  headers?: { [key: string]: any };
  /**上传文件的字段名 */
  name?: string;
  /** 上传是附带的参数 */
  data?: { [key: string]: any };
  /**支持发送 cookie 凭证信息 */
  withCredentials?: boolean;
  /**可选参数, 接受上传的文件类型 */
  accept?: string;
  /**是否支持多选文件 */
  multiple?: boolean;
  /**是否支持拖拽上传 */
  drag?: boolean;
}
const UpLoad: FC<UploadProps> = (props) => {
  const {
    action,
    onError,
    onProgress,
    onSuccess,
    beforeUpload,
    onChange,
    onRemove,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    drag,
    defaultFileList,
  } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
  // 触发input的Click事件拉去选择文件的对话框
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter((item) => item.uid !== file.uid);
    });
    if (onRemove) {
      onRemove(file);
    }
  };
  const updateFileList = (
    updateFile: UploadFile,
    updateObj: Partial<UploadFile>,
  ) => {
    setFileList((prevList) => {
      return prevList.map((file) => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj };
        } else {
          return file;
        }
      });
    });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }
    uploadFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const uploadFiles = (files: FileList) => {
    const postFiles = Array.from(files);
    postFiles.forEach((file) => {
      if (!beforeUpload) {
        post(file);
      } else {
        const result = beforeUpload(file);
        if (result instanceof Promise) {
          result.then((processedFile) => {
            post(processedFile);
          });
        } else if (result !== false) {
          post(file);
        }
      }
    });
  };
  const post = (file: File) => {
    //创建UploadFiled对象 更新fileList
    let _file: UploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file,
    };
    setFileList((prevList) => {
      return [_file, ...prevList];
    });
    const formData = new FormData();
    formData.append(name || 'file', file);
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    axios
      .post(action, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials,
        onUploadProgress: (e) => {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0;
          if (percentage < 100) {
            updateFileList(_file, { percent: percentage, status: 'uploading' });
            onProgress && onProgress(percentage, _file);
          }
        },
      })
      .then((resp) => {
        updateFileList(_file, { status: 'success', response: resp.data });
        _file.status = 'success';
        _file.response = resp.data;
        onSuccess && onSuccess(resp.data, _file);
        onChange && onChange(_file);
      })
      .catch((err) => {
        updateFileList(_file, { status: 'error', error: err });
        _file.status = 'error';
        _file.error = err;
        onError && onError(err, _file);
        onChange && onChange(_file);
      });
  };
  return (
    <div className="simple-upload-component">
      <div
        className="simple-upload-input"
        style={{ display: 'inline-block' }}
        onClick={handleClick}
      >
        {drag ? (
          <Dragger
            onFile={(files) => {
              uploadFiles(files);
            }}
          >
            {children}
          </Dragger>
        ) : (
          children
        )}
        <input
          className="simple-file-input"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
          type="file"
          accept={accept}
          multiple={multiple}
        />
      </div>
      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  );
};
UpLoad.defaultProps = {
  name: 'file',
  drag: false,
  withCredentials: false,
  multiple: false,
};
export default UpLoad;
