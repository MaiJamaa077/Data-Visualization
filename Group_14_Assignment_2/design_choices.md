# Task 3: How (Design Choices)

## Pure Mark Interaction (Visual Evidence)

To strictly adhere to the Bauhaus "Form Follows Function" philosophy and the assignment's explicit prohibition of standard HTML control elements, this dashboard utilizes a **Pure Mark Interaction** system.

1. **Interactive SVG Legends (Reducing):**
   - **Mechanism:** Instead of using forbidden HTML buttons or select boxes, the **Gender** and **Medal** filters are implemented as custom visual marks within the Scatter Plot's SVG coordinate space.
   - **Justification:** This approach ensures that all analytical triggers are designed using the "visual elements of the charts." By integrating controls directly into the chart's legend, we eliminate the cognitive gap between the data and the user interface.

2. **Coordinated Multi-View (Faceting):**
   - **Mechanism:** Clicking a cell in the **Heatmap** facets the **Scatter Plot** to show only the athletes corresponding to that specific Team and Sport.
   - **Justification:** This coordination fulfills the "Faceting" requirement by allowing one view to act as a navigational lens for the other, facilitating deep-dive discovery into specific sport-team dominance.

3. **Mental Map Stability (Gradual Transitions):**
   - **Mechanism:** All interactions (filtering, faceting, resizing) trigger smooth **D3 Transitions (750ms)**.
   - **Justification:** Following the instructor's advice, we avoided instantaneous "jumping" between states. Gradual transitions help the viewer maintain their "mental map" of the data, allowing them to follow individual dots as they appear, disappear, or move during a filter action.

---

## Analytical Rigor & Normalization

To ensure a fair comparison across different types of Olympic sports, we implemented a robust measurement of success:

- **Medal Normalization:** Team sports (e.g., Ice Hockey) naturally generate many rows in the raw dataset for a single victory. To prevent these from skewing the "Dominance" heatmap, our counting logic groups medals by **Event and Year**. This ensures that one Team Gold in Hockey carries the same weight as one Individual Gold in Skiing, providing a much more accurate view of sport popularity and dominance.

---

## Accessibility & Inclusive Design

Following the **Royal Statistical Society (RSS)** best practices for visualization, we have prioritized inclusive design:

- **Qualitative Palette Selection:** We replaced the stereotypical red/blue binary with a high-contrast **Purple (#e1bee7/8e44ad)** and **Orange (#ffe0b2/f39c12)** qualitative palette. This decision avoids gender bias and ensures the dashboard is accessible to users with color vision deficiencies (Color-Blind Safe).
- **Double Encoding:** Success is encoded using both color and radius (medals are larger than non-medals), ensuring the "What" is identifiable even without color perception.
- **Typography for Legibility:** All text labels adhere to a minimum size of **14px (approx. 10.5pt)** with titles at **24px (18pt)**, ensuring the report is readable for users with visual impairments.

---

## Bauhaus Principles

- **Zero Chart Junk:** Following the minimalist traditions of the Bauhaus, we removed all redundant grid lines and domain paths. Every visual mark on the screen is a carrier of information.
- **Grid Stability:** The dual-pane dashboard layout provides a stable analytical grid, allowing for immediate spatial comparison between sport dominance (Heatmap) and physical correlation (Scatter Plot).
- **Details-on-Demand:** To maintain the "shortest, simplest, most penetrating form," names and specific data are hidden behind hover-triggered tooltips, keeping the overview pure and focused.