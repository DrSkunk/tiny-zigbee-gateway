import { LightBulbIcon } from '@heroicons/react/solid';
import { PlusCircleIcon } from '@heroicons/react/outline';
import {
  XCircleIcon,
  CheckCircleIcon,
  ArrowCircleUpIcon,
  ArrowCircleDownIcon,
} from '@heroicons/react/outline';
import classNames from '../util/classNames';

const dayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];

function mapBrightness(value, min1, max1, min2, max2) {
  if (value === 0) {
    return 0;
  }
  return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
}

function WeekConfig(props) {
  const {
    weekConfig,
    addTrigger,
    removeTrigger,
    setTrigger,
    toggleDay,
    removeWeekConfig,
    moveTrigger,
    baseDuration,
  } = props;
  const { triggers, days } = weekConfig;

  const setTime = (index, time) => {
    setTrigger(index, { ...triggers[index], time });
  };

  const setBrightness = (index, brightness) => {
    setTrigger(index, { ...triggers[index], brightness });
  };

  const setDuration = (index, duration) => {
    setTrigger(index, { ...triggers[index], duration });
  };

  const removeDuration = (index) => {
    const trigger = { ...triggers[index], duration: 0 };
    setTrigger(index, trigger);
  };

  return (
    <div className="relative bg-gray-800 p-4 rounded-md shadow-md mb-8">
      <h2 className="text-white pb-4 text-2xl">Activatiedagen</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 spacing-2 flex-wrap gap-4 mb-6">
        {Object.entries(days).map(([day, active], i) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={active}
              onChange={() => toggleDay(day)}
              className="peer sr-only"
            />
            <span className="inline-flex items-center justify-between px-4 py-2 capitalize rounded-md bg-gray-50 text-black hover:bg-gray-200 ring-offset-2 ring-offset-gray-800 ring-white peer-checked:ring cursor-pointer w-full">
              {dayNames[i]}
              <div className="w-4 h-4">{active && <CheckCircleIcon />}</div>
            </span>
          </label>
        ))}
      </div>
      {triggers.map(({ time, brightness, duration }, index) => (
        <div
          className="relative grid grid-cols-[min-content,auto] gap-4 border-2 rounded-md mb-10 p-4"
          key={index}
        >
          <label htmlFor={`time-input-${index}`} className="text-white pr-4">
            Hoe laat activeren
          </label>
          <div>
            <input
              id={`time-input-${index}`}
              className="px-4 py-2 rounded-md"
              type="time"
              value={time}
              onChange={(e) => setTime(index, e.target.value)}
            />
          </div>
          <label htmlFor={`brightness-input-${index}`} className="text-white pr-4">
            Helderheid
          </label>
          <input
            className="mx-2"
            type="range"
            value={brightness}
            max={254}
            onChange={(e) => setBrightness(index, e.target.valueAsNumber)}
          />
          <div className="col-start-2 inline-flex ">
            <input
              id={`brightness-input-${index}`}
              className="px-4 py-2 mr-4 rounded-md w-[10ch] self-center"
              type="number"
              min={0}
              max={254}
              value={brightness}
              onChange={(e) => setBrightness(index, e.target.valueAsNumber)}
            />
            <div className="w-10 h-10  border-2 rounded-full bg-black text-yellow-300 p-2 col-start-2">
              <LightBulbIcon style={{ opacity: mapBrightness(brightness, 0, 255, 0.4, 1) }} />
            </div>
          </div>

          <label htmlFor={`duration-input-${index}`} className="text-white mr-4 self-center">
            Lichtduur
          </label>

          <div
            className={classNames(
              'bg-white rounded-md px-4 py-2 whitespace-nowrap lg:w-44',
              duration === 0 && 'bg-gray-200'
            )}
          >
            <input
              id={`duration-input-${index}`}
              name="duration"
              className="w-[6ch] mr-2"
              type="number"
              min={0}
              max={254}
              value={duration === 0 ? baseDuration : duration}
              onChange={(e) => setDuration(index, e.target.valueAsNumber)}
              disabled={duration === 0}
            />
            seconde{duration !== 1 && 'n'}
          </div>
          <button
            className="bg-gray-50 text-black hover:bg-gray-200 py-2 px-4 rounded-md col-start-2"
            onClick={
              duration === 0 ? () => setDuration(index, baseDuration) : () => removeDuration(index)
            }
          >
            {duration === 0 ? 'Andere lichtduur' : `Gebruik de standaard ${baseDuration} seconden`}
          </button>
          {triggers.length > 1 && (
            <div
              onClick={() => removeTrigger(index)}
              className="absolute -top-4 -right-4 bg-gray-800 cursor-pointer text-red-500 w-8 h-8 text-center hover:text-red-700"
            >
              <XCircleIcon />
            </div>
          )}
          {index !== 0 && (
            <div
              onClick={() => moveTrigger(index, 'up')}
              className="absolute -top-4 -left-4 bg-gray-800 cursor-pointer text-blue-400 w-8 h-8 text-center hover:text-blue-600"
            >
              <ArrowCircleUpIcon />
            </div>
          )}
          {index !== triggers.length - 1 && (
            <div
              onClick={() => moveTrigger(index, 'down')}
              className="absolute -bottom-4 -left-4 bg-gray-800 cursor-pointer text-blue-400 w-8 h-8 text-center hover:text-blue-600"
            >
              <ArrowCircleDownIcon />
            </div>
          )}
        </div>
      ))}
      <button
        className="relative bg-gray-50 text-black hover:bg-gray-200 py-2 px-4 rounded-md border border-gray-500"
        onClick={addTrigger}
      >
        <div className="absolute -top-4 -right-4 bg-gray-800 rounded-full cursor-pointer text-green-400 w-8 h-8">
          <PlusCircleIcon />
        </div>
        Trigger toevoegen
      </button>
      <div
        onClick={removeWeekConfig}
        className="absolute -top-4 -right-4 bg-gray-900 rounded-full border-2 border-gray-900 cursor-pointer text-red-500 w-8 h-8 text-center hover:text-red-700"
      >
        <XCircleIcon />
      </div>
    </div>
  );
}

export default WeekConfig;
