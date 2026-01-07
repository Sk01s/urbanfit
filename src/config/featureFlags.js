/**
 * Feature Flags Configuration
 *
 * Centralized location for managing feature flags.
 * Set to true to enable, false to disable features.
 */

const featureFlags = {
  // OTP verification for phone numbers during checkout
  ENABLE_OTP_VERIFICATION: true,

  // Add more flags here as needed
  // ENABLE_WISHLIST: true,
  // ENABLE_ADVANCED_SEARCH: false,
};

export default featureFlags;
