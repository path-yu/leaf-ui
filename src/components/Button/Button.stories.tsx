// Button.stories.ts | Button.stories.tsx

import { Meta, Story } from '@storybook/react';
import React from 'react';
import Button, { ButtonProps } from './Button';



export default {
  component: Button,
  title: 'Components/Button',
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<ButtonProps> = (args) => <Button {...args} >简单的Button </Button>;

export const Primary = Template.bind({});
Primary.storyName = 'I am the primary';

