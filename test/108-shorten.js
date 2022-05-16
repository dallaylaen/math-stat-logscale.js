'use strict';

const { expect } = require( 'chai' );
const { Binning, shorten } = require( '../lib/binning.js' );

describe( 'shorten', () => {
    const sample = [
        [3.141, 3.152],
        [1.1, 1.2],
        [1.08, 1.11],
        [1.99999, 2.00001],
        [0.5, 100.5],
        [1.17, 1.2],
        [1.08E-14, 1.11E-14],
        [0, 0.1],
        [-1, 1],
        [-2.001, -1.99],
        [-1.11, -1.08],
    ];

    const bin = new Binning();

    for( let pair of sample ) {
        const x = bin.shorten(pair[0], pair[1]);
        it ('shortest number in ('+pair[0]+', '+pair[1]+') = '+x, done => {
            expect( x ).to.be.within( ...pair );
            expect( len(x) ).to.be.within( 1, len(pair[0]) );
            expect( len(x) ).to.be.within( 1, len(pair[1]) );

            done();
        });
    };

    const cases = [
        [ 1.08, 1.11, 1.1 ],
        [ 1.9999, 2.0001, 2 ],
        [ -0.1, 1.1, 0 ],
        [ -1.11, -1.08, -1.1 ],
        [ 11998, 12041, 12000 ],
    ];
    for( let pair of cases ) {
        const x = shorten(pair[0], pair[1]);
        it ('shortest number in ('+pair[0]+', '+pair[1]+') = '+x, done => {
            expect( x ).to.equal( pair[2] );
            done();
        });
    };

});

describe( 'Binning.shorten', () => {
    const bin = new Binning( {base:1.1, precision: 0.01 } );

    const cases = [
        0.013855, 1.15, 100.18, 1, 2, 10,
    ];

    for (let x of cases) {
        const s = bin.shorten(x);
        it( 'shortens '+x+' as '+s, done => {
            expect( s ).to.be.within( bin.lower(x), bin.upper(x) );
            expect( bin.round(s) ).to.equal( bin.round( x ));
            expect( len(s) ).to.be.within( 1, len(x) );

            done();
        });
    };
});

function len(x) {
    return (''+x).length;
};
