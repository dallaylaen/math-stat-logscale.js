'use strict';

const { expect } = require( 'chai' );
const { Univariate } = require( '../index.js' );

describe( 'Univariate.toJSON', () => {
    it( 'round-trips', done => {
        const orig = new Univariate();
        orig.add( 1,2,3,4,5 );
        const copy = new Univariate( orig.toJSON() );

        expect( copy.toJSON() ).to.deep.equal( orig.toJSON() );

        expect( copy.count() ).to.equal( 5 );
        expect( copy.min() ).to.be.within( 0.99,1.01 );
        expect( copy.max() ).to.be.within( 4.99,5.01 );

        done();
    });

    it( 'makes it through string', done => {
        const input = [
            {},
            { base: 1.1, precision: 1 },
            { base: 1.01, precision: 0.001 },
            { base: 1.01 },
            { precision: 1 },
            { precision: 3.141592653 },
        ];
        input.forEach( x => {
            const orig = new Univariate(x);
            const str  = JSON.stringify(orig);
            const hash = JSON.parse( str );
            const copy = new Univariate( hash );
            expect( copy.toJSON() ).to.deep.equal( orig.toJSON() );
        });

        done();
    });

    it('supports versioning', done => {
        const stat = new Univariate();
        const raw = stat.toJSON();

        const meta = require('../package.json');
        const minmaj = meta.version.match(/^\d+\.\d+/)[0];
        expect(typeof minmaj).to.equal('string');

        const prefix = '^stats-logscale\/univariate@';
        expect(raw.version).to.match(new RegExp(prefix + minmaj.replace(/\./g, '\\.')));

        done();
    })
});
