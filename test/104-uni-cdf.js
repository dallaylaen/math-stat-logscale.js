'use strict';

const { expect } = require( 'chai' );

const { Univariate } = require( '../lib/univariate.js' );

describe( 'Univariate.cdf', () => {
    it ('works for 2 buckets', done => {
        const uni = new Univariate();
        uni.add(1,3);

        expect( uni.cdf(0) ).to.equal( 0 );
        expect( uni.cdf(2) ).to.equal( 0.5 );
        expect( uni.cdf(4) ).to.equal( 1 );

        done();
    });
    it ('works for 3 buckets', done => {
        const uni = new Univariate();
        uni.add(1,2,3);

        expect( uni.cdf(0) ).to.equal( 0 );
        expect( uni.cdf(1) ).to.equal( 1/6 );
        expect( uni.cdf(1.5) ).to.equal( 1/3 );
        expect( uni.cdf(2) ).to.equal( 0.5 );
        expect( uni.cdf(2.5) ).to.equal( 2/3 );
        expect( uni.cdf(3) ).to.equal( 5/6 );
        expect( uni.cdf(4) ).to.equal( 1 );

        done();
    });

    it ('works for many buckets', done => {
        const uni = new Univariate();
        for (let i = 1; i<=19; i++)
            uni.add(i);

        expect( uni.cdf(0) ).to.equal( 0 );
        expect( uni.cdf(10) ).to.equal( 0.5 );
        expect( uni.cdf(20) ).to.equal( 1 );

        done();
    });
    
});

