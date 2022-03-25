'use strict';

const { Binning } = require( './binning.js' );

class Univariate extends Binning {
    constructor (args = {}) {
        super(args);
        this.storage = {}; // str(bin) => [ count, num(bin) ]
        this._count = 0;
        this._cache = {};
        this.neat = new Neat(this);

        if (args.bins)
            this.addWeighted(args.bins);
    }

    add ( ...data ) {
        this._cache = {};
        data.forEach( x => {
            const bin = this.round(x);
            if ( !this.storage[bin] )
                this.storage[bin] = [0, bin];
            this.storage[bin][0]++;
        });
        this._count += data.length;
        return this;
    }

    addWeighted ( data ) {
        this._cache = {};
        // TODO validate
        data.forEach( entry => {
            const bin = this.round( entry[0] );
            if ( !this.storage[bin] )
                this.storage[bin] = [0, bin];
            this.storage[bin][0] += entry[1];
            this._count += entry[1];
        });
        return this;
    }

    toJSON () {
        return {
            precision: this.getPrecision(),
            base:      this.getBase(),
            bins:      this.getBins(),
        }
    }

    getBins () {
        if (!this._cache.data) {
            this._cache.data = Object.values( this.storage )
                .map( bin => [bin[1], bin[0]] )
                .sort( (x, y) => x[0] - y[0] );
        }
        return this._cache.data;
    }

    count () {
        return this._count;
    }

    min () {
        const data = this.getBins();
        return this.lower(data[0][0]);
    }

    max () {
        const data = this.getBins();
        return this.upper(data[data.length - 1][0]);
    }

    integrate (fun) {
        let s = 0;
        Object.values(this.storage).forEach( bin => { s += bin[0] * fun(bin[1]) } );
        return s;
    }

    E (fun) {
        return this._count ? this.integrate( fun ) / this._count : undefined;
    }

    mean () {
        return this._count ? this.integrate( x => x ) / this._count : undefined;
    }

    stdev () {
        // TODO better corrections?
        if (this._count < 2)
            return undefined;
        const mean = this.mean();
        return Math.sqrt( this.integrate( x => (x - mean) * (x - mean) )
            / (this._count - 1) ); // Bessel's correction
    }

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

    cdf (x) {
        return this.rawCdf(x) / this._count;
    }

    rawCdf (x) {
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
            hist.push( [this.rawCdf(edge + step), edge, edge += step] );

        // Differenciate (must go backward!)
        for (let i = hist.length; i-- > 1; )
            hist[i][0] -= hist[i - 1][0];

        hist[0][0] -= this.rawCdf(min);

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
    'E+',
    'max',
    'mean',
    'min',
    'quantile+',
    'stdev',
].forEach( method => {
    const hasArg = !!method.match(/\+/);
    if (hasArg)
        method = method.replace( '+', '' );
    const orig = Univariate.prototype[method];
    Univariate.prototype[method] = hasArg
        ? function (arg) {
            if (this._count === 0)
                return undefined;
            if (this._cache[method] === undefined)
                this._cache[method] = {};
            if (this._cache[method][arg] === undefined)
                this._cache[method][arg] = orig.apply( this, [arg] );
            return this._cache[method][arg];
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
    'mean',
    'quantile',
    'stdev',
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
