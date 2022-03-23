'use strict';

class Binning {
    constructor (args = {}) {
        let base = args.base || 1.001;
        let precision = args.precision || 1E-9;

        // Make sure base ** (some int) === 2
        if (!(base > 1) || !(base < 1.5))
            throw new Error('base must be a number between 1 and 1.5');
        base += 1e-9; // TODO explain - we must round-trip w/o getting "eaten"
        base = 2 ** (1 / Math.ceil(Math.log(2) / Math.log(base)));
        if (base === 1)
            throw new Error('base too close to 1');

        // Linear threshold. Inv: (base-1) * thresh === (minimal bin width) === precision!
        precision = Number.parseFloat('' + precision); // make sure (de)serealization is ok
        const equalBins = Math.ceil( 1 / (base - 1) );
        const thresh = precision * equalBins; // recalc to minimize rounding errors

        // TODO Make sure 1 is the center of a bin

        this._thresh = thresh;
        this._precision = precision;
        this._base = base;
    }

    getBase () {
        return this._base;
    }

    getPrecision () {
        return this._precision;
    }

    // Rounding to nearest bin first, TODO linear split
    round (x) {
        if (Number.isNaN( x + 0 ))
            throw new Error('Attempt to round a non-numeric value: ' + x);
        if (x < 0) return -this.round(-x);
        if (x < this._thresh)
            return Math.round( x / this._precision ) * this._precision;
        else
            return this._thresh * this._base ** Math.round( Math.log(x / this._thresh) / Math.log(this._base) );
    }

    upper (x) {
        if (x < 0)
            return -this.lower(-x);
        x = this.round(x);
        if (x < this._thresh)
            return x + this._precision / 2;
        return x * Math.sqrt(this._base);
    }

    lower (x) {
        if (x < 0)
            return -this.upper(-x);
        x = this.round(x);
        if (x <= this._thresh)
            return x - this._precision / 2;
        return x / Math.sqrt(this._base);
    }

    shorten (x, y) {
        return y === undefined
            ? shorten(this.lower(x), this.upper(x))
            : shorten(x, y);
    }
}

function shorten (min, max, base = 10) {
    // TODO validate, swap, diff sign, etc
    if (min === max)
        return min;
    if (min * max < 0)
        return 0;
    if (max < 0)
        return -shorten(-max, -min, base);
    if (min > max)
        return  shorten( max, min, base);

    for (let scale = 1; ;scale *= base) {
        if ( Math.ceil( min * scale ) <= Math.floor( max * scale ))
            return Math.ceil( min * scale ) / scale;
    }
}

module.exports = { Binning, shorten };
