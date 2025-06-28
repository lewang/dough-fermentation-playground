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

export const WithGroupId = {
  args: {
    step: {
      id: 4,
      name: 'Day1. Autolyse',
      duration: '30 minutes',
      ingredients: [
        {
          name: 'flour',
          type: 'flour',
          unit: 'g',
          value: 500,
          defaultValue: 500
        },
        {
          name: 'water room temp',
          type: 'water',
          unit: 'g',
          value: 360,
          defaultValue: 360
        }
      ]
    },
    index: 3,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: false,
  },
};

export const WithLongGroupId = {
  args: {
    step: {
      id: 5,
      name: 'Preferment. Create Poolish Starter',
      duration: '12 hours',
      temperature: 22,
      ingredients: [
        {
          name: 'flour',
          type: 'flour',
          unit: 'g',
          value: 150,
          defaultValue: 150
        },
        {
          name: 'water room temp',
          type: 'water',
          unit: 'g',
          value: 150,
          defaultValue: 150
        },
        {
          name: 'instant yeast',
          type: 'generic',
          unit: 'g',
          value: 0.5,
          defaultValue: 0.5
        }
      ]
    },
    index: 4,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: false,
  },
};

export const GroupedStepCollapsed = {
  args: {
    step: {
      id: 6,
      name: 'Day2. Bulk Fermentation',
      duration: '4 hours',
      temperature: 24,
      ingredients: []
    },
    index: 5,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: true,
  },
};

export const MultipleGroupsExample = {
  args: {
    step: {
      id: 7,
      name: 'Final. Bake',
      duration: '35 minutes',
      temperature: 230,
      ingredients: [
        {
          name: 'shaped dough',
          type: 'generic',
          unit: 'pieces',
          value: 2,
          defaultValue: 2
        }
      ]
    },
    index: 6,
    stepDragHandlers: mockStepDragHandlers,
    isCollapsed: false,
  },
};