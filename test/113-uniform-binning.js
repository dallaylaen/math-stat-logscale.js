
const { expect } = require( 'chai' );

const { Univariate } = require ( '../index' );

describe( 'Univariate{ uniform: true }', () => {
    it( 'produces distribution without log', done => {
        const uni = new Univariate({precision: 1, flat: true});
        uni.add( 10000, 10001, 10002, 10003, 10004, 10005);
        expect( uni.getBins() ).to.deep.equal(
            [[10000, 1], [10001, 1], [10002, 1], [10003, 1], [10004, 1], [10005, 1], ] );

        expect( uni.min() ).to.equal( 9999.5 );
        expect( uni.max() ).to.equal( 10005.5 );

        done();
    });

} );
