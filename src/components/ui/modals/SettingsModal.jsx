import React from 'react';
import { LAYOUT_OPTIONS, THEME_OPTIONS } from '../../../constants/index.js';
import { SettingsIcon, CloseIcon, LayoutIcon } from '../icons/index.js';

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const layoutOptions = LAYOUT_OPTIONS;
  const themeOptions = THEME_OPTIONS;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-lg rounded-lg shadow-xl ${
          settings.darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            settings.darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-medium ${
              settings.darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Settings
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 ${
              settings.darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Fretboard Orientation */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                settings.darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Fretboard Orientation
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  checked={!settings.verticalFretboard}
                  onChange={() =>
                    handleSettingChange("verticalFretboard", false)
                  }
                  className="mr-2 text-blue-600"
                />
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  }
                >
                  Horizontal (Traditional)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  checked={settings.verticalFretboard}
                  onChange={() =>
                    handleSettingChange("verticalFretboard", true)
                  }
                  className="mr-2 text-blue-600"
                />
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  }
                >
                  Vertical (Mobile-friendly)
                </span>
              </label>
            </div>
          </div>

          {/* Theme */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                settings.darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSettingChange("theme", option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.theme === option.value
                      ? settings.darkMode
                        ? "border-blue-500 bg-blue-900/30"
                        : "border-blue-500 bg-blue-50"
                      : settings.darkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      settings.darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      settings.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Size */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                settings.darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Layout Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    handleSettingChange("layoutSize", option.value)
                  }
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                    settings.layoutSize === option.value
                      ? settings.darkMode
                        ? "border-blue-500 bg-blue-900/30"
                        : "border-blue-500 bg-blue-50"
                      : settings.darkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <LayoutIcon
                    type={option.value}
                    className={`w-6 h-6 mb-2 ${
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                  <div
                    className={`text-sm font-medium ${
                      settings.darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`text-xs mt-1 text-center ${
                      settings.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`px-6 py-4 border-t ${
            settings.darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 rounded font-medium ${
              settings.darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;