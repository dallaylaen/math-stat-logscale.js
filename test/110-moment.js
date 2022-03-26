'use strict';

const { expect } = require( 'chai' );
const { Univariate } = require( '../index.js' );

describe( 'Univariate.moment', () => {
    const exact = new Univariate();
    exact.add( -2, -1, 0, 1, 2 );

    it( 'calculates moments', done => {
        expect( exact.moment(1) ).to.equal( 0 );
        expect( exact.neat.moment(1) ).to.equal( 0 );
        expect( exact.moment(3) ).to.equal( 0 );
        expect( exact.neat.moment(3) ).to.equal( 0 );

        done();
    });

    it( 'calculates moments with offset', done => {
        expect( exact.moment(1, -2) ).to.be.within( 1.99, 2.01 );
        expect( exact.moment(2, -2) ).to.be.within( 5.99, 6.01 );

        done();
    });

});

describe( 'Univariate.momentAbs', () => {
    const exact = new Univariate();
    exact.add( -2, -1, 0, 1, 2 );

    it( 'calculates moments', done => {
        expect( exact.momentAbs(2) ).to.be.within( 1.99, 2.01 );
        expect( exact.momentAbs(1) ).to.be.within( 1.19, 1.21 );

        expect( exact.momentAbs(2) ).to.equal( exact.moment( 2 ) );

        done();
    });

    it( 'calculates moments with offset', done => {
        expect( exact.momentAbs(1, -2) ).to.be.within( 1.99, 2.01 );
        expect( exact.momentAbs(2, -2) ).to.be.within( 5.99, 6.01 );

        done();
    });
});

