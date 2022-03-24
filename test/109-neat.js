'use strict';

const { expect } = require( 'chai' );
const { Univariate } = require( '../index.js' );

describe ( 'Univariate.neat', () => {
    const uni = new Univariate();
    uni.add(1,2,3,4,5);

    it( 'proxies count', done => {
        expect( uni.neat.count() ).to.equal( uni.count() );
        done();
    });

    it( 'shortens min', done => {
        expect( uni.lower(uni.neat.min()) ).to.equal( uni.min() );
        done();
    });

    it( 'shortens max', done => {
        expect( uni.upper(uni.neat.max()) ).to.equal( uni.max() );
        done();
    });

    it( 'handles mean', done => {
        const plain = uni.mean();
        const neat  = uni.neat.mean();
        expect( neat ).to.be.within( uni.lower(plain), uni.upper(plain) );
        done();
    });

    it( 'handles median', done => {
        const plain = uni.quantile(0.5);
        const neat  = uni.neat.quantile(0.5);
        expect( neat ).to.be.within( uni.lower(plain), uni.upper(plain) );
        done();
    });
});
