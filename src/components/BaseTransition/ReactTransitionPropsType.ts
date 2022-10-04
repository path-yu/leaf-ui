import { EnterHandler, ExitHandler, TransitionChildren } from 'react-transition-group/Transition';
import { Ref } from 'react';
export interface BaseTransitionProps<RefElement extends undefined | HTMLElement> {
  /**
   * By default the child component is mounted immediately along with the
   * parent Transition component. If you want to "lazy mount" the component on
   * the first `in={true}` you can set `mountOnEnter`. After the first enter
   * transition the component will stay mounted, even on "exited", unless you
   * also specify `unmountOnExit`.
   */
  mountOnEnter?: boolean | undefined;

  /**
   * By default the child component stays mounted after it reaches the
   * 'exited' state. Set `unmountOnExit` if you'd prefer to unmount the
   * component after it finishes exiting.
   */
  unmountOnExit?: boolean | undefined;

  /**
   * Callback fired before the "entering" status is applied. An extra
   * parameter `isAppearing` is supplied to indicate if the enter stage is
   * occurring on the initial mount
   */
  onEnter?: EnterHandler<RefElement> | undefined;

  /**
   * Callback fired after the "entering" status is applied. An extra parameter
   * isAppearing is supplied to indicate if the enter stage is occurring on
   * the initial mount
   */
  onEntering?: EnterHandler<RefElement> | undefined;

  /**
   * Callback fired after the "entered" status is applied. An extra parameter
   * isAppearing is supplied to indicate if the enter stage is occurring on
   * the initial mount
   */
  onEntered?: EnterHandler<RefElement> | undefined;

  /**
   * Callback fired before the "exiting" status is applied.
   */
  onExit?: ExitHandler<RefElement> | undefined;

  /**
   * Callback fired after the "exiting" status is applied.
   */
  onExiting?: ExitHandler<RefElement> | undefined;

  /**
   * Callback fired after the "exited" status is applied.
   */
  onExited?: ExitHandler<RefElement> | undefined;

  /**
   * A React reference to DOM element that need to transition: https://stackoverflow.com/a/51127130/4671932
   * When `nodeRef` prop is used, node is not passed to callback functions (e.g. onEnter) because user already has direct access to the node.
   * When changing `key` prop of `Transition` in a `TransitionGroup` a new `nodeRef` need to be provided to `Transition` with changed `key`
   * prop (@see https://github.com/reactjs/react-transition-group/blob/master/test/Transition-test.js).
   */
  nodeRef?: Ref<RefElement> | undefined;

  [prop: string]: any;
}
