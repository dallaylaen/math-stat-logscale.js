'use strict';

const { expect } = require( 'chai' );

const { Univariate } = require( '../lib/univariate.js' );

describe( 'Univariate.quantile', () => {
    it ('works for 2 buckets', done => {
        const uni = new Univariate();
        uni.add(1,2);
        expect(uni.quantile(0.33)).to.equal(uni.round(1));
        expect(uni.quantile(0.66)).to.equal(uni.round(2));

        done();
    });
    it ('works for 3 buckets', done => {
        const uni = new Univariate();
        uni.add(1,2,3);
        expect(uni.quantile(0.33)).to.equal(uni.round(1));
        expect(uni.quantile(0.5)).to.equal(uni.round(2));
        expect(uni.quantile(0.67)).to.equal(uni.round(3));

        done();
    });

    it ('works for many buckets', done => {
        const uni = new Univariate();

        for (let i = 1; i < 20; i++ )
            uni.add(i);

        expect( uni.quantile(0) ).to.equal(uni.round(1));
        expect( uni.quantile(0.1) ).to.equal(uni.round(2));
        expect( uni.quantile(0.5) ).to.equal(uni.round(10));
        expect( uni.quantile(0.9) ).to.equal(uni.round(18));
        expect( uni.quantile(1) ).to.equal(uni.round(19));


        done();
    });
});
