const isHex = (hex: string) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);
const isRGB = (color: string) => /^rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/i.test(color);
const isHSL = (color: string) => /^hsl\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/i.test(color);
const toHex = (value: number | string) => (+value).toString(16).padStart(2, '0');

export function convertHexToRGB(hex: string) {
  if (!isHex(hex)) {
    throw new Error('Invalid hex color');
  }

  const fullHex =
    hex.length === 4
      ? [...hex]
          .slice(1)
          .map((c) => c + c)
          .join('')
      : hex.slice(1);

  const [r, g, b] = fullHex.match(/.{2}/g)!.map((c) => Number.parseInt(c, 16));

  return {
    r,
    g,
    b,
    toString: () => `rgb(${r}, ${g}, ${b})`,
  };
}

export function convertHexToHSL(hex: string) {
  if (!isHex(hex)) {
    throw new Error('Invalid hex color');
  }

  const { r, g, b } = convertHexToRGB(hex);

  return convertRGBToHSL(r, g, b);
}

export function convertRGBToHex(red: number | string, green: number | string, blue: number | string) {
  return `#${[red, green, blue].map(toHex).join('')}`;
}

export function convertRGBToHSL(red: number, green: number, blue: number) {
  const clamp = (value: number) => Math.min(255, Math.max(0, value)) / 255;
  const [r, g, b] = [red, green, blue].map(clamp);

  const cmax = Math.max(r, g, b);
  const cmin = Math.min(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  if (delta) {
    if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = ((cmax + cmin) / 2) * 100;
  const s = delta ? (delta / (1 - Math.abs(2 * (l / 100) - 1))) * 100 : 0;

  return {
    h: +h.toFixed(1),
    s: +s.toFixed(1),
    l: +l.toFixed(1),
    toString: () => `hsl(${h}, ${s}%, ${l}%)`,
  };
}

export function convertHSLToRGB(hue: number, saturation: number, lightness: number) {
  const h = ((hue % 360) + 360) % 360;
  const s = Math.min(100, Math.max(0, saturation)) / 100;
  const l = Math.min(100, Math.max(0, lightness)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  const [r, g, b] = [
    [c, x, 0], // 0° ≤ h < 60°
    [x, c, 0], // 60° ≤ h < 120°
    [0, c, x], // 120° ≤ h < 180°
    [0, x, c], // 180° ≤ h < 240°
    [x, 0, c], // 240° ≤ h < 300°
    [c, 0, x], // 300° ≤ h < 360°
  ][Math.floor(h / 60)] || [0, 0, 0];

  const to255 = (value: number) => Math.round((value + m) * 255);

  return {
    r: to255(r),
    g: to255(g),
    b: to255(b),
    toString: () => `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`,
  };
}

export class ColorConverter {
  hex = '#000000';
  rgb: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 };
  hsl: { h: number; s: number; l: number } = { h: 0, s: 0, l: 0 };

  constructor(color: string) {
    this.setColor(color);
  }

  private extractNumbers(color: string): number[] {
    return (color.match(/\d+/g) || []).map(Number);
  }

  setColor(color: string): void {
    if (isHex(color)) {
      this.hex = color;
      this.rgb = convertHexToRGB(color);
      this.hsl = convertRGBToHSL(this.rgb.r, this.rgb.g, this.rgb.b);
    } else if (isRGB(color)) {
      const [r, g, b] = this.extractNumbers(color);
      this.rgb = { r, g, b };
      this.hsl = convertRGBToHSL(r, g, b);
      this.hex = convertRGBToHex(r, g, b);
    } else if (isHSL(color)) {
      const [h, s, l] = this.extractNumbers(color);
      this.hsl = { h, s, l };
      this.rgb = convertHSLToRGB(h, s, l);
      this.hex = convertRGBToHex(this.rgb.r, this.rgb.g, this.rgb.b);
    } else {
      throw new Error('Invalid color format. Use HEX, RGB, or HSL.');
    }
  }

  getFormat(type: 'hex' | 'rgb' | 'hsl'): string {
    return (
      {
        hex: this.hex,
        rgb: `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`,
        hsl: `hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l}%)`,
      }[type] ??
      (() => {
        throw new Error('Invalid format type.');
      })()
    );
  }
}
