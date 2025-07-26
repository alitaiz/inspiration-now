
/**
 * Generates a random HSL color with controlled lightness.
 * @param minLightness The minimum lightness value (0-100).
 * @param maxLightness The maximum lightness value (0-100).
 * @returns A CSS HSL color string.
 */
const generateRandomHslColor = (minLightness: number, maxLightness: number): string => {
  const hue = Math.floor(Math.random() * 361); // 0-360
  const saturation = Math.floor(40 + Math.random() * 41); // 40-80% for pleasant, not too washed-out colors
  const lightness = Math.floor(minLightness + Math.random() * (maxLightness - minLightness + 1)); // between min and max
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Generates a CSS linear-gradient string with two random, light colors.
 * @returns A CSS background value string.
 */
export const generateRandomGradient = (): string => {
  // Use high lightness values for a light, airy feel
  const color1 = generateRandomHslColor(88, 95); 
  const color2 = generateRandomHslColor(88, 95);
  const angle = Math.floor(Math.random() * 361);

  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};
