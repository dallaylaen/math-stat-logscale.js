'use strict';

(() => {
    const { Binning } = require('./lib/binning.js');
    const { Univariate } = require('./lib/univariate.js');

    // TODO better name
    // Must be short & reflect (math, statistics, logarithm)
    const logstat = { Binning, Univariate };

    if (typeof window !== 'undefined')
        window.logstat = logstat;
    else
        module.exports = logstat;
})();
