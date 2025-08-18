export const PALETTE = [
  "#339564",
  "#E2707D",
  "#00A050",
  "#353535",
  "#910C1B",
  "#FFFFFF",
  "#000000",
];

export const colorAt = (i: number) => PALETTE[i % PALETTE.length];
