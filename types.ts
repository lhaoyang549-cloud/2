export type ShapeType = 'sphere' | 'cube' | 'pyramid' | 'torus';

export type ColorMode = 'rainbow' | 'warm' | 'cool' | 'nature';

export interface UIState {
  shape: ShapeType;
  colorMode: ColorMode;
  setShape: (shape: ShapeType) => void;
  setColorMode: (mode: ColorMode) => void;
}