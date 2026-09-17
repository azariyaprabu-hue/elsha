function testColorReplace(val) {
  return val.replace(/okl[ca][bh]\(([^)]+)\)/g, (match, inner) => {
    // just replace with a safe gray
    return `rgba(128,128,128,1)`;
  });
}
console.log(testColorReplace("oklch(0.5 0.1 200)"));
