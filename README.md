# math-stat-logscale

# DESCRIPTION

A memory-efficient approximate statistical analysis tool
using logarithmic binning.

* available both in a browser and as a standalone module;

* allows to specify absolute & relative precision;

* can add numbers to sample one-by-one or with weights;

* can calculate mean, moments, quantiles, and probabilities;

* can calculate expected value of an arbitrary function over the sample;

* can generate histograms of the sample;

* is (de)serialiazble, multiple smaples can be combined into one.

# HOW IT WORKS

The real numbers are split into intervals, or bins (aka buckets).
All numbers in the sample are rounded towards the center
of their respective bins, and only the counts is stored.

The bin size depends on the relative and absolute precision or the sample,
hence the _logscale_ in the name.

This allows to operate on very large samples
with reasonable speed and memory usage.

# USAGE

```javascript
const { Univariate } = require( 'math-stat-logscale' );

const stat = new Univariate({precision: 0.1, base: 1.01});

stat.add( 3, 14, 16 );

stat.count(); // 3
stat.mean(); // roughly 11
stat.median(); // roughly 14
```

See also the [playground](https://dallaylaen.github.io/math-stat-logscale.js/).

# COPYRIGHT AND LICENSE

Copyright (c) 2022 Konstantin Uvarin

This software is free software available under MIT license.
