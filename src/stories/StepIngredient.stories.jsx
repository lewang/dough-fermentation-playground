import { h } from 'preact';
import { StepIngredient } from '../components/recipe/StepIngredient.jsx';

export default {
  title: 'Recipe/StepIngredient',
  component: StepIngredient,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onUpdate: { action: 'updated' },
    onRemove: { action: 'removed' },
  },
};

const mockDragHandlers = {
  handleDragStart: () => () => {},
  handleDragEnd: () => {},
  handleDragOver: () => {},
  handleDrop: () => () => {},
};

export const BasicIngredient = {
  args: {
    ingredient: {
      name: 'flour',
      type: 'flour',
      unit: 'g',
      value: 500,
      defaultValue: 500
    },
    index: 0,
    dragHandlers: mockDragHandlers,
  },
};

export const WaterScalingIngredient = {
  args: {
    ingredient: {
      name: 'Eggs',
      type: 'water',
      unit: 'g',
      value: 100,
      defaultValue: 100,
      scaling: 0.75
    },
    index: 0,
    dragHandlers: mockDragHandlers,
  },
};

export const MilkScalingIngredient = {
  args: {
    ingredient: {
      name: 'Milk (90% water)',
      type: 'water',
      unit: 'g',
      value: 200,
      defaultValue: 200,
      scaling: 0.9
    },
    index: 0,
    dragHandlers: mockDragHandlers,
  },
};

export const EmptyValue = {
  args: {
    ingredient: {
      name: 'salt',
      type: 'generic',
      unit: 'g',
      value: null,
      defaultValue: 10
    },
    index: 0,
    dragHandlers: mockDragHandlers,
  },
};

export const EmptyValueWithWaterScaling = {
  args: {
    ingredient: {
      name: 'Eggs',
      type: 'water',
      unit: 'g',
      value: 0,
      defaultValue: null,
      scaling: 0.75
    },
    index: 0,
    dragHandlers: mockDragHandlers,
  },
};