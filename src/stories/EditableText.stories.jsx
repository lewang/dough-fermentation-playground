import { h } from 'preact';
import { useState } from 'preact/hooks';
import { EditableText } from '../components/ui/EditableText.jsx';

export default {
  title: 'UI/EditableText',
  component: EditableText,
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
    <EditableText
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  value: 'Click to edit this text',
  placeholder: 'Enter some text...',
};

export const AsTitle = Template.bind({});
AsTitle.args = {
  value: 'Recipe Title',
  placeholder: 'Enter recipe name...',
  isTitle: true,
  className: 'recipe-name',
};

export const Empty = Template.bind({});
Empty.args = {
  value: '',
  placeholder: 'Click to add text...',
};

export const LongText = Template.bind({});
LongText.args = {
  value: 'This is a longer piece of text that demonstrates how the editable text component handles longer content',
  placeholder: 'Enter description...',
};