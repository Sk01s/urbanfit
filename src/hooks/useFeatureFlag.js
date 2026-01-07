import featureFlags from "@/config/featureFlags";

/**
 * Custom hook to check if a feature flag is enabled
 * @param {string} flagName - The name of the feature flag
 * @returns {boolean} - Whether the feature is enabled
 */
const useFeatureFlag = (flagName) => {
  return featureFlags[flagName] ?? false;
};

export default useFeatureFlag;
