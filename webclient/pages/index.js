import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import { PlusCircleIcon } from '@heroicons/react/outline';

import useConfig from '../hooks/useConfig';
import WeekConfig from '../components/WeekConfig';
import { setConfig, baseConfig } from '../api/config';
import classNames from '../util/classNames';
import Title from '../components/Title';

export default function App() {
  const [defaultDuration, setDefaultDuration] = useState(120);
  const [configSaving, setConfigSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [weekConfigs, setWeekConfigs] = useImmer([]);

  const [config, configLoading, configError] = useConfig();
  useEffect(() => {
    setWeekConfigs((draft) => {
      draft.splice(0, draft.length);
      draft.push(...config.weekConfigs);
    });
    setDefaultDuration(config.defaultDuration);
  }, [config, setWeekConfigs]);

  const addTrigger = (weekConfigIndex) => {
    setWeekConfigs((draft) => {
      const currentTriggers = weekConfigs[weekConfigIndex].triggers;
      const lastTrigger = currentTriggers[currentTriggers.length - 1];
      draft[weekConfigIndex].triggers.push(lastTrigger);
    });
  };

  const removeTrigger = (weekConfigIndex, triggerIndex) => {
    setWeekConfigs((draft) => {
      draft[weekConfigIndex].triggers.splice(triggerIndex, 1);
    });
  };

  const setTrigger = (weekConfigIndex, triggerIndex, newTrigger) => {
    setWeekConfigs((draft) => {
      draft[weekConfigIndex].triggers[triggerIndex] = newTrigger;
    });
  };

  const moveTrigger = (weekConfigIndex, triggerIndex, direction) => {
    setWeekConfigs((draft) => {
      let targetIndex;
      if (direction === 'up') {
        if (triggerIndex === 0) {
          return;
        }
        targetIndex = triggerIndex - 1;
      }
      if (direction === 'down') {
        if (triggerIndex === weekConfigs[weekConfigIndex].triggers.length - 1) {
          return;
        }
        targetIndex = triggerIndex + 1;
      }
      const trigger1 = Object.assign({}, draft[weekConfigIndex].triggers[triggerIndex]);
      const trigger2 = Object.assign({}, draft[weekConfigIndex].triggers[targetIndex]);
      draft[weekConfigIndex].triggers[targetIndex] = trigger1;
      draft[weekConfigIndex].triggers[triggerIndex] = trigger2;
    });
  };

  const toggleDay = (weekConfigIndex, day) => {
    setWeekConfigs((draft) => {
      draft[weekConfigIndex].days[day] = !weekConfigs[weekConfigIndex].days[day];
    });
  };

  const addWeekConfig = () => {
    setWeekConfigs((draft) => {
      draft.push(baseConfig);
    });
  };

  const removeWeekConfig = (index) => {
    setWeekConfigs((draft) => {
      draft.splice(index, 1);
    });
  };

  const saveConfig = async () => {
    setConfigSaving(true);
    try {
      await setConfig({ defaultDuration, weekConfigs });
    } catch (error) {
      setSaveError(error);
    }
    setConfigSaving(false);
  };

  if (configLoading) {
    return (
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <SunIcon className="w-32 h-32 text-yellow-500 animate-bounce" />
        <div className="text-white text-3xl animate-pulse">Aan het laden ...</div>
      </div>
    );
  }

  if (configError || saveError) {
    return (
      <div className="flex flex-col w-screen h-screen justify-center items-center gap-4">
        <MoonIcon className="w-32 h-32 text-red-500" />
        <div className="text-red-300 text-3xl max-w-xl">
          {configError && configError.toString()}
          {saveError && saveError.toString()}
        </div>
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
          onClick={() => setSaveError(null)}
        >
          Terug naar vorige pagina
        </button>
      </div>
    );
  }
  const durationButtons = [60, 120, 180, 240, 300].map((duration) => (
    <button
      key={duration}
      className="bg-gray-50 text-black hover:bg-gray-200 py-2 px-4 rounded-md border border-gray-500"
      onClick={() => setDefaultDuration(duration)}
    >
      {duration < 60 ? duration : duration / 60} {duration === 60 ? 'minuut' : 'minuten'}
    </button>
  ));

  return (
    <div className="flex my-4 justify-center">
      <main className="w-screen lg:max-w-screen-md container px-4 sm:px-6 md:px-12 pb-10">
        <Title />
        <div className="bg-gray-800 p-4 rounded-md shadow-md mb-4">
          <div>
            <label className="inline-flex">
              <span className="text-white pr-4 self-center">Standaard lichtduur</span>
              <span className="bg-white rounded-md px-4 py-2 whitespace-nowrap self-center">
                <input
                  className="w-[8ch] mr-4"
                  type="number"
                  min={0}
                  max={254}
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.valueAsNumber)}
                />
                seconde{defaultDuration !== 1 && 'n'}
              </span>
            </label>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">{durationButtons}</div>
        </div>
        {weekConfigs.map((weekConfig, index) => (
          <WeekConfig
            key={index}
            baseDuration={defaultDuration}
            weekConfig={weekConfig}
            addTrigger={() => addTrigger(index)}
            removeTrigger={(triggerIndex) => removeTrigger(index, triggerIndex)}
            setTrigger={(triggerIndex, newTrigger) => setTrigger(index, triggerIndex, newTrigger)}
            moveTrigger={(triggerIndex, direction) => moveTrigger(index, triggerIndex, direction)}
            removeWeekConfig={() => removeWeekConfig(index)}
            toggleDay={(day) => toggleDay(index, day)}
          />
        ))}
        <button
          className="relative bg-gray-50 text-black hover:bg-gray-200 py-2 px-4 rounded-md border border-gray-500"
          onClick={addWeekConfig}
        >
          <div className="absolute -top-4 -right-4 bg-gray-900 rounded-full cursor-pointer text-green-400 w-8 h-8">
            <PlusCircleIcon />
          </div>
          Configuratieset toevoegen
        </button>
        <button
          className={classNames(
            `block w-full bg-gray-50 text-black hover:bg-gray-200 py-2 px-4 rounded-md border border-gray-500 text-center mt-4 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-wait`,
            configSaving && 'animate-pulse'
          )}
          disabled={configSaving}
          onClick={saveConfig}
        >
          {configSaving ? 'Bezig met opslaan' : 'Configuratie opslaan'}
        </button>
      </main>
    </div>
  );
}
