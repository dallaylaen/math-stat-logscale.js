'use strict';

const { expect } = require ('chai');

const { Univariate } = require ( '../lib/univariate.js' );

describe ( 'Univariate', () => {
    it ('can calculate mean', done => {
        const uni = new Univariate();
        uni.add( 1, 2, 3 );
        expect( uni.count() ).to.equal( 3 );
        expect( uni.mean() ).to.be.within( 1.99, 2.01 );
        done();
    });
});
