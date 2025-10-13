export const SELECTION_COUNT = 10;
export const FLASH_INTERVAL_MS = 130; // interval for border flash
export const HINT_THRESHOLD = 2; // show correct answer after this many wrong tries
// Weighting parameters for selection probabilities
// Heavier gamma => problem kana dominate more strongly
export const WEIGHT_GAMMA = 1.6;
// Minimum relative weight so zero-score items still appear sometimes
export const WEIGHT_EPSILON = 0.05;
// Correct-answer smoothing: amount subtracted per perfect first-try answer
export const SMOOTH_BETA = 0.15;
// After this many perfect first-try answers, reset weight to baseline (score -> 0)
export const PERFECT_STREAK_RESET = 3;
