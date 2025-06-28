import { h } from 'preact';
import { RecipeStep } from '../components/recipe/RecipeStep.jsx';

export default {
  title: 'Recipe/RecipeStep',
  component: RecipeStep,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onUpdate: { action: 'updated' },
    onRemove: { action: 'removed' },
    onToggleCollapse: { action: 'toggled collapse' },
  },
};

const mockStepDragHandlers = {
  handleDragStart: () => () => {},
  handleDragEnd: () => {},
  handleDragOver: () => {},
  handleDrop: () => () => {},
};

const baseStep = {
  id: 1,
  name: 'Mix ingredients',
  duration: '5 minutes',
  temperature: 25,
  ingredients: [
    {
      name: 'flour',
      type: 'flour',
      unit: 'g',
      value: 500,
      defaultValue: 500
    },
    {
      name: 'water',
      type: 'water',
      unit: 'g', 
      value: 350,
      defaultValue: 350
    },
    {
      name: 'Eggs',
      type: 'water',
      unit: 'g',
      value: 100,
      defaultValue: 100,
      scaling: 0.75
    }
  ]
};

export const Default = {
  args: {
    step: baseStep,
    index: 0,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: false,
  },
};

export const Collapsed = {
  args: {
    step: baseStep,
    index: 0,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: true,
  },
};

export const WithoutIngredients = {
  args: {
    step: {
      id: 2,
      name: 'Rest dough',
      duration: '30 minutes',
      temperature: 22,
    },
    index: 1,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: false,
  },
};

export const WithReps = {
  args: {
    step: {
      id: 3,
      name: 'Knead dough',
      duration: '2 minutes',
      reps: 3,
      ingredients: []
    },
    index: 2,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: false,
  },
};