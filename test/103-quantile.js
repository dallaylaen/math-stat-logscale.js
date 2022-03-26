'use strict';

const { expect } = require( 'chai' );

const { Univariate } = require( '../lib/univariate.js' );

describe( 'Univariate.quantile', () => {
    it ('works for split bucket', done => {
        const uni = new Univariate({precision:1});
        uni.add(0);

        const input = [0, 0.25, 0.5, 0.75, 1];

        input.forEach( x => {
            expect( uni.quantile(x) ).to.be.within(x-0.6, x-0.4);
        });

        done();
    });

    it ('works for 2 buckets', done => {
        const uni = new Univariate();
        uni.add(1,2);
        expect(uni.quantile(0.25)).to.be.within(0.99, 1.01);
        expect(uni.quantile(0.75)).to.be.within(1.99, 2.01);

        done();
    });
    it ('works for 3 buckets', done => {
        const uni = new Univariate();
        uni.add(1,2,3);
        expect(uni.quantile(1/6)).to.be.within(0.99, 1.01);
        expect(uni.quantile(0.5)).to.be.within(1.99, 2.01);
        expect(uni.quantile(5/6)).to.be.within(2.99, 3.01);

        done();
    });

    it ('works for many buckets', done => {
        const uni = new Univariate();
        for (let i = 1; i < 20; i++ )
            uni.add(i);

        expect( uni.quantile(0) ).to.be.within(0.99,1.01);
        expect( uni.quantile(0.1) ).to.be.within(1.99,2.01);
        expect( uni.quantile(0.5) ).to.be.within(9.99,10.01);
        expect( uni.quantile(0.9) ).to.be.within(17.95,18.05);
        expect( uni.quantile(1) ).to.be.within(18.99,19.02);

        done();
    });

    it ('works the same as percentile', done => {
        const uni = new Univariate();
        for (let i = 1; i < 20; i++ )
            uni.add(i);

        expect( uni.quantile(0) ).to.equal( uni.percentile(0) );
        expect( uni.quantile(0.1) ).to.equal( uni.percentile(10) );
        expect( uni.quantile(0.5) ).to.equal( uni.percentile(50) );
        expect( uni.quantile(0.9) ).to.equal( uni.percentile(90) );
        expect( uni.quantile(1) ).to.equal( uni.percentile(100) );

        done();
    });
});
