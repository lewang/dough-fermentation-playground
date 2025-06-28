import { h } from 'preact';
import { useState } from 'preact/hooks';
import { RecipeHeader } from '../components/recipe/RecipeHeader.jsx';

export default {
  title: 'Recipe/RecipeHeader',
  component: RecipeHeader,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onRecipeNameChange: { action: 'recipe name changed' },
  },
};

const Template = (args) => {
  const [recipeName, setRecipeName] = useState(args.recipeName);
  return (
    <RecipeHeader
      {...args}
      recipeName={recipeName}
      onRecipeNameChange={(newName) => {
        setRecipeName(newName);
        args.onRecipeNameChange?.(newName);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  recipeName: 'My Sourdough Recipe',
};

export const EmptyName = Template.bind({});
EmptyName.args = {
  recipeName: '',
};