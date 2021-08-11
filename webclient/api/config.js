const endpoint = 'http://localhost:8080/api/';
const configEndpoint = `${endpoint}config`;

export async function getConfig() {
  try {
    const data = await fetch(configEndpoint);
    return data.json();
  } catch (error) {
    console.error(error);
    throw new Error(`Error while fetching config from server at ${configEndpoint}`);
  }
}
export async function setConfig(config) {
  try {
    await fetch(configEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Error while saving config on server at ${configEndpoint}`);
  }
}

export const baseConfig = {
  days: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  },
  triggers: [
    {
      time: '07:00',
      brightness: 255,
      duration: 60,
    },
    {
      time: '22:00',
      brightness: 1,
      duration: 0,
    },
  ],
};
