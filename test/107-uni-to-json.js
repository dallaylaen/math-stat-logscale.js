'use strict';

const { expect } = require( 'chai' );
const { Univariate } = require( '../index.js' );

describe( 'Univariate.toJSON', () => {
    it( 'rond-trips', done => {
        const orig = new Univariate();
        orig.add( 1,2,3,4,5 );
        const copy = new Univariate( orig.toJSON() );

        expect( copy.toJSON() ).to.deep.equal( orig.toJSON() );

        expect( copy.count() ).to.equal( 5 );
        expect( copy.min() ).to.be.within( 0.99,1.01 );
        expect( copy.max() ).to.be.within( 4.99,5.01 );

        done();
    });
});
