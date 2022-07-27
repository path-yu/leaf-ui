import React, {
  CSSProperties,
  EventHandler,
  FC,
  ImgHTMLAttributes,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ImageProps } from './Api/Image.api';
import './_style.scss';
import { addpx } from '../../utils/core/addpx';
const Image: FC<Partial<ImageProps & ImgHTMLAttributes<HTMLImageElement>>> = (props) => {
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
    ...restProps
  } = props;
  const [loadStatus, setLoadStatus] = useState<'waiting' | 'loading' | 'success' | 'error'>(
    lazy ? 'waiting' : 'loading',
  );
  const isSuccess = loadStatus === 'success';
  const imageRef = useRef<HTMLImageElement>(null);
  const [loadSrc, setLoadSrc] = useState(src || '');

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
    if (height && !imageRef.current?.style.height) {
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
        {...restProps}
      />
      {(loadStatus === 'loading' || loadStatus === 'waiting') && placeHolder}
    </div>
  );
};
Image.defaultProps = {
  lazy: false,
  objectFit: 'fill',
  previewDisabled: false,
  showToolbar: true,
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
      Loading
    </div>
  ),
};
export default Image;
