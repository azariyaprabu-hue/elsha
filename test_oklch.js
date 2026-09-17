function oklchToRgb(L, C, h) {
    // h in degrees
    const hRad = h * Math.PI / 180;
    
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);
    
    // oklab to lms
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    
    // lms to rgb (linear)
    const rLin = + 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const gLin = - 1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bLin = - 0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    
    // linear to srgb
    const srgb = (c) => {
        c = Math.max(0, Math.min(1, c));
        return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    };
    
    return [
        Math.round(srgb(rLin) * 255),
        Math.round(srgb(gLin) * 255),
        Math.round(srgb(bLin) * 255)
    ];
}

console.log(oklchToRgb(0.5, 0.2, 250));
