'use strict';

const { expect } = require( 'chai' );
const { Univariate } = require( '../index.js' );

describe( 'Univariate.moment', () => {
    const exact = new Univariate();
    exact.add( -2, -1, 0, 1, 2 );

    it( 'calculates moments', done => {
        expect( exact.moment(1) ).to.equal( 0 );
        expect( exact.neat.moment(1) ).to.equal( 0 );
        expect( exact.moment(3) ).to.equal( 0 );
        expect( exact.neat.moment(3) ).to.equal( 0 );

        done();
    });

    it( 'calculates moments with offset', done => {
        expect( exact.moment(1, -2) ).to.be.within( 1.99, 2.01 );
        expect( exact.moment(2, -2) ).to.be.within( 5.99, 6.01 );

        done();
    });

});

describe( 'Univariate.momentAbs', () => {
    const exact = new Univariate();
    exact.add( -2, -1, 0, 1, 2 );

    it( 'calculates moments', done => {
        expect( exact.momentAbs(2) ).to.be.within( 1.99, 2.01 );
        expect( exact.momentAbs(1) ).to.be.within( 1.19, 1.21 );

        expect( exact.momentAbs(2) ).to.equal( exact.moment( 2 ) );

        done();
    });

    it( 'calculates moments with offset', done => {
        expect( exact.momentAbs(1, -2) ).to.be.within( 1.99, 2.01 );
        expect( exact.momentAbs(2, -2) ).to.be.within( 5.99, 6.01 );

        done();
    });

});

describe( 'Univariate.momentStd', () => {
    const exact = new Univariate();
    exact.addWeighted( [-2, -1, 0, 1, 2].map( x => [x, 10000] ) );

    const cases = [
        [ 'flat symmetric distro', [-2,-1,0,1,2].map( x => [x, 10000] ) ],
        [ 'skewed distro', [ 1,2,3,4,5 ].map( x => [ x, x*10000 ] ) ],
    ];

    cases.forEach( item => {
        it ('works for '+item[0], done => {
            const stat = new Univariate();
            stat.addWeighted(item[1]);

            expect( stat.momentStd(1) ).to.be.within(-0.01, 0.01);
            expect( stat.momentStd(2) ).to.be.within(0.99, 1);
            expectAround( stat.skewness(), stat.momentStd(3) );
            expectAround( stat.kurtosis(), stat.momentStd(4)-3 );

            for (let n = 3; n < 10; n++) {
                const calc = stat.moment(n) / stat.stdev() ** n;
                expectAround( stat.momentStd(n), calc);
            };

            done();
        });    
    });
});

describe ('Univariate.skewness', () => {
    const direction = {
        left:     [-Infinity, 0],
        right:    [0, Infinity],
        centered: [-0.1, 0.1],
    };

    const cases = [
        ['d6', 'centered', [1,2,3,4,5,6].map( x => [x, 1] )],
        ['triangle', 'left', [1,2,3,4,5,6].map( x => [x, x] )],
        ['exp', 'right', [...Array(10000).keys()].map( 
            x => [-Math.log((x+1)/10000), 1]) ],
    ];

    cases.forEach( item => {
        it( item[0]+' distribution has '+item[1]+' tail', done => {
            const stat = new Univariate();
            stat.addWeighted( item[2] );
            expect( stat.skewness() ).to.be.within(...direction[item[1]]);

            done();
        });
    });
});

function expectAround( got, exp ) {
    const limits = exp < 0 ? [ 1.01 * exp, 0.99 * exp ] : [ 0.99 * exp, 1.01 * exp ];
    
    expect( got ).to.be.within( ...limits ); 
}
