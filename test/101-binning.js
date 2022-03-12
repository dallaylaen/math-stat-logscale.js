'use strict';
const { expect } = require( 'chai' );

const { Binning } = require( '../lib/binning.js' );

describe( 'Binning', () => {
    it ( 'rounds stuff correctly', done => {
        const bin = new Binning();

        expect( bin.round(0) ).to.equal(0);
        expect( bin.round(-7) ).to.equal( -bin.round(7) );

        done();
    });

    it ( 'preserves order', done => {
        const bin = new Binning();
        const input = [ 0.01, 0.02, 1, 1.1, 1.2, 2, 1000, 1001, 1002, 1004 ];
        const output = input.map( x => bin.round(x) );

        output.reduce( (a,b) => {
            expect( a <= b ).to.equal( true );
            return a;
        });

        done();
    });

    it ( 'flattens data', done => {
        const bin = new Binning();
        expect( bin.round( 1.0001 ) ).to.equal( bin.round(1) );
        done();
    });

    it ( 'has reasonable bucket size', done => {
        const bin = new Binning({precision: 0.1, base: 1.1});
        expect( bin.precision ).to.be.within( 0.09, 0.1 );
        expect( bin.base ).to.be.within( 1.09, 1.1 );

        for (let i = 0; i < 1000; i++) {
            const x = i / 10;
            expect( bin.round(x)).to.be
                .within( Math.min( x*0.95, x-0.05 ), Math.max(x*1.05, x+0.05) );
        };

        done();
    });
});
