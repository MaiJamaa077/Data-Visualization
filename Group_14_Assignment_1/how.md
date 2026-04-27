### Task 3: How

#### Explain your design decision

**Choice of Visualization: Horizontal Bar Chart**
The research question "Which teams are best at athletics?" implies a nominal comparison and ranking task. We chose a horizontal bar chart for three primary reasons:

1. Label Readability: Team names (e.g., "United States", "Soviet Union") are long categorical labels. Horizontal bars allow these labels to be placed naturally to the left of the bars, preventing the overlap or diagonal tilting often required in vertical bar charts.
2. Intuitive Ranking: By sorting the bars from highest (top) to lowest (bottom), the reader can immediately identify the "best" teams without scanning the entire display.
3. Efficiency: A bar chart is the most accurate encoding for comparison of quantitative values across categories, as humans excel at judging differences in length along a common baseline.

**Marks and Channels**

* Mark: Rectangles.
* Channel (Quantitative): Horizontal Length (x-axis) encodes the total medal count.
* Channel (Categorical): Vertical Position (y-axis) encodes the Olympic Team.
* Channel (Emphasis): Color (Hue/Saturation) distinguishes the data from the background, using a single color to maintain minimalism.

**Bauhaus Principles and Minimalism**
Aligned with the "Form Follows Function" ethos:

* We removed all non-essential elements, including 3D effects, heavy borders, and explicit grid lines. The axis lines were removed to maximize the data-to-ink ratio.
* Instead of a separate legend, medal counts are placed directly at the terminal end of each bar ("Stock Market" style). This reduces cognitive load by eliminating the need to scan between a legend and the visualization.
* The x-axis starts at zero, ensuring an accurate and unbiased representation of the data.
* We used a consistent, Bauhaus color palette (`#006189`) and sans-serif typography.

**Accessibility**
The design uses "Double Encoding" indirectly: the position and length of the bar provide the quantitative information, while the direct text label ensures the exact value is accessible. By using a single hue with varied length, the visualization remains fully legible for color-blind viewers.
