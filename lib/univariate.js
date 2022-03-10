'use strict';

const { Binning } = require( './binning.js' );

class Univariate extends Binning {
    constructor(args={}) {
        super(args);
        this.storage = {}; // str(bin) => [ count, num(bin) ]
        this._count = 0;

        // TODO import data if given
    }

    add( ...data ) {
        data.forEach( x => {
            const bin = this.round(x);
            if( !this.storage[bin] )
                this.storage[bin] = [ 0, bin ];
            this.storage[bin][0]++;
        });
        this._count += data.length;
        return this;
    }

    count() {
        return this._count;
    }

    integrate(fun) {
        let s = 0;
        Object.values(this.storage).forEach( bin => { s += bin[0]*fun(bin[1]) } );
        return s;
    }

    mean() {
        return this._count ? this.integrate( x => x ) / this._count : undefined;
    }
}

module.exports = { Univariate };
