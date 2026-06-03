### Design Choice

#### Which time-based visualization did you choose?

A Multi-Line Chart featuring a linear arrangement (past to future) to highlight trends, plotted on a discrete scale (weekly units). To manage the complexity of ~28,600 rows, we shifted from a daily to a weekly granularity via aggregation.

#### Why did you choose this visualization?

We explicitly chose Weekly Aggregation over random sampling to tame visual complexity. Aggregation is the "safer" choice from a cognitive perspective because the stand-in visual element (the weekly average) conveys information about the entire set. We rejected sampling to avoid the "out of sight, out of mind" problem, which risks filtering out critical outliers. To counter the smoothing effect of aggregation on outlier tasks, we implemented a "Guaranteed Visibility" strategy (details-on-demand) to explicitly highlight the absolute lowest temperature from the full dataset.

#### What attributes did you choose to visualize in the parallel coordinates plot and why?

We plotted the core quantitative variables: `TEMPERATURE_AIR`, `HUMIDITY`, `PRESSURE_AIR`, `SUNSHINE_DURATION`, `SNOW_DEPTH`, `HEIGHT_ABOVE_SEA_LEVEL_M`, and `DISTANCE_TO_SEA_KM`. This allows us to discover correlations (e.g., between Temperature and Humidity via parallel/crossing lines) and view the continuous distribution of pressure related to altitude and distance to the sea.

#### What attributes did you choose to visualize in the parallel sets and why?

We derived new categorical attributes to populate the Parallel Sets: `Season` (Winter/Spring/Summer/Fall), `LocationType` (Coastal/Continental/Mountain), and `Station`. Because deriving data is a key strategy for managing complexity, and these specific categories allow us to answer tasks requiring comparison between seasons or geographic profiles via focus+context faceting.