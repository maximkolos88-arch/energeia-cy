/**
 * Energeia Cyprus - Feature Flags Configuration
 * Control rollout phases for platform modules.
 */

export interface FeatureFlags {
  enableTerminal: boolean; // Helios Eye Terminal / Map
  enableMembers: boolean;  // Members & Directory
  enableMagazine: boolean; // Print & Digital Magazine Issues
  enableAcademy: boolean;  // Educational Courses & Academy
  enableAbout: boolean;    // About Energeia & Network Info
  enableRegister: boolean; // Registration & Onboarding
}

export const FEATURES: FeatureFlags = {
  enableTerminal: false,
  enableMembers: false,
  enableMagazine: false,
  enableAcademy: false,
  enableAbout: true,
  enableRegister: true,
};
