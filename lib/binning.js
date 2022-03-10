'use strict';

class Binning {
    constructor (args={}) {
        let base = args.base || 1.001;
        let precision = args.precision || 1E-9;

        // TODO Make sure base ** (some int) === 2
        // TODO Make sure 1 is the middle of a bin

        // Linear threshold. Inv: base * linear === precision!
        const thresh = precision / (base-1);
        this.thresh = thresh;
        this.precision = precision;
        this.base = base;
    }

    // Rounding to nearest bin first, TODO linear split
    round(x) {
        if (Number.isNaN( x + 0 ))
            throw new Error('Attempt to round a non-numeric value: '+x);
        if (x < 0) return -this.round(-x);
        if (x < this.thresh) {
            return Math.round( x / this.precision ) * this.precision;
        } else {
            return this.base ** Math.round( Math.log(x) / Math.log(this.base) );
        };
    }
}

module.exports = { Binning };
