import { useSettings } from '@/context';
import { STRING_ORDER_OPTIONS, HEADSTOCK_POSITION_OPTIONS } from '@/constants/ui';
import InputField from './InputField';
import type { StringOrder, HeadstockPosition } from '@/types/ui';

const FretboardControls = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* String Order Control */}
        <div>
          <InputField
            label="String Order"
            type="select"
            value={settings.stringOrder}
            onChange={(value) => updateSettings({ stringOrder: value as StringOrder })}
            options={STRING_ORDER_OPTIONS.map(opt => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            How strings are ordered on the fretboard
          </p>
        </div>

        {/* Headstock Position Control (only for horizontal) */}
        {!settings.verticalFretboard && (
          <div>
            <InputField
              label="Headstock Position"
              type="select"
              value={settings.headstockPosition}
              onChange={(value) => updateSettings({ headstockPosition: value as HeadstockPosition })}
              options={HEADSTOCK_POSITION_OPTIONS.map(opt => ({
                value: opt.value,
                label: opt.label,
              }))}
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Which side to place the headstock
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FretboardControls;