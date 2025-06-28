import { h } from 'preact';
import { useState } from 'preact/hooks';
import { DurationInput } from '../components/recipe/DurationInput.jsx';

export default {
  title: 'Recipe/DurationInput',
  component: DurationInput,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value);
  return (
    <DurationInput
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      }}
    />
  );
};

export const Empty = Template.bind({});
Empty.args = {
  value: '',
};

export const ValidDuration = Template.bind({});
ValidDuration.args = {
  value: '5 minutes',
};

export const ComplexDuration = Template.bind({});
ComplexDuration.args = {
  value: '1 hour 30 minutes',
};

export const InvalidDuration = Template.bind({});
InvalidDuration.args = {
  value: 'not a valid duration',
};

export const NumericOnly = Template.bind({});
NumericOnly.args = {
  value: '45',
};