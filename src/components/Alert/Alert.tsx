import classNames from 'classnames';
import React, { FC, MouseEvent, useRef, useState } from 'react';
import Icon from '../Icon';
import Transition from '../Transition';
export interface AlertProps {
  /** 标题 */
  title: string;
  /** 内容描述 */
  description?: string;
  /** Alert类型
   * @default default
   */
  type?: 'success' | 'default' | 'danger' | 'warning';
  /**
   * 关闭时触发的回调函数
   */
  onClose?: (e: MouseEvent<HTMLSpanElement>) => void;
  /** closable 是否显示关闭按钮
   * @default true
   */
  closable?: boolean;
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
    setHide(true);
  };
  return (
    <Transition in={!hide} timeout={300} animation="zoom-in-top">
      <div className={classes} ref={alertRef}>
        <span className={titleClass}>{title}</span>
        {description && <p className="simple-alert-desc">{description}</p>}
        {closable && (
          <span className="simple-alert-close" onClick={handleClose}>
            <Icon icon="times" />
          </span>
        )}
      </div>
    </Transition>
  );
};
Alert.defaultProps = {
  type: 'default',
  closable: true,
};
export default Alert;
