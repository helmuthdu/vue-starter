export function convertHexToRGB(h: string) {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(h)) {
    throw new Error('Invalid hex color');
  }

  let r = 0;
  let g = 0;
  let b = 0;

  if (h.length === 4) {
    r = Number.parseInt(`${h[1]}${h[1]}`, 16);
    g = Number.parseInt(`${h[2]}${h[2]}`, 16);
    b = Number.parseInt(`${h[3]}${h[3]}`, 16);
  } else {
    r = Number.parseInt(`${h[1]}${h[2]}`, 16);
    g = Number.parseInt(`${h[3]}${h[4]}`, 16);
    b = Number.parseInt(`${h[5]}${h[6]}`, 16);
  }

  return {
    b,
    g,
    r,
    toString: () => `rgb(${r}, ${g}, ${b})`,
  };
}

export function convertHexToHSL(hex: string) {
  const color = convertHexToRGB(hex);

  return convertRGBToHSL(color.r, color.g, color.b);
}

const toHex = (value: number | string) => {
  const hex = (+value).toString(16);

  return hex.length === 1 ? `0${hex}` : hex;
};

export function convertRGBToHex(red: number | string, green: number | string, blue: number | string) {
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

export function convertRGBToHSL(red: number, green: number, blue: number) {
  // ensure RGB values are within range [0, 255]
  const clamp = (value: number) => Math.min(255, Math.max(0, value));
  const r = clamp(red) / 255;
  const g = clamp(green) / 255;
  const b = clamp(blue) / 255;

  // compute min, max, and delta
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

  // compute Lightness (L)
  const l = ((cmax + cmin) / 2) * 100;

  // compute Hue (H)
  let h = 0;
  if (delta !== 0) {
    if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360; // normalize negative hues
  }

  // compute Saturation (S)
  const s = delta === 0 ? 0 : (delta / (1 - Math.abs(2 * (l / 100) - 1))) * 100;

  return {
    h: +h.toFixed(1),
    s: +s.toFixed(1),
    l: +l.toFixed(1),
    toString() {
      return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    },
  };
}

export function convertHSLToRGB(hue: number, saturation: number, lightness: number) {
  const h = ((hue % 360) + 360) % 360;
  const s = Math.min(100, Math.max(0, saturation)) / 100;
  const l = Math.min(100, Math.max(0, lightness)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  const lookup = [
    [c, x, 0], // 0° ≤ h < 60°
    [x, c, 0], // 60° ≤ h < 120°
    [0, c, x], // 120° ≤ h < 180°
    [0, x, c], // 180° ≤ h < 240°
    [x, 0, c], // 240° ≤ h < 300°
    [c, 0, x], // 300° ≤ h < 360°
  ];

  const [r, g, b] = lookup[Math.floor(h / 60) % 6];

  const to255 = (value: number) => Math.round((value + m) * 255);

  return {
    b: to255(b),
    g: to255(g),
    r: to255(r),
    toString() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    },
  };
}

export class ColorConverter {
  hex = '#000000';
  rgb: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 };
  hsl: { h: number; s: number; l: number } = { h: 0, s: 0, l: 0 };

  constructor(color: string) {
    this.setColor(color);
  }

  private setColor(color: string): void {
    if (this.isHex(color)) {
      this.rgb = convertHexToRGB(color);
      this.hsl = convertRGBToHSL(this.rgb.r, this.rgb.g, this.rgb.b);
      this.hex = color;
    } else if (this.isRGB(color)) {
      const [r, g, b] = this.extractNumbers(color);
      this.rgb = { r, g, b };
      this.hsl = convertRGBToHSL(r, g, b);
      this.hex = convertRGBToHex(r, g, b);
    } else if (this.isHSL(color)) {
      const [h, s, l] = this.extractNumbers(color);
      this.hsl = { h, s, l };
      this.rgb = convertHSLToRGB(h, s, l);
      this.hex = convertRGBToHex(this.rgb.r, this.rgb.g, this.rgb.b);
    } else {
      throw new Error('Invalid color format. Use HEX, RGB, or HSL.');
    }
  }

  private isHex(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  }

  private isRGB(color: string): boolean {
    return /^rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/i.test(color);
  }

  private isHSL(color: string): boolean {
    return /^hsl\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/i.test(color);
  }

  private extractNumbers(color: string): number[] {
    return (color.match(/\d+/g) || []).map(Number);
  }

  getFormat(type: 'hex' | 'rgb' | 'hsl'): string {
    switch (type) {
      case 'hex':
        return this.hex;
      case 'rgb':
        return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
      case 'hsl':
        return `hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l}%)`;
      default:
        throw new Error("Invalid format type. Use 'hex', 'rgb', or 'hsl'.");
    }
  }
}
