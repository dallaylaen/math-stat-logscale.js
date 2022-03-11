# math-stat-logscale

# DESCRIPTION

A memory-efficient approximate statistical analysis tool using logarithmic binning.

# HOW IT WORKS

Data is split into logarithmic (linear around zero) bins.
Bin counts are then used for calculations instead of actual numbers.

This allows to achieve tolerable precision while using very little memory.

# USAGE

```javascript
const { Univariate } = require( 'math-stat-logscale' );

const stat = new Univariate();

stat.add( 3, 14, 16 );

stat.count(); // 3
stat.mean(); // roughly 11
stat.median(); // roughly 14
```

# COPYRIGHT AND LICENSE

Copyright (c) 2022 Konstantin Uvarin

This software is free software available under MIT license.
