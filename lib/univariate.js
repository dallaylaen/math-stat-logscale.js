'use strict';

const { Binning } = require( './binning.js' );

/**
 *  @classdesc Univariate statistical distribution analysis tool
 *  It works by sorting data into bins.
 *  This bin size depends on absolute & relative precision
 *  of the incoming data.
 *  Thus, very large samples can be processed fast
 *  with reasonable memory usage.
 */
class Univariate extends Binning {
    /**
     * @param {Object} args
     * @param {Number} args.base      Must be between 1 and 1.5. Default is 1.001
     * @param {Number} args.precision Must be positive. Default is 1E-9.
     * @param {Array}  args.bins      See addWeighted() for description
     */
    constructor (args = {}) {
        super(args);
        this.storage = {}; // str(bin) => [ count, num(bin) ]
        this._count = 0;
        this._cache = {};
        this.neat = new Neat(this);

        if (args.bins)
            this.addWeighted(args.bins);
    }

    /**
     * @desc Add value(s) to sample.
     * @param {...Number} data Number(s) to add to sample
     * @returns {Univariate} this (chainable)
     * @example
     * for (let i=0; i<10000; i++)
     *    stat.add(-Math.log(Math.random()));
     * // creates exponential distribution
     * @example
     * stat.add( 1,2,3,4,5,6 );
     * // a d6
     */
    add ( ...data ) {
        this._cache = {};
        data.forEach( x => {
            const bin = this.round(x);
            if ( !this.storage[bin] )
                this.storage[bin] = [0, bin];
            this.storage[bin][0]++;
            this._count++; // round() may throw, so increase counter one by one
        });
        return this;
    }

    /**
     * @desc Add values to sample, with weights.
     * @param {pair[]} pairs Each pair is an array of two numbers:
     * [ value, quantity ]
     * @returns {Univariate} this (chainable)
     * @example
     * stat.addWeighted( [ [0.1, 5], [0.2, 4], [0.3, 3] ] )
     * // adds 0.1 x 5, 0.2 x 4, 0.3 x 3
     */
    addWeighted ( data ) {
        this._cache = {};
        // TODO validate
        data.forEach( entry => {
            const x = entry[0];
            const n = Number.parseFloat( entry[1] ); // fractional weights possible
            if (Number.isNaN(n))
                throw new Error('Attempt to provide a non-numeric weight');

            const bin = this.round( x );
            if ( !this.storage[bin] )
                this.storage[bin] = [0, bin];
            this.storage[bin][0] += n;
            this._count += n;
        });
        return this;
    }

    /**
     *  @desc Serialization of the sample.
     *  @returns {Object} plain data structure that can serve
     *      as an argument to new().
     */
    toJSON () {
        return {
            precision: this.getPrecision(),
            base:      this.getBase(),
            bins:      this.getBins(),
        }
    }

    /**
     *   @desc create a copy of sample object, possibly modifying precision
     *   settings and/or filtering data.
     *   @param {Object} [args]
     *   @param {Number} [args.precision] Override absolute precision
     *   @param {Number} [args.base] Override relative precision
     *   @param {Number} [args.min] Filter values less than this
     *   @param {Number} [args.max] Filter values greater than this
     *   @param {Number} [args.ltrim] Filter values less than Xth percentile
     *   @param {Number} [args.rtrim] Filter values greater than 100-Xth percentile
     *   @param {Function} [args.transform] Apply function to sample data
     *   @returns {Univariate} copy of the original object
     */
    clone (args = {}) {
        // TODO better name?
        let bins = this.getBins(args);
        if (args.transform)
            bins = bins.map( x => [args.transform(x[0]), x[1]] );

        return new Univariate( {
            precision: args.precision ?? this.getPrecision(),
            base:      args.base      ?? this.getBase(),
            bins,
        } );
    }

    /**
     *  @desc  Returns a sorted list of pairs containing numbers in the sample
     *          and their respective counts.
     *          See addWeighted().
     */
    getBins (args) {
        if (!this._cache.data) {
            this._cache.data = Object.values( this.storage )
                .map( bin => [bin[1], bin[0]] )
                .sort( (x, y) => x[0] - y[0] );
        }
        if (!args)
            return this._cache.data;

        const min = Math.max(
            args.min ?? -Infinity,
            this.percentile( args.ltrim ?? 0 ),
        );
        const max = Math.min(
            args.max ?? +Infinity,
            this.percentile( 100 - (args.rtrim ?? 0) ),
        );
        // TODO allow to skip buckets with too little data - param name???
        return this._cache.data.filter( x => x[0] >= min && x[0] <= max );
    }

    /**
     *   @desc     Number of values in the sample.
     *   @returns   {Integer} count
     */
    count () {
        return this._count;
    }

    /**
     *   @desc Minimal value in the sample.
     *          This value is somewhat rounded down to guarantee
     *          it is less than _any_ value in the sample.
     *   @returns {Number} Minimum value
     */
    min () {
        const data = this.getBins();
        return this.lower(data[0][0]);
    }

    /**
     *   @desc Maximal value in the sample.
     *          This value is somewhat rounded up to guarantee
     *          it is greater than _any_ value in the sample.
     *   @returns {Number} Maximum value
     */
    max () {
        const data = this.getBins();
        return this.upper(data[data.length - 1][0]);
    }

    /**
     *   @desc Sum of arbitrary function over the sample.
     *   @param {Function} fun Number->Number
     *   @returns {Number}
     *   @example
     *   stat.sumOf( x => 1 ); // same as stat.count()
     *   @example
     *   stat.sumOf( x => x ); // same as stat.count() * stat.mean()
     */
    sumOf (fun) {
        let s = 0;
        Object.values(this.storage).forEach( bin => { s += bin[0] * fun(bin[1]) } );
        return s;
    }
    // TODO integralOf that takes bucket width into account

    /**
     *  @desc Calculate expected value of a given function over the sample.
     *  @param {Function} fun Number->Number
     *  @returns {Number}
     */
    E (fun) {
        return this._count ? this.sumOf( fun ) / this._count : undefined;
    }

    /**
     * @desc Average value of the sample.
     * @returns {Number}
     */
    mean () {
        return this._count ? this.sumOf( x => x ) / this._count : undefined;
    }

    /**
     * @desc Standard deviation of the sample.
     * Bessel's correction is used:
     * stdev = sqrt( E<(x - E<x>)**2> * n/(n-1) )
     * @returns {Number} Standard deviation
     */
    stdev () {
        // TODO better corrections?
        if (this._count < 2)
            return undefined;
        const mean = this.mean();
        return Math.sqrt( this.sumOf( x => (x - mean) * (x - mean) )
            / (this._count - 1) ); // Bessel's correction
    }

    /**
     *  @desc Skewness is a measure of the asymmetry of a distribution.
     *  Equals to 3rd standardized moment times n^2/(n-1)(n-2) correction
     *  Undeifned if there are less than 3 data points.
     *  @returns {Number}
     */
    skewness () {
        const n = this.count();
        if (n < 3)
            return;
        const correction = n * n / ((n - 1) * (n - 2));
        return correction * this.momentStd(3);
    }

    /**
     *  @desc Kurtosis is a measure of how much of the distribution is
     *        contained in the "tails".
     *        Equals to 4th standardized moment minus 3,
     *        with a correction.
     *  @returns {Number}
     */
    kurtosis () {
        const n = this.count();
        if (n < 4)
            return;

        // taken from https://en.wikipedia.org/wiki/Kurtosis
        // not sure where it comes from
        // but if Excel is doing that, so do we.
        const corr1 = n * n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
        const corr2 = (n - 1) * (n - 1) / ((n - 2) * (n - 3));

        return this.momentStd(4) * corr1 - 3 * corr2;
    }

    /**
     *  @desc Moment of nth power, i.e. E((x-offset)**power)
     *  @param {Integer} power Power to raise to.
     *  @param {Number} [offset] Number to subtract. Default is mean.
     *  @returns {Number}
     */
    moment (power, offset) {
        if (!Number.isInteger(power))
            throw new Error('Cannot calculate non-integer moment (did you mean momentAbs?)');
        if (offset === undefined)
            offset = this.mean();
        return this.E( x => (x - offset) ** power );
    }

    /**
     *  @desc Absolute moment of nth power, i.e. E(|x-offset|**power)
     *  @param {Number} power Power to raise to. May be fractional. Default is 1.
     *  @param {Number} [offset] Number to subtract. Default is mean.
     *  @returns {Number}
     */
    momentAbs (power = 1, offset) {
        if (offset === undefined)
            offset = this.mean();
        return this.E( x => Math.abs(x - offset) ** power );
    }

    /**
     *  @desc Standardized moment of nth power, i.e. nth moment / stdev**n.
     *  @param {Integer} power
     *  @returns {Number}
     */
    momentStd (power) {
        return this.moment(power) / this.stdev() ** power;
    }

    /**
     *  @desc A number x such that P(value <= x) === p
     *  @param {Number} p from 0 to 1
     *  @return {Number} value
     *  @example
     *  const stat = new Univariate();
     *  stat.add( 1,2,3,4,5 );
     *  stat.quantile( 0.2 ); // slightly greater than 1
     *  stat.quantile( 0.5 ); // 3
     */
    quantile (p) {
        const target = p * this._count;

        const cumulative = this._cumulative();

        let l = 0;
        let r = cumulative.length;

        // console.log('target=' + target);

        while ( l + 1 < r ) {
            const m = Math.floor( (r + l) / 2 );
            // console.log( '['+l+', '+r+'): middle='+m+':', cumulative[m]);

            if (cumulative[m][1] >= target)
                r = m;
            else
                l = m;
        }

        const start = this.lower(cumulative[l][0]);
        const width = this.upper(cumulative[l][0]) - start;

        // Division by zero must not happen as zero-count buckets
        // should not exist.
        return start + width * (target - cumulative[l][1]) / (cumulative[l][2] - cumulative[l][1]);
    }

    /**
     *  @desc Returns x such that P(value < x) === p%.
     *        Same as quantile(p/100).
     *  @param {Number} p
     *  @returns {Number} x
     */
    percentile (p) {
        return this.quantile( p / 100 );
    }

    /**
     *  @desc Returns x such that half of the sample is less than x.
     *        Same as quantile(0.5).
     *  @returns {Number} x
     */
    median () {
        return this.quantile(0.5);
    }

    /**
     *  @desc Cumulative distribution function, i.e. P(value < x).
     *  This is the inverse of quantile.
     *  @param {Number} x
     *  @returns {Number} probability
     */
    cdf (x) {
        return this._rawCdf(x) / this._count;
    }

    _rawCdf (x) {
        // do nothing if possible
        if (!this._count || x <= this.min())
            return 0;
        if ( x >= this.max())
            return this._count;

        const cumulative = this._cumulative();
        const lookup = this.round(x);

        // binary search
        // Look for the rightmost bucket <= round(x)
        let l = 0;
        let r = cumulative.length;

        // console.log( 'target='+x );
        while (l + 1 < r) {
            const m = Math.floor((r + l) / 2);
            // console.log('['+l+', '+r+'): mid='+m+'; bin=', cumulative[m]);
            if (cumulative[m][0] <= lookup)
                l = m;
            else
                r = m;
        }

        // console.log('Looked for '+x+', found: ', [cumulative[l - 1], cumulative[l]] );

        // we fell between buckets - ok great
        if (lookup > cumulative[l][0])
            return cumulative[l][2];

        // Sum of buckets prior to the one x is in
        // plus the _part_ of bucket left of x
        // divided by total count
        return (
            cumulative[l][1]
                + (cumulative[l][2] - cumulative[l][1]) // x'th bucket total
                    * (x - this.lower(x))               // part left of x
                    / (this.upper(x) - this.lower(x))   // bucket width
        );
    }

    /**
     *   @desc Histogram based on the sample
     *   @param {Object} args
     *   @param {Integer} [args.count] Number of bars in the histogram.
     *                                 Default is 10.
     *   @param {Number}  [args.scale] If given, make sure it's
     *   the height of the highest bar.
     *   @return {Array}  Array of triplets: [barHeight, leftBorder, rightBorder ].
     *   rightBorder equals to the next bar's leftBorder.
     */
    histogram (args = {}) {
        // TODO options
        if (!this._count)
            return [];
        const min = this.min();
        const max = this.max();
        const count = args.count || 10;

        const hist = []; // [ count, lower, upper ], ...
        let edge = min;
        const step = (max - min) / count;
        for (let i = 0; i < count; i++)
            hist.push( [this._rawCdf(edge + step), edge, edge += step] );

        // Differenciate (must go backward!)
        for (let i = hist.length; i-- > 1; )
            hist[i][0] -= hist[i - 1][0];

        hist[0][0] -= this._rawCdf(min);

        if (args.scale) {
            // scale to a factor e.g. for drawing pictures
            let max = 0;
            for (let i = 0; i < hist.length; i++) {
                if (max < hist[i][0])
                    max = hist[i][0];
            }

            for (let i = 0; i < hist.length; i++)
                hist[i][0] = hist[i][0] * args.scale / max;
        }

        return hist;
    }

    _cumulative () {
        // integral of sorted bins
        // [ [ bin_center, sum_before, sum_after ], ... ]
        if (!this._cache.cumulative) {
            const data = this.getBins();
            const cumulative = [];
            let sum = 0;
            for (let i = 0; i < data.length; i++)
                cumulative.push( [data[i][0], sum, sum += data[i][1]] );

            this._cache.cumulative = cumulative;
        }
        return this._cache.cumulative;
    }
}

[
    'cdf+',
    'max',
    'mean',
    'min',
    'moment+',
    'momentAbs+',
    'quantile+',
    'stdev',
].forEach( method => {
    const hasArg = !!method.match(/\+/);
    if (hasArg)
        method = method.replace( '+', '' );
    const orig = Univariate.prototype[method];
    Univariate.prototype[method] = hasArg
        ? function (...arg) {
            if (this._count === 0)
                return undefined;
            if (this._cache[method] === undefined)
                this._cache[method] = {};
            const key = arg.join(':');
            if (this._cache[method][key] === undefined)
                this._cache[method][key] = orig.apply( this, arg );
            return this._cache[method][key];
        }
        : function () {
            if (this._count === 0)
                return undefined;
            if (this._cache[method] === undefined)
                this._cache[method] = orig.apply( this );
            return this._cache[method];
        };
});

class Neat {
    constructor (main) {
        this._main = main;
    }

    min () {
        if (!this._main._count)
            return undefined;
        const data = this._main.getBins();
        return this._main.shorten(data[0][0]);
    }

    max () {
        if (!this._main._count)
            return undefined;
        const data = this._main.getBins();
        return this._main.shorten(data[data.length - 1][0]);
    }
}

[
    'E',
    'kurtosis',
    'mean',
    'median',
    'moment',
    'momentAbs',
    'momentStd',
    'percentile',
    'quantile',
    'skewness',
    'stdev',
    'sumOf',
].forEach( fun => {
    Neat.prototype[fun] = function (arg) {
        return this._main.shorten( this._main[fun](arg) );
    }
});

[
    'cdf',
    'count',
].forEach( fun => {
    Neat.prototype[fun] = function (arg) {
        return this._main[fun](arg);
    }
});

module.exports = { Univariate };
