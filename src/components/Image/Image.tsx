import React, {
  CSSProperties,
  Dispatch,
  FC,
  ImgHTMLAttributes,
  RefObject,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from 'react';
import { ImageProps } from './Api/Image.api';
import './style/image.scss';
import ImagePreview, { ImagePreviewExpose } from './ImagePreview';
import { deleteProps } from '../../utils/core/deleteProps';

interface privateProps {
  isWrapGroup?: boolean;
  setShowPreview?: Dispatch<SetStateAction<boolean>>;
  imagePreviewRef?: RefObject<ImagePreviewExpose>;
  index?: number;
}
type NativeImageProps = ImageProps & Partial<ImgHTMLAttributes<HTMLImageElement>>;
const Image: FC<NativeImageProps> = (props) => {
  const {
    width,
    height,
    alt,
    fallbackSrc,
    lazy,
    src,
    intersectionObserverOptions,
    objectFit,
    previewSrc,
    previewDisabled,
    showToolbar,
    onError,
    onLoad,
    placeHolder,
    triggerPreviewEventType,
    ...restProps
  } = props;

  const imgProps = Object.assign({}, restProps);
  // delete privateProps
  const privateProps = deleteProps<privateProps>(imgProps, [
    'isWrapGroup',
    'setShowPreview',
    'imagePreviewRef',
    'index',
  ]);

  const [loadStatus, setLoadStatus] = useState<'waiting' | 'loading' | 'success' | 'error'>(
    lazy ? 'waiting' : 'loading',
  );
  const isSuccess = loadStatus === 'success';
  const imageRef = useRef<HTMLImageElement>(null);
  const imagePreviewRef = useRef<ImagePreviewExpose>(null);
  const [loadSrc, setLoadSrc] = useState(src || '');
  const [showPreview, setShowPreview] = useState(false);
  const triggerEvent = (event: MouseEvent<HTMLImageElement>) => {
    if (privateProps.isWrapGroup && privateProps.setShowPreview) {
      privateProps.imagePreviewRef?.current?.setThumbnailEl(imageRef.current!);
      privateProps.imagePreviewRef?.current?.setPreviewCurrentIndex(restProps.index!);
      privateProps.setShowPreview(true);
    } else {
      setShowPreview(true);
      imagePreviewRef.current?.setThumbnailEl(imageRef.current!);
    }
    if (triggerPreviewEventType === 'onClick') {
      imgProps.onClick && imgProps.onClick(event);
    }
    if (triggerPreviewEventType === 'onDoubleClick') {
      imgProps.onDoubleClick && imgProps.onDoubleClick(event);
    }
  };
  let previewEvent = previewDisabled ? {} : { [triggerPreviewEventType!]: triggerEvent };

  useEffect(() => {
    // add intersectionObserver
    if (lazy) {
      observe?.observe(imageRef.current!);
    }
    return () => {
      observe?.disconnect();
      observe = null;
    };
  }, []);
  const handleOnLoad = (event: SyntheticEvent) => {
    onLoad && onLoad(event);
    // 1000s update status
    setLoadStatus('success');
  };
  const handleError = (event: SyntheticEvent) => {
    if (loadStatus === 'waiting') return;
    setLoadStatus('error');
    onError && onError(event);
    fallbackSrc && setLoadSrc(fallbackSrc);
  };

  const obverseCallback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setLoadStatus('loading');
      observe?.disconnect();
    }
  };
  let observe = lazy
    ? new IntersectionObserver(
        obverseCallback,
        intersectionObserverOptions ? intersectionObserverOptions : {},
      )
    : null;
  const computedImgStyle: () => CSSProperties = () => {
    let style: CSSProperties = {
      objectFit: objectFit,
      opacity: isSuccess ? 1 : 0,
      position: isSuccess ? 'static' : 'absolute',
    };
    if (width) {
      style.width = width + 'px';
    }
    if (height) {
      style.height = height + 'px';
    }
    return style;
  };
  return (
    <div className="image-wrapper">
      <img
        onLoad={handleOnLoad}
        onError={handleError}
        ref={imageRef}
        src={lazy ? (loadStatus === 'waiting' ? '' : loadSrc) : loadSrc}
        alt={alt}
        style={computedImgStyle()}
        {...imgProps}
        {...previewEvent}
      />
      {(loadStatus === 'loading' || loadStatus === 'waiting') && placeHolder}
      {!previewDisabled && !restProps.isWrapGroup && (
        <ImagePreview
          ref={imagePreviewRef}
          setShow={setShowPreview}
          show={showPreview}
          previewSrcList={[previewSrc ? previewSrc : loadSrc]}
          showToolBar={showToolbar}
        />
      )}
    </div>
  );
};
Image.defaultProps = {
  lazy: false,
  objectFit: 'fill',
  previewDisabled: false,
  showToolbar: true,
  triggerPreviewEventType: 'onClick',
  placeHolder: (
    <div
      style={{
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0001',
      }}
    >
      loading...
    </div>
  ),
};
Image.displayName = 'Image';
export default Image;
