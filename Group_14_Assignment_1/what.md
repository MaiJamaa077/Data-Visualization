### Task 1: What

#### Dataset type:

Multi-attribute table / Time Series

#### Attribute types:

| Data Attribute | Attribute Type (N-O-Q) | D3 Scale Type       | Details                               |
|:-------------- |:---------------------- |:------------------- | -------------------------------------:|
| ID             | Quantitative (Q)       | `d3.scaleLinear()`  | Numeric range: [1, 271,116]           |
| Name           | Nominal (N)            | `d3.scaleBand()`    | e.g., A Dijiang, Edgar Lindenau Aabye |
| Sex            | Nominal (N)            | `d3.scaleOrdinal()` | Values: [M, F]                        |
| Age            | Quantitative (Q)       | `d3.scaleLinear()`  | Numeric range: [10, 97]               |
| Height         | Quantitative (Q)       | `d3.scaleLinear()`  | Numeric range: [127, 226]             |
| Weight         | Quantitative (Q)       | `d3.scaleLinear()`  | Numeric range: [25, 214]              |
| Team           | Nominal (N)            | `d3.scaleBand()`    | e.g., China, Denmark, Netherlands     |
| NOC            | Nominal (N)            | `d3.scaleBand()`    | e.g., CHN, DEN, NED                   |
| Games          | Nominal (N)            | `d3.scaleBand()`    | e.g., 1992 Summer, 2012 Summer        |
| Year           | Quantitative (Q)       | `d3.scaleLinear()`  | Numeric range: [1896, 2016]           |
| Season         | Nominal (N)            | `d3.scaleOrdinal()` | Values: [Summer, Winter]              |
| City           | Nominal (N)            | `d3.scaleBand()`    | e.g., Barcelona, London, Sydney       |
| Sport          | Nominal (N)            | `d3.scaleBand()`    | e.g., Basketball, Judo, Athletics     |
| Event          | Nominal (N)            | `d3.scaleBand()`    | e.g., Basketball Men's Basketball     |
| Medal          | Ordinal (O)            | `d3.scaleOrdinal()` | [Gold, Silver, Bronze, NA]            |
