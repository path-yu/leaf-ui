import axios from 'axios';
import React, { FC, useRef } from 'react';
import { ChangeEvent } from 'react-router/node_modules/@types/react';
import Button from '../Button/button';
export interface UploadProps {
  action: string;
  beforeUpload?: (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  /**文件状态改变时的钩子，上传成功或者失败时都会被调用	 */
  onChange?: (file: File) => void;
}
const UpLoad: FC<UploadProps> = (props) => {
  const { action, onError, onProgress, onSuccess, beforeUpload, onChange } =
    props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    console.log('click');

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    const formData = new FormData();
    formData.append(file.name, file);
    axios
      .post(action, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0;
          console.log(percentage);

          if (percentage < 100) {
            onProgress && onProgress(percentage, file);
          }
        },
      })
      .then((resp) => {
        console.log(resp);
        if (onSuccess) {
          onSuccess(resp.data, file);
        }
        onChange && onChange(file);
      })
      .catch((err) => {
        if (onError) {
          onError(err, file);
        }
        onChange && onChange(file);
      });
  };
  return (
    <div className="simple-upload-component">
      <Button onClick={handleClick} btnType="primary">
        Upload File
      </Button>
      <input
        className="simple-file-input"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        type="file"
        ref={fileInputRef}
      />
    </div>
  );
};
export default UpLoad;
