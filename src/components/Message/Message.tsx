import React, {
  CSSProperties,
  forwardRef,
  MutableRefObject,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { nanoid } from 'nanoid';
import { AnimateList } from '../..';
import './style.scss';
import { ErrorIcon, InfoIcon, LoadingIcon, SuccessIcon, WaringIcon } from './Icon';
import classNames from 'classnames';

export interface ArgsProps extends CommonArgs {
  onClose?: () => void;
}
interface CommonArgs {
  type: actionType;
  content: string;
  duration: number;
  className?: string;
  style?: CSSProperties;
  onClick?: clickFn;
  icon?: ReactNode;
}
interface MessageItemData extends CommonArgs {
  key: string;
}
type voidFn = () => void;
type clickFn = (e: React.MouseEvent<HTMLDivElement>) => void;
interface MessageProviderExpose {
  addMessage: (args: ArgsProps) => MessageType;
}
type actionType = 'info' | 'success' | 'error' | 'warning' | 'loading';
export interface MessageType extends Promise<unknown> {
  (): void;
}

type JointContent = ReactNode | ArgsProps;
const message = {
  info(content: JointContent, duration = 3, onClose?: voidFn) {
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'info', onClose),
    );
  },
  warning(content: JointContent, duration = 3, onClose?: voidFn) {
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'warning', onClose),
    );
  },
  success(content: JointContent, duration = 3, onClose?: voidFn) {
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'success', onClose),
    );
  },
  loading(content: JointContent, duration = 3, onClose?: voidFn) {
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'loading', onClose),
    );
  },
  error(content: JointContent, duration = 3000, onClose?: voidFn) {
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'error', onClose),
    );
  },
};
const getMessageConfig = (
  content: JointContent,
  duration: number,
  type: actionType,
  onClose?: voidFn,
) => {
  if (typeof content === 'object') {
    let ctx = content as ArgsProps;
    if (!ctx.duration) {
      ctx.duration = 3000;
    } else {
      ctx.duration = ctx.duration * 1000;
    }
    return ctx;
  } else {
    return {
      duration: duration * 1000,
      content,
      onClose,
      type,
    } as ArgsProps;
  }
};
let MessageProviderRef: MutableRefObject<MessageProviderExpose | null> | null = null;
const MessageApp = () => {
  MessageProviderRef = useRef<MessageProviderExpose>(null);
  return <MessageProvider ref={MessageProviderRef} />;
};

interface MessageProvideProps {}
const MessageProvider = forwardRef<MessageProviderExpose, MessageProvideProps>((props, ref) => {
  let [messageList, setMessageList] = useState<MessageItemData[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      addMessage(argProps) {
        let {
          type = 'success',
          content,
          duration,
          className,
          onClose,
          style = {},
          onClick = (event) => {},
          icon,
        } = argProps;
        let item: MessageItemData = {
          type,
          content,
          duration,
          key: nanoid(),
          style,
          className,
          onClick,
          icon,
        };
        let resolveFn: (value: unknown) => void;
        const closeMessage = () => {
          onClose && onClose();
          resolveFn && resolveFn(true);
          setMessageList((prev) => prev.filter((value) => value.key !== item.key));
        };
        if (duration !== 0) {
          setTimeout(() => {
            closeMessage();
          }, duration);
        }
        setMessageList((prev) => [...prev, item]);
        if (duration === 0) {
          return closeMessage as MessageType;
        } else {
          return new Promise((resolve, reject) => {
            resolveFn = resolve;
          }) as MessageType;
        }
      },
    }),
    [messageList],
  );
  const MessageIcon = {
    success: SuccessIcon,
    info: InfoIcon,
    error: ErrorIcon,
    warning: WaringIcon,
    loading: LoadingIcon,
  };
  return (
    <div className="message-container">
      <AnimateList
        items={messageList}
        keys={(item) => item.key}
        effect="slide-down"
        wrapItemStyle={{ display: 'flex', justifyContent: 'center' }}
        buildItem={(item: MessageItemData, index) => {
          return (
            <div
              className={classNames('message-notice', item.className)}
              key={item.content}
              style={item.style}
            >
              <div
                onClick={item.onClick}
                className={classNames('message-notice-content', {
                  ['message-success']: item.type === 'success',
                  ['message-info']: item.type === 'info',
                  ['message-error']: item.type === 'error',
                  ['message-loading']: item.type === 'loading',
                  ['message-warning']: item.type === 'warning',
                })}
              >
                <span className="icon">{item.icon ? item.icon : MessageIcon[item.type]}</span>
                <span>{item.content}</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
});
(() => {
  let container = document.createElement('div');
  document.body.appendChild(container);
  setTimeout(() => {
    createRoot(container).render(<MessageApp />);
  });
})();
export default message;
