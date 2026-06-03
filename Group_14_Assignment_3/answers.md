### Answers to the questions

#### 1. In which year and in which weather station has the lowest temperature been recorded?

The lowest temperature was recorded in 2012 at the Carlsfeld weather station (-24.5 °C).

*How found:* Because Weekly Aggregation is used to manage visual complexity, we implemented a "Guaranteed Visibility" strategy. The system programmatically finds this absolute minimum value from the full raw daily dataset and explicitly marks it with a red dot on the Time Series chart. This ensures the outlier cannot be "smoothed over" by the weekly aggregation; it is always visible regardless of the current filter state.

---

#### 2. Are there time-based patterns regarding humidity?

Yes, there are clear seasonal patterns in humidity. Humidity is consistently higher in Winter and Fall, and lower in Summer. This cycle repeats visibly every year across all stations. Mountain-based stations generally show higher humidity values year-round compared to coastal or continental stations.

*How found:* By brushing the HUMIDITY axis in the Parallel Coordinates, we can isolate high-humidity periods and observe them propagate into the Time Series. Additionally, clicking the `Winter` or `Summer` nodes in the Parallel Sets filters the Time Series to reveal the seasonal humidity cycle.

---

#### 3. Is there some kind of relation between temperature and humidity?

Yes, there is a strong negative (inverse) correlation between air temperature and relative humidity.

*How found:* Looking directly at the Parallel Coordinates plot, the polylines connecting the `TEMPERATURE_AIR` axis to the `HUMIDITY` axis predominantly cross each other — forming an "X" pattern. In Munzner's framework, crossing lines on parallel coordinates indicate a negative correlation: as temperature increases, humidity decreases, and vice versa. This is most visible in the summer months when temperatures are high but humidity is at its lowest.

---

#### 4. a) Is air pressure lower by the sea or at continental locations?

Air pressure is generally **higher and more stable at coastal (sea-level) locations** compared to continental ones.

*How found:* Clicking the `Coastal` node in the Parallel Sets filters the Parallel Coordinates. The filtered polylines cluster near the top of the `PRESSURE_AIR` axis (~1010–1020 hPa). Switching to `Continental` shows a similar range but with slightly more variance.

#### 4. b) Is there a difference in air pressure between sea-level stations and mountain-based stations?

Yes. There is a massive and unambiguous difference. Mountain stations have dramatically lower air pressure than both coastal and continental (sea-level) stations.

*How found:* Clicking the `Mountain` node in the Parallel Sets immediately isolates those lines in the Parallel Coordinates. Every single `Mountain` polyline drops to the bottom of the `PRESSURE_AIR` axis (~850–950 hPa), clearly confirming that altitude causes significantly reduced atmospheric pressure; a direct application of the physical principle that air pressure decreases with altitude.
