import classNames from 'classnames';
import { FC, MouseEvent, useRef, useState } from 'react';
export interface AlertProps {
  title: string; // Alert 标题
  description?: string; // 内容描述
  type?: AlertType; // Alert类型
  onClose?: (e: MouseEvent<HTMLSpanElement>) => void; // 关闭时触发的回调函数
  closable?: boolean; // 	默认不显示关闭按钮
}

// * alert弹窗类型
export type AlertType = 'success' | 'default' | 'danger' | 'warning';

const Alert: FC<AlertProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hide, setHide] = useState(false); //是否隐藏alert
  const alertRef = useRef<HTMLDivElement>(null);
  const { title, description, type, onClose, closable } = props;
  const classes = classNames('simple-alert', {
    [`simple-alert-${type}`]: type,
  });
  const titleClass = classNames('simple-alert-title', {
    'bold-title': description,
  });
  const handleClose = (e: MouseEvent<HTMLSpanElement>) => {
    onClose && onClose(e);
    alertRef.current!.style.display = 'none';
    setHide(true);
  };
  return (
    <div className={classes} ref={alertRef}>
      <span className={titleClass}>{title}</span>
      {description && <p className="simple-alert-desc">{description}</p>}
      {closable && (
        <span className="simple-alert-close" onClick={handleClose}>
          关闭
        </span>
      )}
    </div>
  );
};
Alert.defaultProps = {
  type: 'default',
  closable: true,
};
export default Alert;
