const styleContent = ".bg-blue { background-color: oklch(0.5 0.1 200); }";
const fallback = styleContent.replace(/okl[ca][bh]\(\s*([0-9.]+%?)(?:.*?)(?:\/\s*([0-9.]+%?))?\s*\)/g, (match, l, a) => {
  let lum = parseFloat(l);
  if (l.includes('%')) lum = lum / 100;
  const v = Math.max(0, Math.min(255, Math.round(lum * 255)));
  let alpha = 1;
  if (a) {
    alpha = a.includes('%') ? parseFloat(a)/100 : parseFloat(a);
  }
  return `rgba(${v}, ${v}, ${v}, ${alpha})`;
});
console.log(fallback);
