import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Button, Space } from '../..';

describe('test Button Component', () => {
  test('should render the correct default Space', () => {
    const wrapper = render(
      <Space size="large">
        <Button>One</Button>
        <Button>Two </Button>
        <Button>hello world </Button>
        <Button>wow this is button... </Button>
      </Space>,
    );
    const rootElement = wrapper.getByText('One')!.parentElement!.parentElement;
    expect(rootElement).toBeInTheDocument();
    expect(rootElement!.style.display).toEqual('flex');
    expect(rootElement!.style.justifyContent).toEqual('flex-start');
    expect(rootElement!.style.gap).not.toBeNull();
  });
});
