# Task 1: What

## Dataset type:
Multi-attribute Table / Temporal (filtered for Winter seasons).

## Attribute types (N-O-Q):

| DATA ATTRIBUTE | TYPE (N-O-Q) | D3 SCALE TYPE | DETAILS |
| :--- | :--- | :--- | ---: |
| ID | Nominal (N) | d3.scaleOrdinal() | Unique identifier |
| Name | Nominal (N) | d3.scaleBand() | Athlete names |
| Sex | Nominal (N) | d3.scaleOrdinal() | Categories: [M, F] |
| Age | Quantitative (Q) | d3.scaleLinear() | Range: [10, 97] |
| Height | Quantitative (Q) | d3.scaleLinear() | Range: [127, 226] cm |
| Weight | Quantitative (Q) | d3.scaleLinear() | Range: [25, 214] kg |
| Team | Nominal (N) | d3.scaleBand() | e.g., Norway, USA, China |
| NOC | Nominal (N) | d3.scaleBand() | 3-letter country codes |
| Games | Ordinal (O) | d3.scaleBand() | Year + Season |
| Year | Quantitative (Q) | d3.scaleLinear() | Range: [1896, 2016] |
| Season | Nominal (N) | d3.scaleOrdinal() | [Summer, Winter] (Winter selected) |
| City | Nominal (N) | d3.scaleBand() | e.g., Lillehammer, Sochi |
| Sport | Nominal (N) | d3.scaleBand() | e.g., Biathlon, Ice Hockey |
| Event | Nominal (N) | d3.scaleBand() | Specific competitions |
| Medal | Ordinal (O) | d3.scaleOrdinal() | [Gold, Silver, Bronze, NA] |
