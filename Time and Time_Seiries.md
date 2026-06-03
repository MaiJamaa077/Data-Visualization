[![](https://skill.web.webis.de/static/textAnnotation/logo.png)](https://skill.web.webis.de/reading)

- [Tasklist](https://skill.web.webis.de/reading/)

Task: Chapter 3: Time & Time-Oriented Data [EDIT] (G2)

Skim > Read and Answer > Pair and Discuss > Group Discussion

-  [](https://skill.web.webis.de/reading/task/1547/#)

53

Springer, London 2023-01-01 00:00:00Wolfgang Aigner, Silvia Miksch, Heidrun Schumann & Christian TominskiVisualization of Time-Oriented Data

# Chapter 3: Time & Time-Oriented Data [EDIT]

What, then, is time? If no one asks me, I know what it is. If I wish to explain it to him who asks, I do not know.

Saint Augustine (AD 354-430, The Confessions)

The fundamental phenomenon of time has always been of interest to mankind. Many different theories for characterizing the physical dimension of time have been developed and discussed over literally thousands of years in philosophy, mathematics, physics, astronomy, biology, and many other disciplines. As reported by Whitrow et al. (2003), a 1981 literature survey by J. T. Fraser found that the total number of entries judged to be potentially relevant to the systematic study of time reached about 65,000. This illustrates the breadth of the topic and the restless endeavor of man to uncover its secrets. What can be extracted as the bottom line across many theories is that time is *unidirectional* (arrow of time) and that time gives *order* to events.

The most influential theories for the natural sciences are probably Newton’s concepts of absolute vs. relative time and Einstein’s four-dimensional spacetime. Newton assumed an absolute, true, mathematical time that exists in itself and is not dependent on anything else. Together with space, it resembles a container for all processes in nature. This image of an absolute and independent dimension prevailed until the beginning of the 20th century. Then, Einstein’s relativity theory made clear that time in physics depends on the observer. Thus, Einstein introduced the notion of spacetime, where space and time are inherently connected and cannot be separated. That is, each event in the universe takes place in four-dimensional space at a location that is defined by three spatial coordinates at a certain time as the fourth coordinate (see Lenz, 2005). Both Newton’s notion of absolute time and Einstein’s spacetime are concepts that describe time as a fundamental characteristic of the universe. In contrast to that, the way humans deal with time in terms of deriving it essentially from astronomical movements of celestial bodies or phenomena in nature is what Newton called relative time.

The first signs of the systematic use of tools for dealing with time have been found in the form of bone engravings that resembled simple calendars based on the cycle of the moon.

54

In this regard, the most fundamental natural rhythm perceived by humans is the day. Consequently, it is the basis of most calendars and was used to structure the simple life of our ancestors who lived in close contact with nature (see Lenz, 2005). More complex calendars evolved when man moved away from the life of hunter-gatherers and settled into communities to live from agriculture. Until very late in human history, time was kept only very roughly. Industrialization and urban civilization brought about the need for more precise, regular, and synchronized overall timekeeping.

Today, the most commonly used calendric system is the Gregorian calendar. It was introduced by Pope Gregory XII in 1582, primarily to correct the drift of the previously used Julian calendar, which was slightly too long in relation to the astronomical year and the seasons.1 Apart from this calendric system, many other systems are in use around the world, such as the Islamic, the Chinese, or the Jewish calendars, or calendars for special purposes, like academic (semester, trimester, etc.) or financial calendars (quarter, fiscal year, etc.).

In this book, we will not look at the physical dimension of time itself and its philosophical background, how time is related to natural phenomena, or how clocks have been developed and used. We focus on how the physical dimension of time and associated data can be modeled in a way that facilitates interactive visualization using computer systems. As a next step, we are now going to examine the design aspects for modeling time.

### 3.1 Modeling Time

First of all, it is important to make a clear distinction between the physical dimension of time and a model of time in information systems. When modeling time in information systems, the goal is not to perfectly imitate the physical dimension time, but to provide a model that is best suited to reflect the phenomena under consideration and support the analysis tasks at hand. Moreover, as Frank (1998) states, there is nothing like a single correct model or taxonomy of time – there are many ways to model time in information systems and time is modeled differently for different applications depending on the particular problem. Extensive research has been conducted in order to formulate the notion of time in many areas of computer science, including artificial intelligence, data mining, simulation, modeling, databases, and more. A theoretical overview which includes many references to fundamental publications is provided by Hajnicz (1996). However, as she points out, the terminology is not consistent across the different fields, and hence, does not integrate well with visualization. Moreover, as Goralwalla et al. (1998) note, most research focuses on the development of specialized models with different features for particular domains. But apart from the many time models created for specific purposes and applications, attempts have been made to capture the major design aspects underlying all specific instances, as for example by Frank (1998), Goralwalla et al. (1998), Peuquet (1994), Peuquet (2002), Furia et al. (2010), and Furia et al. (2012).

1 Interestingly, much more precise calendars were known hundreds of years earlier in other cultures, such as those developed by the Mayas and the Chinese.

55

In the context of our book, we want to present the overall design aspects of modeling time, and not a particular model. To do this, we will describe a number of major design aspects and their features which are particularly important when visualizing time. Application-specific models can be derived from these as particular configurations.

#### 3.1.1 Design Aspects

To define the design aspects relevant to time, we adapted the works of Frank (1998) and Goralwalla et al. (1998), where principal orthogonal aspects are presented to characterize different types of time. Next, the aspects of scale, scope, arrangement, and viewpoint will be described in detail.

**Scale: ordinal vs. discrete vs. continuous** Let us first consider the scale along which elements of time are given. In an *ordinal* time domain, only relative order relations are present (e.g., before, after). For example, statements like “Valentina went to sleep before Arvid arrived” and “Valentina woke up after a few minutes of sleep” can be modeled using an ordinal scale. Note that only relative statements are given and we cannot discern from the given example whether Valentina woke up before or after Arvid arrived (see Figure 3.1). This might be sufficient if only qualitative temporal relationships are of interest or no quantitative information is available.

In *discrete* time domains, it is possible to consider temporal distances. Time values can be mapped to a set of integers which enables quantitative modeling of time values (e.g., quantifiable temporal distances). Discrete time domains are based on a smallest possible unit (e.g., seconds or milliseconds as in UNIX time) and they are the most commonly used time models in information systems (see Figure 3.2). Continuous time models are characterized by a possible mapping to real numbers, i.e., between any two points in time, another point in time exists (also known as dense time, see Figure 3.3).

Examples of visualization techniques capable of representing the three types of scale are the *point and figure chart* (see Figure 3.4) for an ordinal scale, *tile maps* (see Figure 3.5 and ↪ p. 269) for a discrete scale, and the *circular silhouette graph* (see Figure 3.6 and ↪ p. 281) for a continuous time scale.

**Scope: point-based vs. interval-based** Secondly, we consider the scope of the basic elements that constitute the structure of the time domain. Point-based time domains can be seen in analogy to discrete Euclidean points in space, i.e., having a temporal extent equal to zero. Thus, no information is given about the region between two points in time. In contrast to that, interval-based time domains relate to subsections of time having a temporal extent greater than zero. This aspect is also closely related to the notion of granularity, which will be discussed in Section 3.1.2.

56

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-1.png)

**Figure 3.1** Ordinal scale. Only relative order relations are present. At this level, it is not possible to discern whether Valentina woke up before or after Arvid arrived. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-2.png)

**Figure 3.2** Discrete scale. Smallest possible unit is minutes. Although Arvid arrived and Valentina woke up within the same minute, it is not possible to model the exact order of events. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-3.png)

**Figure 3.3** Continuous scale. Between any two points in time, another point in time exists. Here, it is possible to model that Arvid arrived shortly before Valentina woke up. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-4.png)

**Figure 3.4** Point and figure chart. Visualization technique tracking price and price direction changes. Uses an *ordinal time scale*. ◦...positive price change of a certain amount, ×...negative price change of a certain amount, []...begin/end of a trading period. (CC) By *The authors. Adapted from Harris (1999)*.

57

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-5.png)

**Figure 3.5**: Tile maps showing average daily ozone measurements (scale: *discrete*, scope: *interval-based*) for three years. (CC) By *The authors. Adapted from Mintz et al. (1997)*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-6.png)

**Figure 3.6** Circular silhouette graph. Enables the representation of time along a *continuous scale* with a *cyclic arrangement*. The representation emphasizes the visual impression by filling the area below the plotted line in order to create a distinct silhouette. This eases comparison when placed side by side. (CC) By *The authors. Adapted from Harris (1999)*.

For example, the time value October 23, 2012 might relate to the single instant October 23, 2012 00:00:00 in a point-based domain, whereas the same value might refer to the interval [October 23, 2012 00:00:00, August 23, 2012 23:59:59] in an interval-based domain (see Figures 3.7 and 3.8).

Examples of visualization techniques capable of representing the two types of scope are the *TimeWheel* (see Figure 3.9 and ↪ p. 298) for a point-based domain and tile maps (see Figure 3.5 and ↪ p. 269) for an interval-based time domain.

58

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-7.png)

**Figure 3.7** Time value “October 23, 2012” for the birthday of Emilia in a point-based domain. No information is given in between two time points. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-8.png)

**Figure 3.8** Time value “October 23, 2012” for the birthday of Emilia in an interval-based domain. Each element covers a subsection of the time domain greater than zero. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-9.png)

**Figure 3.9** TimeWheel. Axes of time-dependent variables are arranged around a central horizontal time axis. Lines connect the time points on the time axis with the corresponding data values on the variable axes. Colors indicate different variables. (CC) By *The authors. Adapted from Tominski et al. (2004)*.

**Arrangement: linear vs. cyclic** As the third design aspect, we look at the arrangement of the time domain. Corresponding to our natural perception of time, we mostly consider time as proceeding *linearly* from the past to the future, i.e., each time value has a unique predecessor and successor (see Figure 3.10). However, periodicity is very common in all kinds of data, for example, seasonal variations, monthly averages, and many more. In a *cyclic* organization of time, the domain is composed of a set of recurring time values (e.g., the seasons of the year, see Figure 3.11). Hence, any time value *A* is preceded and succeeded at the same time by any other time value *B* (e.g., winter comes before summer, but winter also succeeds summer). In order to enable meaningful temporal relationships in cyclic time, Frank (1998) suggests the use of the relations immediately before and immediately after. Strictly cyclic data, where the linear progression of time from past to future is neglected, is very rare (e.g., records for the day of the week not considering month or year).

59

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-10.png)

**Figure 3.10** Linear time. Time proceeds linearly from past to future. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-11.png)

**Figure 3.11** Cyclic time. Set of recurring time values such as the seasons of the year. (CC) By *The authors*.

The combination of periodic and linear progression denoted by the term *serial periodic data* (e.g., monthly temperature averages over a couple of years) is much more common. Periodic time-oriented data in this sense includes both strictly cyclic data and serial periodic data.

Examples of visualization techniques capable of representing the two types of arrangement are the *TimeWheel* (see Figure 3.9 and ↪ p. 298) for linear time and the *circular silhouette graph* (see Figure 3.6 and ↪ p. 281) for cyclic time.

**Viewpoint: ordered vs. branching vs. multiple perspectives** The fourth subdivision is concerned with the views of time that are modeled. *Ordered* time domains consider things that happen one after the other. On a more detailed level, we might also distinguish between totally ordered and partially ordered domains. In a totally ordered domain, only one thing can happen at a time. In contrast to this, simultaneous or overlapping events are allowed in partially ordered domains, i.e., multiple time primitives at a single point or overlapping in time. A more complex form of time domain organization is the so-called *branching* time (see Figure 3.12). Here, multiple strands of time branch out and allow the description and comparison of alternative scenarios (e.g., in project planning). This type of time supports decision-making processes where only one of the alternatives will actually happen. Note that branching is not only useful for future scenarios but can also be applied for investigating the past, e.g., for modeling possible causes of a given decision. In contrast to branching time where only one path through time will actually happen, *multiple perspectives* facilitate simultaneous (even contrary) views of time, which are necessary, for instance, to structure eyewitness reports. A further example of multiple perspectives is stochastic multi-run simulations. For a single experiment, there might be completely different output data progressions depending on the respective initialization.

Temporal databases usually take a multi-perspective viewpoint as well. They consider the two perspectives of *valid time* and *transaction time* (see Figure 3.13). The valid time perspective of a fact is the time when the fact is true in the modeled reality (e.g., “Vincent was born on August 8, 2006”). In contrast to that, the transaction time perspective of a fact denotes when it was stored in the database (e.g., the birth of Vincent is stored in the register of residents after filling out a form two days after his birth).

60

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-12.png)

**Figure 3.12** Branching time. Alternative scenarios for moving to a different place. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-13.png)

**Figure 3.13** Multiple perspectives. Vincent was born on August 8, 2006 (valid time) and this fact was stored in the register of residents two days later on August 10, 2006 (transaction time). (CC) By *The authors*.

In practice, it is often necessary to condense multiple perspectives into a single consistent view of time (see for example Wolter et al., 2009).

Both branching time and multiple perspectives introduce the need to deal with probability (or uncertainty), to convey, for example, which path through time will most likely be taken, or which evidence is believable. The decision chart (see Figure 3.14 and ↪ p. 237) is an example of a visualization technique capable of representing branching time.

#### 3.1.2 Granularities & Time Primitives

The previous section introduced design aspects to adequately model the time domain’s scale, scope, and arrangement as well as possible viewpoints onto the time domain. Besides these general aspects, the hierarchical organization of time as well as the definition of concrete time elements used to relate data to time need to be specified. In the following, we will discuss this facet in more detail.

61

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-14.png)

**Figure 3.14** Decision chart. Example of a visualization technique capable of representing branching time. Future decisions and potential alternative outcomes along with their probabilities can be depicted over time. (CC) By *The authors. Adapted from Harris (1999)*.

**Granularity and calendars: none vs. single vs. multiple** To tame the complexity of time, it is practical to consider different levels of granularity. Basically, granularities can be thought of as human-made abstractions of time (e.g., minutes, hours, days, weeks, months). More generally, granularities describe mappings from time values to larger or smaller conceptual units (see Figure 3.15 for an example of time granularities and their relationships). A comprehensive overview and formalization of time granularity concepts is given by Bettini et al. (2000).

Most information systems that deal with time-oriented data are based on a discrete time model that uses a fixed smallest granularity also known as bottom granularity (e.g., Java’s java.time package uses nanoseconds as the smallest granularity). Consequently, the underlying time domain corresponds to a sequence of non-decomposable, consecutive time intervals of identical duration, so-called chronons (see Jensen et al., 1998). A point in time can then be specified simply as the number of chronons relative to a reference point (e.g., milliseconds since January 1, 1970 00:00:00 GMT as for Unix time).

Chronons may be grouped into larger segments, termed *granules*. That said, a granularity is basically a non-overlapping mapping of granules to subsets of the time domain (see Dyreson et al., 2000). Granularities are related in the sense that the granules in one granularity may be further aggregated to form larger granules belonging to a coarser granularity.

62

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-15.png)

**Figure 3.15**: Example of a discrete time domain with multiple granularities. The smallest possible unit (chronon) is one day. Based on this, the granularity weeks contains granules that are defined as being a set of seven consecutive days. Moreover, the granularity fortnights consists of granules that are a set of two consecutive weeks. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-16.png)

**Figure 3.16** Annotated granularity lattice of the Gregorian calendar that contains regular and irregular mappings (leap seconds are not considered in the granularity lattice). (CC) By *The authors*.

For example, 60 consecutive seconds are mapped to one minute.

A system of multiple granularities in lattice structures is referred to as a *calendar* (see Figure 3.16 for the granularity lattice of the Gregorian calendar). More precisely, it is a mapping between human-meaningful time values and an underlying time domain. Thus, a calendar consists of a set of granularities including mappings between pairs of granularities that can be represented as a graph (see Dyreson et al., 2000). Calendars most often include cyclic elements, allowing human-meaningful time values to be expressed succinctly. For example, dates in the common Gregorian calendar may be expressed in the form <day, month, year> where each of the fields day, month, and year circle as time passes (see Jensen et al., 1998). To help users in grasping the complexities of a calendar, a visual notation based on icons and glyphs has been developed by Dudek and Blaise (2013) for comparing different calendars to each other.

63

Moreover, mappings between granularities might be regular or irregular. A regular mapping exists for example between seconds and minutes where one minute always maps to 60 seconds.2 In contrast to that, the mapping of days to months is irregular because a month might be composed of 28, 29, 30, or 31 days depending on the context (particular year and month).

To work effortlessly with granularities and calendars, an appropriate infrastructure of data models and operators is required. This includes not only the definition of granularities and calendars, but also methods for converting from one granularity to another or for combining calendars. Particularly, conversion operations can be quite complex due to the irregularities in granularities, for example when converting from days to months. Many programming languages and their corresponding standard libraries implement the described functionalities for the Gregorian calendar following the ISO 8601 standard (e.g., java.time). More sophisticated implementations with support for alternative calendars (e.g., java.time.chrono) and multiple (user-defined) granularities are becoming increasingly important in a globalized world (see Dyreson et al., 2000; Lee et al., 1998).

Finally, it is worth mentioning that granularities influence equality relationships. Take for example two events A and B that happened on December 31, 2020 and January 2, 2021 (see Figure 3.17). At the granularity of days, the two events are on different days. Yet, at the granularity of weeks, both events are within the same granule. At the still coarser granularity of years, A and B are again different. Note that this is contradictory to the naive assumption that when an equality relationship holds true on a fine granularity it also holds true on a coarser one.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-17.png)

**Figure 3.17**: Granularities influence equality relationships. The times of A and B are not equal on the granularity of days, but are equal on the granularity of weeks, and then again are not equal on the coarser granularity of years. (CC) By *The authors*.

The concepts of chronon, granule, granularity, and calendar help us organize the time domain. If a visualization makes use of granularities or calendar systems, it is categorized as supporting *multiple* granularities. Besides this complex variant, a visualization’s time model might support only a *single* granularity (e.g., every time value is given in terms of milliseconds) or none at all (e.g., abstract ticks). An example of a visualization technique that uses time granularities is the *cycle plot* (see Figure 3.18 and ↪ p. 268).

2 We are not considering the exception of leap seconds here.

64

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-18.png)

**Figure 3.18**: Cycle plot. Visualization technique that utilizes two time granularities to represent cycles and trends. The example shows trends of measurements of weekdays over quarters. For example, on Mondays, the values show an increasing trend over the year while on Tuesdays the trend is decreasing. Furthermore, the general shape of a week’s cycle is visible. (CC) By *The authors. Adapted from Cleveland (1993)*.

**Time primitives: instant vs. interval vs. span** Next, we present a set of basic elements used to relate data to time, so-called time primitives: instant, interval, and span. These time primitives can be seen as an intermediary layer between data elements and the time domain. Basically, time primitives can be divided into anchored (absolute) and unanchored (relative) primitives. Instant and interval are primitives that belong to the first group, i.e., they are located at a fixed position in the time domain. In contrast to that, a span is a relative primitive, i.e., it has no absolute position in time.

An *instant*3 is a single point in time, e.g., May 23, 1977. Depending on the scope, i.e., whether a point-based or interval-based time model is used (see previous section), an instant might also have a duration (see Figure 3.19 and Figure 3.20). Time primitives can be defined at all levels of granularity representing chronons, granules, or sets of both. Examples of instants are the date of birth “May 23, 1977” and the beginning of a presentation on “January 10, 2023 at 2 p.m.” whereas the first instant (date of birth) is given at a granularity of *days* and the second (beginning of presentation) at a granularity of *hours*.

An *interval* is a portion of the time domain that can be represented by two instants, one denoting the beginning of the interval and the other its end. Intervals being defined in this way usually correspond to closed intervals that include the beginning and the end instant (e.g., [August 7, 2022; August 10, 2022] as in Figure 3.21). Alternatively, intervals can be specified via a beginning instant plus a duration (positive span), or via a duration (positive span) plus an end instant.

3 Oftentimes also referred to as *time point*.

65

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-19.png)

**Figure 3.19** Instant in a point-based time model, where instants have no duration. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-20.png)

**Figure 3.20** Instant in an interval-based time model, where instants have a duration that depends on their granularity. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-21.png)

**Figure 3.21** Interval [August 7, 2022 August 10, 2022] in a point-based time model. (CC) By *The authors*.

The *span* is the only unanchored primitive. A time span is defined as a directed, unanchored primitive that represents a directed amount of time in terms of a number of granules in a given granularity. Examples of spans are the length of a vacation of “10 days” and the duration of a lecture of “150 minutes”. Figure 3.22 illustrates this graphically by showing an example span of “four days” which is a count of four granules of the granularity of *days*. A span is either positive, denoting the forward motion of time, or negative, denoting the backward motion of time (see Jensen et al., 1998). In the case of irregular granularities, the exact length of a span is not known precisely. Consider for example the granularity of *months*, where a span of “two months” might be 59, 60, 61, or 62 days depending on the particular time context. This implies that the exact length of spans within irregular granularities can only be determined exactly if the spans are related absolutely to the time domain (anchored). Otherwise, as a last resort, mean values might be used for calculations (e.g., mean month and mean year).

66

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-22.png)

**Figure 3.22** Span. Example of the span “four days” which is formed by four granules of the granularity *days*. (CC) By *The authors*.

In terms of visualizing time primitives, most of the previously given visualization examples are suited for time instants. The *Gantt chart* (↪ p. 253) is an example of a visualization technique that is designed particularly to show time intervals (see Figure 3.23).

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-23.png)

**Figure 3.23**: Gantt chart. Example of a visualization technique capable of representing intervals. The tasks of a project plan are displayed as a list in the left part of the diagram. For each task, a horizontal bar (timeline) displays the extent of the task in time. (CC) By *The authors*.

**Relations between time primitives** Between individual time primitives, relations might exist. Temporal relations are important concepts, especially when reasoning about time (see Peuquet, 1994). Depending on the involved types of primitives, different relations make sense.

Between two instants *x* and *y*, three relationships are possible (see Figure 3.24):

- *x* before *y*
- *x* after *y*
- *x* equals *y*

Similarly, for time spans, which are amounts of time, there are three possible relations. Given two time spans *s* and *t*, one of the following relations can hold: **s* shorter than *t*, *s* longer than *t*, or *s* as long as *t**.

For relations between time intervals *A* and *B*, things get more complex. Allen (1983) defined a set of thirteen basic relations that are very common in time modeling (see Figure 3.25):

67

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-24.png)

**Figure 3.24** Instant relations. Instants can be related in three different ways. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-25.png)

**Figure 3.25** Interval relations. Intervals can be related in thirteen different ways. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-26.png)

**Figure 3.26** Instant+interval relations. Instants and intervals can be related in eight different ways. (CC) By *The authors*.

68

- *A* before *B* (or *B* after *A*): Interval *A* ends before interval *B* starts.
- *A* meets *B* (or *B* met-by *A*): Interval *A* ends right when interval *B* starts.
- *A* overlaps *B* (or *B* overlapped-by *A*): Intervals *A* and *B* overlap whereas interval *A* ends during interval *B*.
- *A* starts *B* (or *B* started-by *A*): Intervals *A* and *B* start at the same time but interval *A* ends earlier.
- *A* during *B* (or *B* contains *A*): Interval *A* starts later than interval *B* and ends before interval *B* ends.
- *A* finishes *B* (or *B* finished-by *A*): Interval *A* and *B* end at the same time but interval *A* starts later.
- *A* equals *B*: Intervals *A* and *B* start and end at the same time.

When looking at relations between an instant *x* and an interval *A*, eight options exist (see Figure 3.26):

- *x* before *A* (or *A* after *x*): Instant *x* is before the start of interval *A*.
- *x* starts *A* (or *A* started-by *x*): Instant *x* and the start of interval *A* are the same.
- *x* during *A* (or *A* contains *x*): Instant *x* is after the start and before the end of interval *A*.
- *x* finishes *A* (or *A* finished-by *x*): Instant *x* and the end of interval *A* are the same.

**Determinacy: determinate vs. indeterminate** In addition to the set of possible relations, further design aspects are relevant in the context of time-oriented data. Uncertainty is one such aspect. If there is no complete or exact information about time specifications or if time primitives are converted from one granularity to another, uncertainties are introduced and have to be dealt with. Therefore, the *determinacy* of the given time specification needs to be considered.

A determinate specification is present when there is complete knowledge of all temporal aspects. Prerequisites for determinate specification are either a continuous time domain or only a single granularity within a discrete time domain. Information that is temporally indeterminate can be characterized as *don’t know when* information, or more precisely, *don’t know exactly when* information (see Jensen et al., 1998). Examples of this are inexact knowledge (e.g., “time when the earth was formed”), future planning data (e.g., “it will take 2-3 weeks”), or imprecise event times (e.g., “one or two days ago”).

Notice that temporal indeterminacy as well as the relativity of references to time are mainly qualifications of statements rather than of the events they denote. Indeterminacy might be introduced by explicit specification (e.g., earliest beginning and latest beginning of an interval) or is implicitly present in the case of multiple granularities. Consider for example the statement “Activity A started on July 25, 2022 and ended on July 31, 2022” – this statement can be modeled by the beginning instant “July 25, 2022” and the end instant “July 31, 2022” both at the granularity of *days*. If we look at this interval from a granularity of hours, the interval might begin and end at any point in time between 0 a.m. and 12 p.m. of the specified day (see Figure 3.27).

69

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-27.png)

**Figure 3.27**: Indeterminacy. Implicit indeterminacy when representing the interval [July 25, 2022 July 31, 2022] that is given at a granularity of *days* on the finer granularity of *hours*. (CC) By *The authors*.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-28.png)

**Figure 3.28**: PlanningLines allow the depiction of temporal indeterminacy via a glyph consisting of two encapsulated bars representing minimum and maximum duration. The bars are bounded by two caps that represent the start and end intervals. (CC) By *The authors. Adapted from Aigner et al. (2005)*.

70

Examples of time models that consider temporal indeterminacy are HMAP4 by Combi and Pozzi (2001) and the time model underlying the time annotations used in the medical treatment plan specification language Asbru by Shahar et al. (1998). A visualization technique capable of depicting temporal indeterminacy is for example *PlanningLines* (see Figure 3.28 and ↪ p. 260).

## 3.2 Characterizing Data

After discussing the question of modeling the time domain itself, we now move on to the question of characterizing time-oriented data. When we speak of time-oriented data, we basically mean data that are somehow connected to time. More precisely, we consider data values that are associated with time primitives.

The available modeling approaches are manifold and range from considering continuous to discrete data models (see Tory and Möller, 2004). In the former case, time is seen as an observational space and data values are given relative to it (e.g., a time series in form of time-value pairs (*t*, *v*)). For the latter, data are modeled as objects or entities which have attributes that are related to time (e.g., calendar events with attributes *beginning* and *end*). Moreover, certain analytic situations even demand domain transformations, such as a transformation from the time domain into the frequency domain (Fourier transformation).

A useful concept for modeling time-oriented data along cognitive principles is the *pyramid framework* (see Figure 3.29) by Mennis et al. (2000), which has already been mentioned briefly in Section 1.1. The model is based on the three perspectives location (*where* is it?), time (*when* is it?), and theme (*what* is it made of?) at the level of data.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-29.png)

**Figure 3.29** Pyramid framework. Data are conceptualized along the three perspectives of location, time, and theme. Derived interpretations form objects on the cognitively higher level of knowledge. (CC) By *The authors. Adapted from Mennis et al. (2000)*.

4 The word HMAP is not an abbreviation, but it is the transliteration of the ancient Greek poetical word day.

71

Derived interpretations of these data aspects form objects (*what* is it?) on the cognitively higher level of knowledge, along with their taxonomy (classification; super-/subordinate relationships) and partonomy (interrelationships; part-whole relationships).

Depending on the phenomena under consideration and the purpose of the analysis, different points of view can be taken. An example of this would be considering distinct conceptual entities that are related to time (objects) vs. the observation of a continuous phenomenon, like temperature over time (values). There cannot be a single model that is ideal for all kinds of applications. However, certain fundamental design alternatives can be identified to characterize time-oriented data. In the context of this book, we focus on the data component, i.e., the lower part of the pyramid framework as depicted in Figure 3.29.

**Scale: quantitative vs. qualitative** In terms of data scale, we distinguish between quantitative and qualitative variables. Quantitative variables are based on a metric (discrete or continuous) range that allows numeric comparisons. In contrast, the scale of qualitative variables includes an unordered (nominal) or ordered (ordinal) set of data values. It is of fundamental importance to consider the characteristics of the data scale to design appropriate visual representations.

**Frame of reference: abstract vs. spatial** It further makes sense to distinguish abstract and spatial data. By abstract data we mean a data model that does not include the *where* aspect with regard to the pyramid framework, i.e., abstract data are not connected per se to some spatial location. In contrast to this, spatial data contain an inherent spatial layout, i.e., the underlying data model includes the *where* aspect. The distinction between abstract and spatial data reflects the way in which time-oriented data should be visualized. For spatial data, the inherent spatial information can be exploited to find a suitable mapping of data to screen. The *when* aspect has to be incorporated into that mapping, where it is not always easy to achieve an emphasis on the time domain. For abstract data, no a-priori spatial mapping is given. Thus, first and foremost an expressive spatial layout has to be found. This spatial layout should be defined such that the time domain is exposed.

**Kind of data: events vs. states** This criterion refers to the question of whether events or states are dealt with. Events can be seen as markers of state changes, like for example the departure of a plane. States can be characterized as phases of continuity between events (e.g., plane is in the air). As one can see, states and events are two sides of the same coin. However, it should be clearly communicated whether states or events, or even a combination of both, are visualized.

**Number of variables: single vs. multiple** This criterion concerns the number of time-dependent variables. In principle, it makes a difference if we have to represent data where each time primitive is associated with only one single data value (i.e., univariate data) or if multiple data values (i.e., multivariate data) must be represented. Compared to univariate data, for which many methods have been developed, the range of methods applicable for multivariate data is substantially smaller.

72

## 3.3 Relating Data & Time

Aspects regarding time dependency of data have been extensively examined in the field of temporal databases (see Liu and özsu, 2018). Here, we adapt the notions and definitions developed in that area. According to Steiner (1998), any dataset is related to two temporal domains:

- internal time *T**i* and
- external time *T**e*.

*Internal time* is considered to be the temporal dimension inherent in the data model. Internal time describes when the information contained in the data is valid. Conversely, *external time* is considered to be extrinsic to the data model. The external time is necessary to describe how a dataset evolves over time. Depending on the number of time primitives in internal and external time, time-related datasets can be classified as shown in Figure 3.30.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-30.png)

**Figure 3.30** Temporal characteristics of data. A dataset is related to the two temporal domains internal time *T**i* and external time *T**e*. (CC) By *The authors. Adapted from Steiner (1998)*.

**Static non-temporal data** If both internal and external time are each comprised of only a single time primitive, the data are completely independent of time. A fact sheet containing data about the products offered by a company is an example of static non-temporal data. This kind of data is not addressed in this book.

**Static temporal data** If the internal time contains more than one time primitive, while the external time contains only one, then the data can be considered dependent on time. Since the values stored in the data depend on the internal time, static temporal data can be understood as a historical view of how the real world or some model developed over time.

73

Common time series are a prominent example of static temporal data. Most of today’s visualization approaches that explicitly consider time as a special data dimension address static temporal data, for instance, the TimeSearcher (see Hochheiser and Shneiderman (2004) and ↪ p. 290).

**Dynamic non-temporal data** If the internal time contains only one, but the external time is composed of multiple time primitives, then the data depend on the external time. To put it simply, the data themselves change over time, i.e., they are dynamic. Dynamic data that change at high rate are often referred to as *streaming data*. Since the internal time is not considered, only the current state of the data is preserved; no historical view is maintained. There are fewer visualization techniques available that explicitly focus on dynamic non-temporal data. These techniques are mostly applied in monitoring scenarios, for instance, to visualize process data (see Matković et al. (2002) and ↪ p. 331). However, since internal time and external time can usually be mapped from one to the other, some of the known visualization techniques for static temporal data can be applied for dynamic non-temporal data as well.

**Dynamic temporal data** If both internal and external time are comprised of multiple time primitives, then the data are considered to be bi-temporally dependent. In other words, the data contain variables depending on (internal) time, and the actual state of the data changes over (external) time. Usually, in this case, internal and external time are strongly coupled and can be mapped from one to the other. Examples of such data could be health data or climate data that contain measures depending on time (e.g., daily number of cases of influenza or daily average temperature), and that are updated every 24 hours with new data records of the passed day. An explicit distinction between internal and external time is usually not made by current visualization approaches, because considering both temporal dimensions for visualization is challenging. Therefore, dynamic temporal data are beyond the scope of this book.

## 3.4 Considering Data Quality

[Section omitted]

76

## 3.5 Summary

In this chapter, we structured and specified the characteristics of time and time-oriented data. We considered four perspectives: the dimension of time, the characteristics of data, the relation of time and data, and the quality of time-oriented data. Figures 3.32 and 3.33 summarize these perspectives and their corresponding aspects.

The first perspective mainly addressed time and the complexity of modeling time. We clarified the concepts of scale, scope, arrangement, and viewpoints of time and then discussed granularity and calendars, time primitives, temporal relations, and temporal determinacy. Building upon this understanding of time and its models, the second perspective focused on relevant aspects of the data variables. Specifically, we discussed the data scale, the frame of reference, the kind of data, and the number of variables. The third perspective showed us how time and data are related. We presented basic options of how data variables can be linked to internal and external time. Finally, we looked at time-oriented data from a quality perspective. Here, we considered a taxonomy of single-source and multi-source data quality problems and briefly outlined the process of data cleaning.

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-32.png)

**Figure 3.32**: Design aspects of the dimension of time. (CC) By *The authors*.

77

![](https://skill.web.webis.de/static/reading/images/papers/Aigner_fig_3-33.png)

**Figure 3.33**: Design aspects of time-oriented data. (CC) By *The authors*.

The key take-home message of this chapter is that all of these perspectives need to be considered when visualizing and analyzing data that are related to time. We took the rather hard road through the data jungle, which required the reader to digest a number of models, characterizations, and quality concerns, because we are convinced that developing visualization methods specifically for time-oriented data requires a clear understanding of the specifics of such data. A data modeling concept and reference implementation to support these special characteristics is TimeBench by Rind et al. (2013a). It provides foundational data structures and algorithms for time-oriented data in visual analytics.

Given this book’s focus on time aspects, we did not discuss other issues regarding data structures and the relationships between different data variables that are not strictly related to time. We are aware that the relationships between data variables are of importance as well.

78

These aspects have been widely discussed in database and data modeling theories. Also, many useful modeling alternatives and reference models have been developed and can be adopted, such as continuous models using scalars, vectors, or tensors, etc. (see Wright, 2007) or discrete models using structures like trees, graphs, etc. (see Shneiderman, 1996).

While this chapter was concerned with the data to be visualized, the next chapter, we will discuss how time and time-oriented data can actually be represented visually.

## References

Aigner, W., S. Miksch, B. Thurnher, and S. Biffl (2005). “PlanningLines: Novel Glyphs for Representing Temporal Uncertainties and Their Evaluation”. In: Proceedings of the International Conference Information Visualisation (IV). IEEE Computer Society, pp. 457–463. doi: 10.1109/IV.2005.97.Allen, J. F. (1983). “Maintaining Knowledge about Temporal Intervals”. In: Communications of the ACM 26.11, pp. 832–843. doi: 10.1145/182.358434.Arbesser, C., F. Spechtenhauser, T. Mühlbacher, and H. Piringer (2017). “Visplause: Visual Data Quality Assessment of Many Time Series Using Plausibility Checks”. In: IEEE Transactions on Visualization and Computer Graphics 23.1, pp. 641– 650. doi: 10.1109/tvcg.2016.2598592.Bernard, J., T. Ruppert, O. Goroll, T. May, and J. Kohlhammer (2012). “Visual-Interactive Preprocessing of Time Series Data”. In: Proceedings of the Annual Conference of the Swedish Computer Graphics Association (SIGRAD). 81. Linköping University Electronic Press, pp. 39–48. url: https://ep.liu.se/ ecp/081/006/ecp12081006.pdf.Bettini, C., S. Jajodia, and X. S. Wang (2000). Time Granularities in Databases, Data Mining, and Temporal Reasoning. 1st edition. Springer. doi: 10.1007/978-3-662-04228-1.Cleveland, W. S. (1993). Visualizing Data. Hobart Press.Combi, C. and G. Pozzi (2001). “HMAP – A Temporal Data Model Managing Intervals with Different Granularities and Indeterminacy from Natural Language Sentences”. In: The VLDB Journal 9.4, pp. 294–311. doi: 10 . 1007 / s007780100033.Dudek, I. and J.-Y. Blaise (2013). “Visualising Time with Multiple Granularities: A Generic Framework”. In: Proceedings of the Annual Conference of Computer Applications and Quantitative Methods in Archaeology. Amsterdam University Press, pp. 470–481. doi: 10.1515/9789048519590-050.Dyreson, C. E., W. S. Evans, H. Lin, and R. T. Snodgrass (2000). “Efficiently Supporting Temporal Granularities”. In: IEEE Transactions on Knowledge and Data Engineering 12.4, pp. 568–587. doi: 10.1109/69.868908.Frank, A. U. (1998). “Different Types of “Times” in GIS”. In: Spatial and Temporal Reasoning in Geographic Information Systems. Edited by Egenhofer, M. J. and Golledge, R. G. Oxford University Press, pp. 40–62.

79

Furia, C. A., D. Mandrioli, A. Morzenti, and M. Rossi (2010). “Modeling Time in Computing: A Taxonomy and a Comparative Survey”. In: ACM Computing Surveys 42.2, 6:1–6:59. doi: 10.1145/1667062.1667063.Furia, C. A., D. Mandrioli, A. Morzenti, and M. Rossi (2012). Modeling Time in Computing. Springer. doi: 10.1007/978-3-642-32332-4.Goralwalla, I. A., M. T. özsu, and D. Szafron (1998). “An Object-Oriented Framework for Temporal Data Models”. In: Temporal Databases: Research and Practice. Edited by Etzion, O., Jajodia, S., and Sripada, S. Springer, pp. 1–35. doi: 10.1007/bfb0053696.Gschwandtner, T., W. Aigner, S. Miksch, J. Gärtner, S. Kriglstein, M. Pohl, and N. Suchy (2014). “TimeCleanser: A Visual Analytics Approach for Data Cleansing of Time-oriented Data”. In: Proceedings of the International Conference on Knowledge Technologies and Data-driven Business (i-KNOW). ACM Press, pp. 1– 8. doi: 10.1145/2637748.2638423.Gschwandtner, T., J. Gärtner, W. Aigner, and S. Miksch (2012). “A Taxonomy of Dirty Time-Oriented Data”. In: Multidisciplinary Research and Practice for Information Systems. Edited by Quirchmayr, G., Basl, J., You, I., Xu, L., and Weippl, E. Springer, pp. 58–72. doi: 10.1007/978-3-642-32498-7_5.Hajnicz, E. (1996). Time Structures: Formal Description and Algorithmic Representation. Vol. 1047. Lecture Notes in Computer Science. Springer. doi: 10.1007/ 3-540-60941-5.Harris, R. L. (1999). Information Graphics: A Comprehensive Illustrated Reference. Oxford University Press. url: https://global.oup.com/academic/ product/information-graphics-9780195135329.Hochheiser, H. and B. Shneiderman (2004). “Dynamic Query Tools for Time Series Data Sets: Timebox Widgets for Interactive Exploration”. In: Information Visualization 3.1, pp. 1–18. doi: 10.1057/palgrave.ivs.9500061.Huynh, D. (2021). OpenRefine. url: https : / / openrefine . org/ (visited on 02/26/2021).Jensen, C. S., C. E. Dyreson, M. H. Böhlen, J. Clifford, R. Elmasri, S. K. Gadia, F. Grandi, P. J. Hayes, S. Jajodia, W. Käfer, N. Kline, N. A. Lorentzos, Y. G. Mitsopoulos, A. Montanari, D. A. Nonen, E. Peressi, B. Pernici, J. F. Roddick, N. L. Sarda, M. R. Scalas, A. Segev, R. T. Snodgrass, M. D. Soo, A. U. Tansel, P. Tiberio, and G. Wiederhold (1998). “The Consensus Glossary of Temporal Database Concepts – February 1998 Version”. In: Temporal Databases: Research and Practice. Edited by Etzion, O., Jajodia, S., and Sripada, S. Springer, pp. 367– 405. doi: 10.1007/bfb0053710.Kim, W., B.-J. Choi, E.-K. Hong, S.-K. Kim, and D. Lee (2003). “A Taxonomy of Dirty Data”. In: Data Mining and Knowledge Discovery 7.1, pp. 81–99. doi: 10.1023/a:1021564703268.Lee, J. Y., R. Elmasri, and J. Won (1998). “An Integrated Temporal Data Model Incorporating Time Series Concept”. In: Data and Knowledge Engineering 24.3, pp. 257–276. doi: 10.1016/S0169-023X(97)00034-7.Lenz, H. (2005). Universalgeschichte der Zeit. Wiesbaden, Germany: Marixverlag, p. 575.

80

Liu, L. and M. T. Özsu, eds. (2018). Encyclopedia of Database Systems. 2nd edition. Springer. doi: 10.1007/978-1-4614-8265-9.Matković, K., H. Hauser, R. Sainitzer, and E. Gröller (2002). “Process Visualization with Levels of Detail”. In: Proceedings of the IEEE Symposium Information Visualization (InfoVis). IEEE Computer Society, pp. 67–70. doi: 10 . 1109 / INFVIS.2002.1173149.Mennis, J. L., D. J. Peuquet, and L. Qian (2000). “A Conceptual Framework for Incorporating Cognitive Principles into Geographical Database Representation”. In: International Journal of Geographical Information Science 14.6, pp. 501– 520. doi: 10.1080/136588100415710.Mintz, D., T. Fitz-Simons, and M. Wayland (1997). “Tracking Air Quality Trends with SAS/GRAPH”. In: Proceedings of the 22nd Annual SAS User Group International Conference (SUGI). SAS, pp. 807–812. url: https://support.sas. com/resources/papers/proceedings/proceedings/sugi22/INFOVIS/ PAPER173.PDF.Müller, H. and J.-C. Freytag (2003). Problems, Methods, and Challenges in Comprehensive Data Cleansing. Tech. rep. HUB-IB-164. Humboldt University Berlin.Peuquet, D. J. (1994). “It’s about Time: A Conceptual Framework for the Representation of Temporal Dynamics in Geographic Information Systems”. In: Annals of the Association of American Geographers 84.3, pp. 441–461. doi: 10.1111/j.1467-8306.1994.tb01869.x.Peuquet, D. J. (2002). Representations of Space and Time. The Guilford Press.Rahm, E. and H. H. Do (2000). “Data Cleaning: Problems and Current Approaches”. In: IEEE Data Engineering Bulletin 23.4, pp. 3–13. url: http : / / sites . computer.org/debull/A00DEC-CD.pdf.Rind, A., T. Lammarsch, W. Aigner, B. Alsallakh, and S. Miksch (2013a). “TimeBench: A Data Model and Software Library for Visual Analytics of Time-Oriented Data”. In: IEEE Transactions on Visualization and Computer Graphics 19.12, pp. 2247–2256. doi: 10.1109/TVCG.2013.206.Shahar, Y., S. Miksch, and P. Johnson (1998). “The Asgaard Project: A Task-Specific Framework for the Application and Critiquing of Time-Oriented Clinical Guidelines”. In: Artificial Intelligence in Medicine 14.1-2, pp. 29–51. doi: 10.1016/ s0933-3657(98)00015-3.Shneiderman, B. (1996). “The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations”. In: Proceedings of the IEEE Symposium on Visual Languages. IEEE Computer Society, pp. 336–343. doi: 10.1109/VL.1996. 545307.Steele, J. and N. Iliinsky (2010). Beautiful Visualization: Looking at Data through the Eyes of Experts. O’Reilly Media, Inc.Steiner, A. (1998). “A Generalisation Approach to Temporal Data Models and their Implementations”. PhD thesis. Swiss Federal Institute of Technology.Tableau Software (2021). Tableau Prep. url: https://www.tableau.com/products/prep (visited on 02/26/2021).

81

Tominski, C., J. Abello, and H. Schumann (2004). “Axes-Based Visualizations with Radial Layouts”. In: Proceedings of the ACM Symposium on Applied Computing (SAC). ACM Press, pp. 1242–1247. doi: 10.1145/967900.968153.Tory, M. and T. Möller (2004). “Rethinking Visualization: A High-Level Taxonomy”. In: Proceedings of the IEEE Symposium Information Visualization (InfoVis). IEEE Computer Society, pp. 151–158. doi: 10.1109/INFVIS.2004.59.Trifacta (2021). Trifacta Wrangler. url: https://www.trifacta.com/ (visited on 02/26/2021).Whitrow, G. J., J. T. Fraser, and M. P. Soulsby (2003). What is Time? The Classic Account of the Nature of Time. Oxford University Press.Wolter, M., I. Assenmacher, B. Hentschel, M. Schirski, and T. Kuhlen (2009). “A Time Model for Time-Varying Visualization”. In: Computer Graphics Forum 28.6, pp. 1561–1571. doi: 10.1111/j.1467-8659.2008.01314.x.Wright, H. (2007). Introduction to Scientific Visualization. Springer. doi: 10.1007/ 978-1-84628-755-8.

5560657080

What are the core ideas in the text? Write down the points here.
