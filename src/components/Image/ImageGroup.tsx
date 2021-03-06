import React, {
  Children,
  cloneElement,
  FC,
  FunctionComponentElement,
  ReactNode,
  useRef,
} from 'react';
import { ImageProps } from './Api/Image.api';
import ImagePreview, { ImagePreviewExpose } from './ImagePreview';

interface ImageGroupProps {
  /**
   * @description 图片放大后是否展示底部工具栏
   */
  showToolBar: boolean;
  children?: ReactNode;
}
const ImageGroup: FC<ImageGroupProps> = (props) => {
  let { children, showToolBar } = props;
  let previewSrcList: string[] = [];
  const imagePreviewRef = useRef<ImagePreviewExpose>(null);

  const newChildRen = Children.map(children, (child, index) => {
    const childElement = child as FunctionComponentElement<ImageProps>;
    if (childElement.type?.displayName === 'Image') {
      previewSrcList.push(childElement.props.src);
      return cloneElement(childElement, {
        isWrapGroup: true,
        imagePreviewRef,
        index: index,
      });
    }
    return child;
  });

  return (
    <>
      {newChildRen}
      <ImagePreview
        ref={imagePreviewRef}
        showToolBar={showToolBar}
        previewSrcList={previewSrcList}
      />
    </>
  );
};
ImageGroup.defaultProps = {
  showToolBar: true,
};
export default ImageGroup;
