'use strict';

const { expect } = require( 'chai' );

const { Univariate } = require( '../lib/univariate.js' );

describe( 'Univariate.histogram', () => {
    it( 'produces some reasonable stuff', done => {
        const uni = new Univariate();
        for (let i = 0; i < 1000; i++) {
            uni.add(i/100);
        };

        const hist = uni.histogram();

        expect( hist.length ).to.equal(10);

        // sum of [0]'s of the array equals count
        expect( hist.map(x=>x[0]).reduce( (a,b) => a+b ) )
            .to.be.within( uni.count()-0.1, uni.count()+0.1);

        for (let i = 1; i<hist.length; i++) {
            expect( hist[i-1][2] ).to.equal( hist[i][1] );
            expect( hist[i][0] - hist[i-1][0] ).to.be.within( -1, 1 );
        }

        done();
    });

    it( 'produces exact values', done => {
        const uni = new Univariate();
        uni.add( 1, 2, 3, 4, 5 );

        const hist = uni.histogram( {count: 5} );
        expect( hist.length ).to.equal( 5 );
        for( let i = 0; i<hist.length; i++)
            expect( hist[i][0] ).to.equal(1);

        done();
    });

    it( 'scales', done => {
        const uni = new Univariate();
        uni.add( 1, 2, 3, 4, 5 );
        
        const hist = uni.histogram( {count: 5, scale: 100} );
        expect( hist.length ).to.equal( 5 );
        for( let i = 0; i<hist.length; i++)
            expect( hist[i][0] ).to.equal(100);

        done();
        
    });
});
