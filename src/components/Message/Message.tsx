import React, {
  CSSProperties,
  forwardRef,
  Key,
  MutableRefObject,
  ReactNode,
  useEffect,
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
let mounted = false;
interface CommonArgs {
  type: actionType;
  content: string;
  duration: number;
  className?: string;
  style?: CSSProperties;
  onClick?: clickFn;
  icon?: ReactNode;
  key?: Key;
}
type voidFn = () => void;
type clickFn = (e: React.MouseEvent<HTMLDivElement>) => void;
interface MessageProviderExpose {
  addMessage: (args: ArgsProps) => MessageType;
}
type actionType = 'info' | 'success' | 'error' | 'warning' | 'loading';
export interface MessageType extends PromiseLike<unknown> {
  (): void;
}
export interface ThenableArgument {
  (val: any): void;
}
type JointContent = ReactNode | ArgsProps;
const message = {
  async info(content: JointContent, duration = 3, onClose?: voidFn) {
    if (!mounted) {
      await handleMount();
    }
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'info', onClose),
    );
  },
  async warning(content: JointContent, duration = 3, onClose?: voidFn) {
    if (!mounted) {
      await handleMount();
    }
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'warning', onClose),
    );
  },
  async success(content: JointContent, duration = 3, onClose?: voidFn) {
    if (!mounted) {
      await handleMount();
    }
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'success', onClose),
    );
  },
  async loading(content: JointContent, duration = 3, onClose?: voidFn) {
    if (!mounted) {
      await handleMount();
    }
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'loading', onClose),
    );
  },
  async error(content: JointContent, duration = 3000, onClose?: voidFn) {
    if (!mounted) {
      await handleMount();
    }
    return MessageProviderRef!.current!.addMessage(
      getMessageConfig(content, duration, 'error', onClose),
    );
  },
  async open(config: ArgsProps) {
    if (!mounted) {
      await handleMount();
    }
    setDefaultDuration(config);
    return MessageProviderRef!.current!.addMessage(config);
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
    setDefaultDuration(ctx);
    if (!ctx.type) {
      ctx.type = type;
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
const setDefaultDuration = (config: ArgsProps) => {
  if (!config.duration) {
    config.duration = 3000;
  } else {
    config.duration = config.duration * 1000;
  }
};
let MessageProviderRef: MutableRefObject<MessageProviderExpose | null> | null = null;
const MessageApp = () => {
  useEffect(() => {
    mounted = true;
  }, []);
  MessageProviderRef = useRef<MessageProviderExpose>(null);
  return <MessageProvider ref={MessageProviderRef} />;
};

interface MessageProvideProps {}
const MessageProvider = forwardRef<MessageProviderExpose, MessageProvideProps>((props, ref) => {
  let [messageList, setMessageList] = useState<CommonArgs[]>([]);

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
          key,
        } = argProps;
        let item: CommonArgs = {
          type,
          content,
          duration,
          key: nanoid(),
          style,
          className,
          onClick,
          icon,
        };
        let callback: Function;
        const result = () => {
          onClose && onClose();
          callback && callback();
          setMessageList((prev) => prev.filter((value) => value.key !== item.key));
        };
        let closePromise = new Promise((resolve) => {
          callback = () => {
            onClose && onClose();
            return resolve(true);
          };
        });
        result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
          closePromise.then(filled, rejected);
        if (duration !== 0) {
          setTimeout(result, duration);
        }
        // 处理自定义key参数
        if (key) {
          let findOriginIndex = messageList.findIndex((message) => message.key === key);
          item.key = key;
          if (findOriginIndex === -1) {
            setMessageList((prev) => [...prev, item]);
          } else {
            setMessageList((prev) => {
              let newList = [...prev];
              newList[findOriginIndex] = item;
              return newList;
            });
          }
        } else {
          setMessageList((prev) => [...prev, item]);
        }
        return result as MessageType;
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
        appear={true}
        wrapItemStyle={{ display: 'flex', justifyContent: 'center' }}
        buildItem={(item: CommonArgs, index) => {
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

const handleMount = () => {
  return new Promise((resolve, reject) => {
    let container = document.createElement('div');
    document.body.appendChild(container);
    setTimeout(() => {
      createRoot(container, {}).render(<MessageApp />);
    });
    let timerId = setInterval(() => {
      if (MessageProviderRef!.current) {
        clearInterval(timerId);
        resolve(true);
      }
    }, 30);
  });
};
window.addEventListener('DOMContentLoaded', handleMount);

export default message;
