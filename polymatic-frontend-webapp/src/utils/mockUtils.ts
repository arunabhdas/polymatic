export const generateSparkline = (
  points: number,
  min: number,
  max: number,
  currentValue: number
): number[] => {
  const data: number[] = [];
  let current = min + (max - min) / 2;
  
  for (let i = 0; i < points - 1; i++) {
    data.push(current);
    // Brownian motion step
    const step = (Math.random() - 0.5) * ((max - min) * 0.1);
    current = Math.max(min, Math.min(max, current + step));
  }
  
  // Ensure we end exactly on the current value
  data.push(currentValue);
  return data;
};

// Expose a seeded random for reproducible generation if needed
export const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
