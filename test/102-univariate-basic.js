'use strict';

const { expect } = require ('chai');

const { Univariate } = require ( '../lib/univariate.js' );

const d6 = [...Array(6).keys()].map( x => x+1 );
const dice = d6.map( x => d6.map( y => x+y ) ).flat();

// console.log(dice);

describe ( 'Univariate accessors', () => {
    const empty = new Univariate();
    const one = new Univariate();
    one.add(1);
    const two = new Univariate();
    two.add(-1,1);
    const many = new Univariate();
    many.add(...dice);

    it( 'min', done => {
        expect( empty.min() ).to.equal(undefined);
        expect( one.min() ).to.equal( one.round(1) );
        expect( two.min() ).to.equal( two.round(-1) );
        expect( many.min() ).to.equal( many.round(2) );
        done();
    });
    it( 'max', done => {
        expect( empty.max() ).to.equal(undefined);
        expect( one.max() ).to.equal( one.round(1) );
        expect( two.max() ).to.equal( two.round(1) );
        expect( many.max() ).to.equal( many.round(12) );
        done();
    });
    it( 'count', done => {
        expect( empty.count() ).to.equal(0);
        expect( one.count() ).to.equal( 1 );
        expect( two.count() ).to.equal( 2 );
        expect( many.count() ).to.equal( 36 );
        done();
    });
    it( 'mean', done => {
        expect( empty.mean() ).to.equal(undefined);
        expect( one.mean() ).to.equal( one.round(1) );
        expect( two.mean() ).to.equal( 0 );
        expect( many.mean() ).to.be.within( 6.99, 7.01 );
        done();
    });
});

describe ( 'Univariate', () => {
    it ('can calculate mean', done => {
        const uni = new Univariate();
        uni.add( 1, 2, 3 );
        expect( uni.count() ).to.equal( 3 );
        expect( uni.mean() ).to.be.within( 1.99, 2.01 );
        done();
    });

    it ('can round-trip data', done => {
        const uni = new Univariate();
        uni.add( ...dice );

        const weighted = uni.data();

        expect( weighted.map( x => x[1] ) ).to.deep.equal(
            [ 1,2,3,4,5,6,5,4,3,2,1 ] );

        // console.log( weighted );

        const uni2 = new Univariate();
        uni2.addWeighted( weighted );
        expect( uni2.data() ).to.deep.equal( weighted );

        done();
    });

    it( 'can find expected values', done => {
        const uni = new Univariate();
        uni.add( ...dice );
        expect( uni.expected( x => x - 7 ) ).to.be.within( -0.1, 0.1 );

        done();
    });

    it( 'handles overwriting existing data', done => {
        const uni = new Univariate();
        uni.add( 1,2,3 );
        uni.add( 2,3,4 );
        uni.add( 3,4,5 );

        // TODO validate
        // console.log( uni.data() );

        done();
    });

    it( 'does not overuse memory', done => {
        const uni = new Univariate();
        for (let i = 0; i < 10000; i++) {
            uni.add( Math.exp(i/10000) );
        };
        expect( uni.data().length ).to.be.within( 1000, 1010 );
        done();
    });

    it( 'does not overuse memory (1.01)', done => {
        const uni = new Univariate({base:1.01});
        for (let i = 0; i < 10000; i++) {
            uni.add( Math.exp(i/10000) );
        };
        expect( uni.data().length ).to.be.within( 100, 105 );
        done();
    });
});
