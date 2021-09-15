import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Alert, { AlertProps } from './alert';

const testProps: AlertProps = {
  title: 'title',
  onClose: jest.fn(),
};

const typeProps: AlertProps = {
  ...testProps,
  type: 'success',
  description: 'hello',
  closable: false,
};

describe('test Alert Component', () => {
  it('should render the correct default Alert', () => {
    const { getByText, container, queryByText } = render(
      <Alert {...testProps}></Alert>,
    );
    expect(queryByText('title')).toBeInTheDocument();
    expect(container.querySelector('.simple-alert')).toHaveClass(
      'simple-alert-default',
    );
    const closeEle = container.querySelector(
      '.simple-alert-close',
    ) as HTMLElement;
    fireEvent.click(closeEle);
    expect(testProps.onClose).toHaveBeenCalled();
  });
  it('shound render the correct Alert based on different type and description', () => {
    const { container, queryByText } = render(<Alert {...typeProps} />);
    expect(queryByText('title')).toHaveClass('bold-title');
    expect(container.querySelector('.simple-alert')).toHaveClass(
      'simple-alert-success',
    );
    expect(queryByText('hello')).toBeInTheDocument();
    expect(queryByText('关闭')).not.toBeInTheDocument();
  });
});
