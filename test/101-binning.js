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
});
