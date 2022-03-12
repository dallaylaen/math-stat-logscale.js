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
        return Object.values( this.storage )
            .map( bin => [bin[1], bin[0]] )
            .sort( (x, y) => x[0] - y[0] );
    }

    count () {
        return this._count;
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
}

module.exports = { Univariate };
