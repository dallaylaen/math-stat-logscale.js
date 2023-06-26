/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./extras.js":
/*!*******************!*\
  !*** ./extras.js ***!
  \*******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n(() => {\n    const goodies = {\n        ...__webpack_require__(/*! ./extras/univariate-to-png */ \"./extras/univariate-to-png.js\"),\n    };\n\n    if (typeof window !== 'undefined') {\n        for (let name in goodies) {\n            console.log('copy '+name+'to window');\n            window[name] = goodies[name];\n        }\n    } else {\n        module.exports = goodies;\n    }\n})()\n\n\n//# sourceURL=webpack://stats-logscale/./extras.js?");

/***/ }),

/***/ "./extras/univariate-to-png.js":
/*!*************************************!*\
  !*** ./extras/univariate-to-png.js ***!
  \*************************************/
/***/ ((module) => {

eval("const graphColoring = [\n    [0,    'orange'],\n    [0.05, 'yellow'],\n    [0.25, 'blue' ],\n    [0.5,  'yellow' ],\n    [0.75, 'blue' ],\n    [0.95, 'orange'],\n    [1,    'red']\n];\n\nconst em = 8;\n\nfunction univariateToPng(copy, canvas, options={}) {\n    const height = Math.floor(Number.parseInt(window.innerHeight) / 5);\n    const width  = Math.floor(Number.parseInt(window.innerWidth) * 0.8) - 10;\n\n    canvas.height = height + em*2;\n    canvas.width = width + em*6;\n\n    const ctx = canvas.getContext('2d');\n    ctx.fillStyle = 'white';\n    ctx.fillRect(0, 0, canvas.width, canvas.height);\n    ctx.stroke();\n    ctx.fillStyle = 'lightgrey';\n    ctx.fillRect(em, 0, canvas.width-em*6, canvas.height-em*2);\n    ctx.stroke();\n\n    if(!copy.count())\n        return;\n\n    const min = copy.min();\n    const step = (copy.max() - min) / width;\n    const num2pic = x => (x - min) / step + em;\n\n    ctx.lineWidth = 1;\n\n    const hist = copy.histogram({count:width, scale:height});\n    const parts = graphColoring.map( x => [ copy.quantile(x[0]), x[1]] );\n    let partNum = 0;\n\n    for (let i = 0; i<width; i++) {\n        if (hist[i][1] >= parts[partNum][0])\n            ctx.strokeStyle = parts[partNum++][1];\n\n        ctx.beginPath();\n        ctx.moveTo( i + em, height );\n        ctx.lineTo( i + em, height - Math.ceil(hist[i][0]) );\n        ctx.stroke();\n    }\n\n    // mean +- stdev\n    const meanStd = [-1,0,1].map( x => copy.mean() + x*copy.stdev() )\n        .map( num2pic );\n    ctx.beginPath();\n    ctx.strokeStyle = 'orange';\n    ctx.moveTo( meanStd[0], canvas.height-em );\n    ctx.lineTo( meanStd[2], canvas.height-em );\n    ctx.moveTo( meanStd[0], canvas.height-em*1.4 );\n    ctx.lineTo( meanStd[0], canvas.height-em*0.6 );\n    ctx.moveTo( meanStd[1], canvas.height-em*1.6 );\n    ctx.lineTo( meanStd[1], canvas.height-em*0.4 );\n    ctx.moveTo( meanStd[2], canvas.height-em*1.4 );\n    ctx.lineTo( meanStd[2], canvas.height-em*0.6 );\n    ctx.stroke();\n\n    for (let i = 0; i<11; i++) {\n        ctx.beginPath();\n        ctx.fillStyle = '#222222';\n        ctx.font = em + 'px Sans';\n        const label = copy.shorten(copy.min() + (copy.max() - copy.min())*i/10);\n        ctx.setLineDash([1,3]);\n        ctx.moveTo( width*i/10 + em, canvas.height-em*1.5 );\n        ctx.lineTo( width*i/10 + em, 0 );\n        ctx.stroke();\n        ctx.strokeStyle = 'black';\n        ctx.setLineDash([1,0]);\n        ctx.fillText( label, width*i/10 + em, canvas.height-1 );\n    }\n\n    for (let i = 0; i<graphColoring.length-1; i++) {\n        ctx.beginPath();\n        ctx.fillStyle = graphColoring[i][1];\n        ctx.fillRect(em+width+2, i*em*2+2, em*1.5, em*1.5);\n        ctx.stroke();\n\n        const label = graphColoring[i+1][0] * 100 + '%';\n        ctx.beginPath();\n        ctx.fillStyle = '#222222';\n        ctx.fillText( label,  em*3+width, i*em*2+em*1.5);\n    }\n}\n\nmodule.exports = { univariateToPng };\n\n\n//# sourceURL=webpack://stats-logscale/./extras/univariate-to-png.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./extras.js");
/******/ 	
/******/ })()
;