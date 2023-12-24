const {expect} = require( 'chai' );

const { Univariate } = require ( '../index' );

describe( 'Univariate', () => {
    it ('forbids unreasonable params', done => {
        expect( () => new Univariate({base: 1})).to.throw(/base must be a number/);
        expect( () => new Univariate({base: 2})).to.throw(/base must be a number/);
        expect( () => new Univariate({precision: -1}))
            .to.throw(/precision must be a positive number/);
        done();
    });

    it ('forbids adding garbage', done => {
        const uni = new Univariate();

        expect( () => uni.add( 'not number') )
            .to.throw(/non-numeric value|must be a number/);
        expect( () => uni.addWeighted( [['not number', 1]]))
            .to.throw(/non-numeric value|must be a number/);
        expect( () => uni.addWeighted( [[1, 'not number']]))
            .to.throw(/non-numeric weig|must be a number/);
        expect( () => uni.addWeighted( [3, 4]))
            .to.throw(/non-numeric weig|must be a number/);
        done();
    });
})
