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
        const plain = uni.median();
        const neat  = uni.neat.median();
        expect( neat ).to.be.within( uni.lower(plain), uni.upper(plain) );
        expect( neat ).to.equal(3);
        done();
    });

    it( 'handles percentile', done => {
        const plain = uni.percentile(60);
        const neat  = uni.neat.percentile(60);
        expect( neat ).to.be.within( uni.lower(plain), uni.upper(plain) );
        expect( neat ).to.equal( uni.neat.quantile(0.6) );
        done();
    });
});
