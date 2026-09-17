function fallbackColor(str) {
  if (!str.includes('oklch') && !str.includes('oklab')) return str;
  return str.replace(/okl[ca][bh]\(\s*([0-9.]+%?)(?:.*?)(?:\/\s*([0-9.]+%?))?\s*\)/g, (match, l, a) => {
    let lum = parseFloat(l);
    if (l.includes('%')) lum = lum / 100;
    const v = Math.max(0, Math.min(255, Math.round(lum * 255)));
    let alpha = 1;
    if (a) {
      alpha = a.includes('%') ? parseFloat(a)/100 : parseFloat(a);
    }
    return `rgba(${v}, ${v}, ${v}, ${alpha})`;
  });
}

console.log(fallbackColor("oklch(0.96 0.01 250)"));
console.log(fallbackColor("oklch(0.96 0.01 250 / 0.5)"));
console.log(fallbackColor("oklab(50% 0.1 -0.1)"));
console.log(fallbackColor("linear-gradient(oklch(0.5 0.1 200), oklab(0.2 0 0 / 0.8))"));
