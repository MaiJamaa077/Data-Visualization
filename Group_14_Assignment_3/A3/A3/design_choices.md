### Design Choice

#### Which time-based visualization did you choose?
- we chose a Time Series Line Chart that supports hierarchical drill-down functionality (from Year to Month to Day) and interactive zooming.

#### Why did you choose this visualization?
- we chose this Line Chart because it is the correct choice for Q2 as it places time on the x-axis and humidity on the y-axis, making seasonal cycles and multi-year patterns readable as the shape of the line. We could show the continuous change over time to indentify the seasonal humidity patterns best through this visualization.

#### What attributes did you choose to visualize in the parallel coordinates plot and why?
- we chose to plot Temperature and Humidity in the parallel coordinates plot. Q3 asks specifically about the relationship between these two variables, and parallel coordinates makes that relationship visible as the crossing or parallel behavior of lines between the two axes. 

#### What attributes did you choose to visualize in the parallel sets and why?
- we visualized Location Type (Coastal/Continental), Elevation Type (Sea-level/Mountain), and Pressure Category (Low/High). Because Q4 asks whether pressure differs by proximity to sea and by elevation. Both of which are categorical splits. The parallel sets plot was ideal to visualize how these categorical variables flow into one another as it allows users to compare observation counts. 