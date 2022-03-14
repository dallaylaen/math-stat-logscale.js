'use strict';

const { expect } = require( 'chai' );

const { Univariate } = require( '../lib/univariate.js' );

describe( 'Univariate.cdf', () => {
    it ('works for split bucket', done => {
        const uni = new Univariate({precision:1});
        uni.add(0);

        const input = [-0.5, -0.25, 0, 0.25, 0.5 ];

        const probs = input.map( x => uni.cdf( x ) );

        // console.log(probs);

        for (let i = 0; i < input.length; i++)
            expect( probs[i] - input[i] - 0.5 ).to.be.within(-0.01, 0.01);

        done();
    });

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
        uni.add(2,4,6);

        const input = [1,2,3,4,5,6,7];
        input.forEach( x => {
            expect( uni.cdf(uni.round(x)) - (x-1)/6 )
            .to.be.within( -0.01, 0.01 );
        });

        done();
    });

    it ('works for many buckets', done => {
        const uni = new Univariate();
        for (let i = 1; i<=19; i++)
            uni.add(i);

        expect( uni.cdf(0) ).to.equal( 0 );
        expect( uni.cdf(uni.round(10)) ).to.be.within( 0.499, 0.501 );
        expect( uni.cdf(20) ).to.equal( 1 );

        done();
    });

});

