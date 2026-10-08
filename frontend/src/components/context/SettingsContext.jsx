import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const defaultSettings = {
  fillWarning: 50,
  fillCritical: 80,
  batteryWarning: 20,
};

const getSavedSettings = () => {
  const saved = localStorage.getItem("garbageBinSettings");
  if (!saved) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(saved) };
  } catch {
    return defaultSettings;
  }
};

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(getSavedSettings);

  useEffect(() => {
    localStorage.setItem("garbageBinSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (name, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value = {
    settings,
    updateSetting,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  return useContext(SettingsContext);
};
