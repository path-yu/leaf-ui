// Button.stories.ts | Button.stories.tsx

import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import Button, { ButtonProps } from './Button';


export default {
  component: Button,
  title: 'Components/Button',
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<ButtonProps> = (args) => (
  <Button onClick={action('clicked')} {...args}>
    简单的Button
  </Button>
);
export const buttonWithSize = () => (
  <>
    <Button size="lg"> large button </Button>
    <Button size="sm"> small button </Button>
  </>
);

export const Default = Template.bind({});

Default.args = {
};
Default.storyName = 'Button';

