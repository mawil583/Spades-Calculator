import {
  getFeatureFlag,
  setFeatureFlag,
  FEATURE_FLAGS,
  FLAG_DEFAULTS,
} from "./featureFlags";

describe("featureFlags utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should return default value when flag is not set", () => {
    expect(getFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe(
      FLAG_DEFAULTS[FEATURE_FLAGS.TABLE_ROUND_UI],
    );
  });

  it("should return true when flag is set to true in localStorage", () => {
    localStorage.setItem(FEATURE_FLAGS.TABLE_ROUND_UI, JSON.stringify(true));
    expect(getFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe(true);
  });

  it("should return false when flag is set to false in localStorage", () => {
    localStorage.setItem(FEATURE_FLAGS.TABLE_ROUND_UI, JSON.stringify(false));
    expect(getFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe(false);
  });

  it("should set flag in localStorage correctly", () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, true);
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe("true");

    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, false);
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe("false");
  });
});
