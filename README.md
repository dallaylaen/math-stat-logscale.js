# stats-logscale

# DESCRIPTION

A memory-efficient approximate statistical analysis tool
using logarithmic binning.

* can be used both in a browser or in a standalone app;

* allows to specify absolute & relative precision;

* can add numbers to sample one-by-one or with weights;

* can calculate mean, moments, quantiles, and probabilities;

* can calculate expected value of an arbitrary function over the sample;

* can generate histograms of the sample;

* is (de)serialiazble, multiple smaples can be combined into one.

# HOW IT WORKS

The real numbers are split into intervals, or bins (aka buckets).
All numbers in the sample are rounded towards the center
of their respective bins, and only the counts are stored.

The bin size depends on the relative and absolute precision or the sample,
hence the _logscale_ in the name.

This allows to operate on very large samples
with reasonable speed and memory usage.

# USAGE

```javascript
const { Univariate } = require( 'stats-logscale' );

const stat = new Univariate({precision: 0.001, base: 1.001});

// Adding data: one by one, ...
for (let i = 1; i<1000; i++)
    stat.add(Math.random() * Math.random());

// ... multiple values at once, ...
stat.add( 3, 14, 15, 9, 26, 53 );

// ... or as an array of pairs
stat.addWeighted( [[1.1, 10], [2.2, 5], [3.3, 3]] );

// Query data. Each value is cached once requested.
// The cache is reset upon entering new data.

stat.count();           // number of data points
stat.mean();            // average
stat.stdev();           // standard deviation
stat.median();          // half of data is lower than this value
stat.percentile(90);    // 90% of data below this point
stat.quantile(0.9);     // ditto
stat.cdf(0.5);          // Cumulative distribution function, which means
                        // the probability that a data point is less than 0.5
stat.moment(power);     // central moment of an integer power
stat.momentAbs(power);  // < |x-<x>| ** power >, power may be fractional
stat.E( x => x\*x );    // expected value of arbitrary function

// Round arbitrary numbers
stat.round(1.7);        // center of respective bucket
stat.lower(1.7);
stat.upper(1.7);        // bucket boundaries
stat.shorten(1.7);      // the shortest number within the bucket
                        // may be useful for eye-candy

// Query data but the returned values are rounded to the shortest number
//     within the precision bounds
stat.neat.mean();
stat.neat.stdev();
stat.neat.median();

// Extract partial samples

stat.clone( { min: 0.5, max: 0.7 } );

// Create histograms and plot data.

stat.histogram({scale: 768, count:1024});
    // this produces 1024 bars of the form
    // [ bar_height, lower_boundary, upper_boundary ]
    // The intervals are consecutive.
    // The bar heights are limited to 768.

stat.histogram({scale: 70, count:20})
    .map( x => stat.shorten(x[1], x[2]) + '\t' + '+'.repeat(x[0]) )
    .join('\n')
    // "Draw" a vertical histogram for text console
    // You'll use PNG in production instead, right? Right?

```

See also the [playground](https://dallaylaen.github.io/stats-logscale-js/).

# COPYRIGHT AND LICENSE

Copyright (c) 2022 Konstantin Uvarin

This software is free software available under MIT license.
