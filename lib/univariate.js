'use strict';

const { Binning } = require( './binning.js' );

class Univariate extends Binning {
    constructor (args = {}) {
        super(args);
        this.storage = {}; // str(bin) => [ count, num(bin) ]
        this._count = 0;
        this._cache = {};

        // TODO import data if given
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

    data () {
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
        if (!this._count)
            return undefined;
        const data = this.data();
        return this.lower(data[0][0]);
    }

    max () {
        if (!this._count)
            return undefined;
        const data = this.data();
        return this.upper(data[data.length - 1][0]);
    }

    integrate (fun) {
        let s = 0;
        Object.values(this.storage).forEach( bin => { s += bin[0] * fun(bin[1]) } );
        return s;
    }

    expected (fun) {
        return this._count ? this.integrate( fun ) / this._count : undefined;
    }

    mean () {
        return this._count ? this.integrate( x => x ) / this._count : undefined;
    }

    quantile (p) {
        const target = p * this._count;

        const cdf = this._cdf();

        let l = 0;
        let r = cdf.length - 1;

        // console.log('target=' + target);

        while ( l + 1 < r ) {
            const m = Math.floor( (r + l) / 2 );
            // console.log( '['+l+', '+r+'): middle='+m+':', cdf[m]);

            if (cdf[m][1] >= target)
                r = m;
            else
                l = m;
        }

        return cdf[l + 1][0];
    }

    cdf (x) {
        x = this.round(x);
        const cdf = this._cdf();
        if (x < cdf[0][0])
            return 0;

        let l = 0;
        let r = cdf.length;

        // console.log( 'terget='+x );
        while (l + 1 < r) {
            const m = Math.floor((r + l) / 2);
            // console.log('['+l+', '+r+'): mid='+m+'; bin=', cdf[m]);
            if (cdf[m][0] <= x)
                l = m;
            else
                r = m;
        }
        if (x < cdf[l][0])
            return cdf[l - 1][1] / this._count;
        if (x > cdf[l][0])
            return cdf[l][1] / this._count;
        return (cdf[l - 1][1] + cdf[l][1]) / (this._count * 2);
    }

    _cdf () {
        if (!this._cache.cdf) {
            const cdf = [[-Infinity, 0]];
            let sum = 0;
            this.data().forEach( bin => {
                sum += bin[1];
                cdf.push( [bin[0], sum] );
            });
            this._cache.cdf = cdf;
        }
        return this._cache.cdf;
    }
}

module.exports = { Univariate };
