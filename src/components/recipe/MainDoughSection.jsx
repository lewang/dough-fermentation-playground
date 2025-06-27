import { h } from 'preact';
import { Section } from '../ui/Section.jsx';
import { InputGroup } from '../inputs/InputGroup.jsx';
import { InputRow } from '../inputs/InputRow.jsx';

export function MainDoughSection({ 
  doughPortions, 
  portionWeight, 
  hydrationPercent, 
  saltPercent, 
  leaveningType, 
  yeastPercent,
  showPreferment,
  inoculatedFlourPercent,
  prefermentHydration,
  onChange 
}) {
  const leaveningOptions = [
    { value: 'active-dry-yeast', label: 'Active Dry Yeast' },
    { value: 'instant-yeast', label: 'Instant Yeast' },
    { value: 'cake-yeast', label: 'Cake Yeast' },
    { value: 'sourdough-starter', label: 'Sourdough Starter' },
    { value: 'poolish', label: 'Poolish' }
  ];

  return (
    <Section title="🍞 Main Dough" className="mandatory">
      <InputRow>
        <InputGroup
          label="Dough Portions"
          type="number"
          value={doughPortions}
          onChange={(value) => onChange('doughPortions', parseInt(value) || 1)}
          min="1"
          className="main-input"
        />
        <InputGroup
          label="Portion Weight"
          type="number"
          value={portionWeight}
          onChange={(value) => onChange('portionWeight', parseInt(value) || 500)}
          min="1"
          unit="g"
          className="main-input"
        />
      </InputRow>
      
      <InputRow>
        <InputGroup
          label="Hydration"
          type="number"
          value={hydrationPercent}
          onChange={(value) => onChange('hydrationPercent', parseFloat(value) || 72)}
          min="1"
          max="200"
          step="0.1"
          unit="baker%"
          className="main-input"
        />
        <InputGroup
          label="Salt"
          type="number"
          value={saltPercent}
          onChange={(value) => onChange('saltPercent', parseFloat(value) || 2.2)}
          min="0"
          max="10"
          step="0.1"
          unit="baker%"
          className="main-input"
        />
      </InputRow>
      
      <InputRow>
        <InputGroup
          label="Leavening"
          type="select"
          value={leaveningType}
          onChange={(value) => onChange('leaveningType', value)}
          options={leaveningOptions}
          className="main-input"
        />
        <InputGroup
          label="Yeast"
          type="number"
          value={yeastPercent}
          onChange={(value) => onChange('yeastPercent', parseFloat(value) || 0.210)}
          step="0.001"
          min="0"
          unit="baker%"
          className="main-input"
        />
      </InputRow>
      
      {showPreferment && (
        <div className="conditional-inputs">
          <InputRow>
            <InputGroup
              label="Inoculated Flour % of Whole"
              type="number"
              value={inoculatedFlourPercent}
              onChange={(value) => onChange('inoculatedFlourPercent', parseFloat(value) || 0)}
              step="0.1"
              min="0"
              unit="%"
              className="main-input"
            />
            <InputGroup
              label="Preferment Hydration"
              type="number"
              value={prefermentHydration}
              onChange={(value) => onChange('prefermentHydration', parseFloat(value) || 100)}
              step="0.1"
              min="0"
              unit="%"
              className="main-input"
            />
          </InputRow>
        </div>
      )}
    </Section>
  );
}