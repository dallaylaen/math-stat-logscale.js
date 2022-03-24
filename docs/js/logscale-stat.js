/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\n(() => {\n    const { Binning } = __webpack_require__(/*! ./lib/binning.js */ \"./lib/binning.js\");\n    const { Univariate } = __webpack_require__(/*! ./lib/univariate.js */ \"./lib/univariate.js\");\n\n    // TODO better name\n    // Must be short & reflect (math, statistics, logarithm)\n    const logstat = { Binning, Univariate };\n\n    if (typeof window !== 'undefined')\n        window.logstat = logstat;\n    else\n        module.exports = logstat;\n})();\n\n\n//# sourceURL=webpack://math-stat-logscale/./index.js?");

/***/ }),

/***/ "./lib/binning.js":
/*!************************!*\
  !*** ./lib/binning.js ***!
  \************************/
/***/ ((module) => {

eval("\n\nclass Binning {\n    constructor (args = {}) {\n        let base = args.base || 1.001;\n        let precision = args.precision || 1E-9;\n\n        // Make sure base ** (some int) === 2\n        if (!(base > 1) || !(base < 1.5))\n            throw new Error('base must be a number between 1 and 1.5');\n        base += 1e-9; // TODO explain - we must round-trip w/o getting \"eaten\"\n        base = 2 ** (1 / Math.ceil(Math.log(2) / Math.log(base)));\n        if (base === 1)\n            throw new Error('base too close to 1');\n\n        // Linear threshold. Inv: (base-1) * thresh === (minimal bin width) === precision!\n        precision = Number.parseFloat('' + precision); // make sure (de)serealization is ok\n        const equalBins = Math.ceil( 1 / (base - 1) );\n        const thresh = precision * equalBins; // recalc to minimize rounding errors\n\n        // TODO Make sure 1 is the center of a bin\n\n        this._thresh = thresh;\n        this._precision = precision;\n        this._base = base;\n    }\n\n    getBase () {\n        return this._base;\n    }\n\n    getPrecision () {\n        return this._precision;\n    }\n\n    // Rounding to nearest bin first, TODO linear split\n    round (x) {\n        if (Number.isNaN( x + 0 ))\n            throw new Error('Attempt to round a non-numeric value: ' + x);\n        if (x < 0) return -this.round(-x);\n        if (x < this._thresh)\n            return Math.round( x / this._precision ) * this._precision;\n        else\n            return this._thresh * this._base ** Math.round( Math.log(x / this._thresh) / Math.log(this._base) );\n    }\n\n    upper (x) {\n        if (x < 0)\n            return -this.lower(-x);\n        x = this.round(x);\n        if (x < this._thresh)\n            return x + this._precision / 2;\n        return x * Math.sqrt(this._base);\n    }\n\n    lower (x) {\n        if (x < 0)\n            return -this.upper(-x);\n        x = this.round(x);\n        if (x <= this._thresh)\n            return x - this._precision / 2;\n        return x / Math.sqrt(this._base);\n    }\n\n    shorten (x, y) {\n        return y === undefined\n            ? shorten(this.lower(x), this.upper(x))\n            : shorten(x, y);\n    }\n}\n\nfunction shorten (min, max, base = 10) {\n    // TODO validate, swap, diff sign, etc\n    if (min === max)\n        return min;\n    if (min * max < 0)\n        return 0;\n    if (max < 0)\n        return -shorten(-max, -min, base);\n    if (min > max)\n        return  shorten( max, min, base);\n\n    for (let scale = 1; ;scale *= base) {\n        if ( Math.ceil( min * scale ) <= Math.floor( max * scale ))\n            return Math.ceil( min * scale ) / scale;\n    }\n}\n\nmodule.exports = { Binning, shorten };\n\n\n//# sourceURL=webpack://math-stat-logscale/./lib/binning.js?");

/***/ }),

/***/ "./lib/univariate.js":
/*!***************************!*\
  !*** ./lib/univariate.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst { Binning } = __webpack_require__( /*! ./binning.js */ \"./lib/binning.js\" );\n\nclass Univariate extends Binning {\n    constructor (args = {}) {\n        super(args);\n        this.storage = {}; // str(bin) => [ count, num(bin) ]\n        this._count = 0;\n        this._cache = {};\n        this.neat = new Neat(this);\n\n        if (args.bins)\n            this.addWeighted(args.bins);\n    }\n\n    add ( ...data ) {\n        this._cache = {};\n        data.forEach( x => {\n            const bin = this.round(x);\n            if ( !this.storage[bin] )\n                this.storage[bin] = [0, bin];\n            this.storage[bin][0]++;\n        });\n        this._count += data.length;\n        return this;\n    }\n\n    addWeighted ( data ) {\n        this._cache = {};\n        // TODO validate\n        data.forEach( entry => {\n            const bin = this.round( entry[0] );\n            if ( !this.storage[bin] )\n                this.storage[bin] = [0, bin];\n            this.storage[bin][0] += entry[1];\n            this._count += entry[1];\n        });\n        return this;\n    }\n\n    toJSON () {\n        return {\n            precision: this.getPrecision(),\n            base:      this.getBase(),\n            bins:      this.getBins(),\n        }\n    }\n\n    getBins () {\n        if (!this._cache.data) {\n            this._cache.data = Object.values( this.storage )\n                .map( bin => [bin[1], bin[0]] )\n                .sort( (x, y) => x[0] - y[0] );\n        }\n        return this._cache.data;\n    }\n\n    count () {\n        return this._count;\n    }\n\n    min () {\n        if (!this._count)\n            return undefined;\n        const data = this.getBins();\n        return this.lower(data[0][0]);\n    }\n\n    max () {\n        if (!this._count)\n            return undefined;\n        const data = this.getBins();\n        return this.upper(data[data.length - 1][0]);\n    }\n\n    integrate (fun) {\n        let s = 0;\n        Object.values(this.storage).forEach( bin => { s += bin[0] * fun(bin[1]) } );\n        return s;\n    }\n\n    E (fun) {\n        return this._count ? this.integrate( fun ) / this._count : undefined;\n    }\n\n    mean () {\n        return this._count ? this.integrate( x => x ) / this._count : undefined;\n    }\n\n    stdev () {\n        // TODO better corrections?\n        if (this._count < 2)\n            return undefined;\n        const mean = this.mean();\n        return Math.sqrt( this.integrate( x => (x - mean) * (x - mean) )\n            / (this._count - 1) ); // Bessel's correction\n    }\n\n    quantile (p) {\n        if (!this._count)\n            return undefined;\n        const target = p * this._count;\n\n        const cumulative = this._cumulative();\n\n        let l = 0;\n        let r = cumulative.length;\n\n        // console.log('target=' + target);\n\n        while ( l + 1 < r ) {\n            const m = Math.floor( (r + l) / 2 );\n            // console.log( '['+l+', '+r+'): middle='+m+':', cumulative[m]);\n\n            if (cumulative[m][1] >= target)\n                r = m;\n            else\n                l = m;\n        }\n\n        const start = this.lower(cumulative[l][0]);\n        const width = this.upper(cumulative[l][0]) - start;\n\n        // Division by zero must not happen as zero-count buckets\n        // should not exist.\n        return start + width * (target - cumulative[l][1]) / (cumulative[l][2] - cumulative[l][1]);\n    }\n\n    cdf (x) {\n        return this.rawCdf(x) / this._count;\n    }\n\n    rawCdf (x) {\n        // do nothing if possible\n        if (!this._count || x <= this.min())\n            return 0;\n        if ( x >= this.max())\n            return this._count;\n\n        const cumulative = this._cumulative();\n        const lookup = this.round(x);\n\n        // binary search\n        // Look for the rightmost bucket <= round(x)\n        let l = 0;\n        let r = cumulative.length;\n\n        // console.log( 'target='+x );\n        while (l + 1 < r) {\n            const m = Math.floor((r + l) / 2);\n            // console.log('['+l+', '+r+'): mid='+m+'; bin=', cumulative[m]);\n            if (cumulative[m][0] <= lookup)\n                l = m;\n            else\n                r = m;\n        }\n\n        // console.log('Looked for '+x+', found: ', [cumulative[l - 1], cumulative[l]] );\n\n        // we fell between buckets - ok great\n        if (lookup > cumulative[l][0])\n            return cumulative[l][2];\n\n        // Sum of buckets prior to the one x is in\n        // plus the _part_ of bucket left of x\n        // divided by total count\n        return (\n            cumulative[l][1]\n                + (cumulative[l][2] - cumulative[l][1]) // x'th bucket total\n                    * (x - this.lower(x))               // part left of x\n                    / (this.upper(x) - this.lower(x))   // bucket width\n        );\n    }\n\n    histogram (args = {}) {\n        // TODO options\n        if (!this._count)\n            return [];\n        const min = this.min();\n        const max = this.max();\n        const count = args.count || 10;\n\n        const hist = []; // [ count, lower, upper ], ...\n        let edge = min;\n        const step = (max - min) / count;\n        for (let i = 0; i < count; i++)\n            hist.push( [this.rawCdf(edge + step), edge, edge += step] );\n\n        // Differenciate (must go backward!)\n        for (let i = hist.length; i-- > 1; )\n            hist[i][0] -= hist[i - 1][0];\n\n        hist[0][0] -= this.rawCdf(min);\n\n        if (args.scale) {\n            // scale to a factor e.g. for drawing pictures\n            let max = 0;\n            for (let i = 0; i < hist.length; i++) {\n                if (max < hist[i][0])\n                    max = hist[i][0];\n            }\n\n            for (let i = 0; i < hist.length; i++)\n                hist[i][0] = hist[i][0] * args.scale / max;\n        }\n\n        return hist;\n    }\n\n    _cumulative () {\n        // integral of sorted bins\n        // [ [ bin_center, sum_before, sum_after ], ... ]\n        if (!this._cache.cumulative) {\n            const data = this.getBins();\n            const cumulative = [];\n            let sum = 0;\n            for (let i = 0; i < data.length; i++)\n                cumulative.push( [data[i][0], sum, sum += data[i][1]] );\n\n            this._cache.cumulative = cumulative;\n        }\n        return this._cache.cumulative;\n    }\n}\n\nclass Neat {\n    constructor (main) {\n        this._main = main;\n    }\n\n    min () {\n        if (!this._main._count)\n            return undefined;\n        const data = this._main.getBins();\n        return this._main.shorten(data[0][0]);\n    }\n\n    max () {\n        if (!this._main._count)\n            return undefined;\n        const data = this._main.getBins();\n        return this._main.shorten(data[data.length - 1][0]);\n    }\n}\n\n[\n    'E',\n    'mean',\n    'quantile',\n    'stdev',\n].forEach( fun => {\n    Neat.prototype[fun] = function (arg) {\n        return this._main.shorten( this._main[fun](arg) );\n    }\n});\n\n[\n    'cdf',\n    'count',\n].forEach( fun => {\n    Neat.prototype[fun] = function (arg) {\n        return this._main[fun](arg);\n    }\n});\n\nmodule.exports = { Univariate };\n\n\n//# sourceURL=webpack://math-stat-logscale/./lib/univariate.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;