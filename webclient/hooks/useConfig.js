import { useState, useEffect } from 'react';
import { baseConfig, getConfig } from '../api/config';

const emptyConfig = {
  defaultDuration: 120,
  weekConfigs: [baseConfig],
};

function useConfig() {
  const [config, setConfig] = useState(emptyConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getConfig()
      .then((config) => setConfig(config))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);
  return [config, loading, error];
}
export default useConfig;
