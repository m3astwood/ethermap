export default (fillColour) => `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve" style="${
  fillColour ? `--fill: ${fillColour.replace("'", '')}` : ''
}; fill: var(--fill, currentcolor);">

<defs>
</defs>
<g transform="translate(1.4065934065934016 1.4065934065934016) scale(0.275 0.275)" >
<path d="M 63.269 55.583 l 25.589 -10.294 c 1.682 -0.677 1.459 -3.168 -0.362 -4.041 L 2.884 0.205 c -1.71 -0.82 -3.499 0.969 -2.679 2.679 l 41.043 85.612 c 0.873 1.821 3.364 2.044 4.041 0.362 l 10.294 -25.589 C 56.991 59.767 59.767 56.991 63.269 55.583 z" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>
`
