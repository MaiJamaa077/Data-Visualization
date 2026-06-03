### Visualization design

The dashboard utilizes a Coordinated Multi-View (CMV) architecture consisting of three distinct charts, each tailored to answer one of the primary research questions while maintaining a high data-ink ratio.

**1. Heatmap (Team Dominance by Sport)**
* A heatmap is the optimal choice for displaying the intersection of two categorical variables (Team and Sport) against a quantitative value (Medals). By sorting the x-axis by overall historical medal count, the visualization ensures that the most data-dense and relevant teams are immediately visible. The sequential color scale leverages the human visual system's innate ability to associate darker saturation with higher density/magnitude.

**2. Scatterplot (Bodily Attributes vs. Success)**
* A scatterplot is the most effective idiom for finding correlations between two quantitative attributes (height and weight). Because overplotting is a major risk with over a century of athlete data, the view is filtered by the heatmap. Using `scaleSqrt` for the circle radius ensures that the *area* of the circle scales linearly with the medal count to prevent optical distortion and encode successful athletes through size alone.

**3. Diverging Bar Chart (Gender Popularity by Sport)**
*  While a standard grouped bar chart could work, a diverging bar chart (or tornado chart) is vastly superior for *comparative balance*. By aligning the bars to a central zero-axis, the user's eye can instantly judge the gender ratio for a specific sport without having to mentally calculate the difference between side-by-side bars.  

### Interaction design


**1. Navigate: Pan**
*  Attempting to render 50+ categorical labels on an x-axis of limited width results in unreadable, overlapping text. By panning, we change the user's viewpoint over a larger spatial domain without changing the visual encoding. This manipulation technique effectively handles item complexity while maintaining the user's spatial mental model of the dataset. 

**2. Select to Filter:**
* Without filtering, the scatterplot view is an unreadable, massive overlapping dots. It masks any sport-specific physical correlations. By linking a **Select** action in the heatmap to a **Filter** action in the scatterplot and bar chart, tahe user can  identify and compare sport-specific distributions. 

