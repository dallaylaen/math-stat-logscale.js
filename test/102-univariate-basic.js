'use strict';

const { expect } = require ('chai');

const { Univariate } = require ( '../lib/univariate.js' );

const d6 = [...Array(6).keys()].map( x => x+1 );
const dice = d6.map( x => d6.map( y => x+y ) ).flat();

// console.log(dice);

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
