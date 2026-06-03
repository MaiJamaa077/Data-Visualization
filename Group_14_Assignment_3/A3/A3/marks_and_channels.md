### Marks and Channels

#### Parallel Coordinates
- Marks:  Lines (each line represents a single daily weather observation).
- Channels:
    - Vertical spatial position: Encodes the quantitative values of variables (Temperature and Humidity) along their respective vertical axes.
    - Color hue: Encodes the categorical variable of the Weather Station.

#### Parallel Sets
-  Marks: 
   - Rectangles (Nodes representing total observation counts for the specific categories).
   - Areas/Ribbons (Links representing the flow and intersection of records between categories).
- Channels:
    - Width: Encodes the total observation count of records belonging to a specific category
    - Color hue: Used to track primary categorical variables as they flow through the dimensions.

#### Your Chosen Time Visualization
-  Marks: Lines (continuous connection marks representing the progression of data over time).
- Channels:
    - Vertical spatial position: Encodes the quantitative value (e.g., Humidity).
    - Horizontal spatial position: Encodes the dimension of Time (adjusting dynamically across Years, Months, and Days).
    - Color hue: Encodes the categorical variable of the Weather Station.
