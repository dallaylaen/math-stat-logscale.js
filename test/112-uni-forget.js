const { expect } = require( 'chai' );
const { Univariate } = require( '../index');

describe( 'Univariate.addWeighted', () => {
    it('can forget data', done => {
        const dist = new Univariate({precision: 1});
        dist.add(1, 2, 3, 4, 5);
        dist.addWeighted([[3, -2]]);
        expect( dist.getBins() ).to.deep.equal( [[1, 1], [2, 1], [4, 1], [5, 1]]);
        expect( dist.count() ).to.equal(4);
        done();
    });

    it ('handles wrong inputs', done => {
        const dist = new Univariate({precision: 1});
        expect( _ => dist.addWeighted([[1, 'oof']])).to.throw(/non-numeric/);
        done();
    });
})
