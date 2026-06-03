# **1. The Central Idea: Time as a Design Choice**

The fundamental philosophy of this text is that **modeling time in information systems is a design choice**. It is not a quest to perfectly imitate the physical dimension of time, but rather to create a model that serves a specific data analysis task. To visualize time-oriented data effectively, you must understand how time is structured and how data relates to those structures.

---

### **2. Fundamental Design Aspects of Time**

To characterize time for visualization, you must consider four orthogonal aspects:

- **Scale:**
  - **Ordinal:** Only relative order matters (e.g., "before" or "after").
  - **Discrete:** Based on quantifiable units like minutes or seconds.
  - **Continuous:** Between any two points, another point always exists.
- **Scope:** Distinguishes between **point-based time** (instants with zero duration) and **interval-based time** (subsections with a duration greater than zero).
- **Arrangement:**
  - **Linear:** Time proceeds from past to future.
  - **Cyclic:** Time values recur (e.g., seasons or days of the week).
- **Viewpoint:**
  - **Ordered:** Events happen one after another.
  - **Branching:** Supports decision-making by showing alternative future scenarios.
  - **Multiple Perspectives:** Allows for simultaneous, potentially contrary views (e.g., eyewitness reports).

---

### **3. Taming Complexity: Granularity and Primitives**

- **Granularity:** These are human-made abstractions (minutes, days, weeks) that map time values to conceptual units. A system of multiple granularities arranged in a lattice is called a **calendar**.
- **Time Primitives:** These are the "building blocks" used to relate data to time:
  - **Instant:** A single point in time (anchored).
  - **Interval:** A portion of time with a start and end (anchored).
  - **Span:** An unanchored amount of time (e.g., "four days").
- **Determinacy:** You must account for **indeterminacy** ("don't know exactly when" information), which often arises during granularity conversion or when data is imprecise.

---

### **4. Characterizing Time-Oriented Data**

Using the **Pyramid Framework**, data is conceptualized through three perspectives: **Where** (location), **When** (time), and **What** (theme/objects). Key data variables include:

- **Scale:** Quantitative (numeric) vs. Qualitative (categorical).
- **Frame of Reference:** **Abstract** (no spatial connection) vs. **Spatial** (inherent physical layout).
- **Kind of Data:** **Events** (instantaneous changes) vs. **States** (phases of continuity).
- **Number of Variables:** Univariate (one variable) vs. Multivariate (many variables).

---

### **5. Relating Data to Time: Internal vs. External**

Every dataset relates to two distinct temporal domains:

1. **Internal Time ($T_i$):** When the information contained in the data is valid.
2. **External Time ($T_e$):** Extrinsic to the data model, describing how the dataset itself evolves (e.g., a streaming data feed).
- **Static Temporal Data:** Values depend only on internal time (typical time series).
- **Dynamic Temporal Data:** The data changes its state over external time.

---

### **6. Key Visualization Idioms to Mention**

- **Gantt Charts:** Specifically designed to represent **time intervals**.
- **Cycle Plots:** Utilize multiple granularities to represent both **cycles and trends** simultaneously.
- **TimeWheel:** Arranges axes of time-dependent variables around a central horizontal time axis.
- **PlanningLines:** A specialized glyph used to depict **temporal indeterminacy** (minimum and maximum durations).

---

### **Presentation Checklist (Final Polish)**

- **The "So What?"**: Explain that the choice of time model influences what patterns are visible. For example, a linear arrangement highlights trends, while a cyclic arrangement highlights periodic seasonal patterns.
- **Visual Complexity:** Mention that even if data changes over time, **animation** is only one way to show it; other options include static juxtaposed views (small multiples) or embedding.
- **Data Quality:** Note that visualization developers must consider data quality issues specifically for time-oriented data, such as missing values or imprecise timestamps.



The central idea of the "Time and Time_Series" source is that **modeling time in information systems is a design choice** aimed at creating the most effective representation for data analysis, rather than a quest to perfectly imitate the physical dimension of time. It provides a framework for structuring the complexities of time—such as its scale, arrangement, and granularity—to facilitate **interactive visualization**.

Based on the source, here is the context you should know for your presentation:

### 1. Fundamental Design Aspects of Time

To visualize time effectively, you must characterize it along four principal orthogonal aspects:

- **Scale:** Can be **ordinal** (only relative order, e.g., "before/after"), **discrete** (based on quantifiable units like seconds), or **continuous** (mapping to real numbers where another point always exists between two points).
- **Scope:** Distinguishes between **point-based** time (instants with zero temporal extent) and **interval-based** time (subsections with an extent greater than zero).
- **Arrangement:** Time is typically perceived as **linear** (proceeding from past to future), but can also be **cyclic** (recurring values like seasons). Most common is "serial periodic data," which combines both.
- **Viewpoint:** Refers to how events are structured. This includes **ordered** time (things happening one after another), **branching** time (alternative future scenarios), and **multiple perspectives** (simultaneous, potentially contrary views, like different eyewitness reports).

### 2. Taming Complexity: Granularity and Primitives

- **Granularity:** These are human-made abstractions (minutes, days, weeks) that map time values to larger conceptual units. A system of multiple granularities is a **calendar**.
- **Time Primitives:** Data is related to time through **instants** (single points), **intervals** (portions of time with a start and end), and **spans** (unanchored amounts of time, like "four days").
- **Determinacy:** You must account for **indeterminacy** (inexact "don't know when" information) which often arises during granularity conversion or when data is imprecise.

### 3. Characterizing Time-Oriented Data

Data connected to time is categorized using the **Pyramid Framework**, focusing on **Where** (location), **When** (time), and **What** (theme/objects). Key data variables include:

- **Scale:** Quantitative vs. qualitative.
- **Frame of Reference:** Abstract (no inherent spatial location) vs. spatial.
- **Kind of Data:** Events (state changes) vs. states (phases of continuity).
- **Number of Variables:** Univariate vs. multivariate.

### 4. Relating Data to Time

Any dataset relates to two temporal domains:

- **Internal Time ($T_i$):** When the information is valid.
- **External Time ($T_e$):** How the dataset evolves (e.g., streaming data).
- **Static vs. Dynamic:** **Static temporal data** (like common time series) provides a historical view where values depend on internal time, while **dynamic data** changes its state over external time.

**Presentation Tip:** Emphasize that while there is no "correct" model of time, the chosen model must match the specific analysis task, such as finding trends, cycles, or outliers.
