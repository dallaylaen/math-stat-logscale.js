'use strict';

class Binning {
    constructor (args={}) {
        let base = args.base || 1.001;
        let precision = args.precision || 1E-9;

        // Make sure base ** (some int) === 2
        if (!(base > 1) || !(base < 1.5))
            throw new Error('base must be a number between 1 and 1.5');
        base = 2**(1/Math.ceil(Math.log(2)/Math.log(base)));
        base = Number.parseFloat(''+base); // try to eliminate (de)serealization rounding errors
        if (base === 1)
            throw new Error('base too close to 1');

        // Linear threshold. Inv: (base-1) * thresh === (minimal bin width) === precision!
        let thresh = precision / (base-1);
        const equalBins = Math.ceil( thresh / precision );
        precision = thresh / equalBins;
        thresh = precision * equalBins; // recalc to minimize rounding errors

        // TODO Make sure 1 is the center of a bin

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
            return this.thresh * this.base ** Math.round( Math.log(x / this.thresh) / Math.log(this.base) );
        };
    }
}

module.exports = { Binning };
