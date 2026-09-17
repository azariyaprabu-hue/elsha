function convertOklch(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/okl[ca][bh]\(\s*([^)]+)\s*\)/g, (match, inner) => {
        // if it contains var(), we can't easily parse it, return transparent or white
        if (inner.includes('var(')) return 'rgba(0,0,0,0)';
        
        const parts = inner.split(/[\s/]+/).filter(Boolean);
        if (parts.length < 3) return 'rgba(0,0,0,0)';
        
        let L = parseFloat(parts[0]);
        if (parts[0].includes('%')) L = L / 100;
        let C = parseFloat(parts[1]);
        let h = parseFloat(parts[2]);
        
        const hRad = h * Math.PI / 180;
        const a = C * Math.cos(hRad);
        const b = C * Math.sin(hRad);
        
        const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
        
        const l = Math.pow(Math.abs(l_), 3) * Math.sign(l_);
        const m = Math.pow(Math.abs(m_), 3) * Math.sign(m_);
        const s = Math.pow(Math.abs(s_), 3) * Math.sign(s_);
        
        const rLin = + 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const gLin = - 1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const bLin = - 0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
        
        const srgb = (c) => {
            c = Math.max(0, Math.min(1, c));
            return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
        };
        
        const rv = Math.max(0, Math.min(255, Math.round(srgb(rLin) * 255)));
        const gv = Math.max(0, Math.min(255, Math.round(srgb(gLin) * 255)));
        const bv = Math.max(0, Math.min(255, Math.round(srgb(bLin) * 255)));
        
        let alpha = 1;
        if (parts.length >= 4) {
            let aStr = parts[3];
            alpha = aStr.includes('%') ? parseFloat(aStr)/100 : parseFloat(aStr);
        }
        
        return `rgba(${rv}, ${gv}, ${bv}, ${alpha})`;
    });
}
console.log(convertOklch("oklch(0.5 0.2 250)"));
console.log(convertOklch("oklch(0.96 0.01 250 / 0.5)"));
console.log(convertOklch("linear-gradient(oklch(0.5 0.1 200), oklch(0.2 0 0 / 0.8))"));
