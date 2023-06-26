'use strict';

/**
 *  Usage: node get-request.js <url> <count>
 *  This will print distribution of request times (in ms) as JSON.
 */

const axios = require('axios');
const { Univariate } = require( 'stats-logscale' );

const url = process.argv[2];
let times = Number.parseInt(process.argv[3]) || 5;

const stat = new Univariate();

req( stat, url, times, stat => {
    console.log( JSON.stringify(stat));
});

function req(stat, url, times, done) {
    if (!times)
        return done(stat);
    const t0 = new Date();
    axios.get(url).then( res => {
        if (res.status !== 200)
            throw new Error( 'Cannot fetch url '+url );
        stat.add( new Date() - t0 );
        req( stat, url, times - 1, done );
    });
}


