'use strict';

const { expect } = require( 'chai' );
const { Univariate } = require( '../lib/univariate.js' );

describe( 'Univariate.clone', () => {
    const uni = new Univariate({precision: 1});
    uni.add( 1,2,3,4,5 );
    it ('provides cloned data', done => {
        const copy = uni.clone();
        expect( copy.toJSON() ).to.deep.equal( uni.toJSON() );
        done();
    });

    it ('handles limits', done => {
        const copy = uni.clone({min: 2, max:4.5});
        expect( copy.getBins() ).to.deep.equal( [[2,1], [3,1], [4,1]] );
        done();
    });

    it( 'handles trim', done => {
        const copy = uni.clone({ltrim: 25, rtrim:25});
        expect( copy.getBins() ).to.deep.equal( [[2,1], [3,1], [4,1]] );
        done();
    });
});
