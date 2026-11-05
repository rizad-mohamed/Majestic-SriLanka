// Natural Earth 1:50m Admin-0, Sri Lanka, public domain.
// Equirectangular projection: x=(longitude-79.4)*92+65; y=(10-latitude)*92+10.
// Source and transformation are recorded in docs/ui-refinement.md.
export const islandPath =
  "M117.4,44.0L111.6,45.0L107.1,38.9L106.0,36.3L107.2,34.4L108.4,33.5L109.9,33.8L112.1,39.5L117.4,44.0ZM108.7,97.3L111.3,104.3L103.7,99.5L98.7,95.6L97.0,92.4L107.3,96.0L108.7,97.3ZM118.6,27.2L127.4,27.7L136.8,27.5L143.5,28.7L154.8,42.9L185.6,68.3L202.4,94.1L203.9,99.7L206.3,104.6L210.3,106.0L213.7,108.2L230.4,133.1L232.4,138.0L232.1,143.5L233.1,147.5L237.5,149.5L242.9,150.6L246.5,154.3L251.0,174.2L251.0,180.4L252.3,183.1L273.4,214.0L274.6,217.8L274.4,220.6L275.0,223.0L279.1,228.5L285.5,243.2L288.7,246.6L292.6,259.5L292.9,284.1L291.5,295.1L287.5,308.4L282.8,321.5L277.8,330.9L270.8,338.9L247.2,355.8L240.4,359.2L209.5,369.9L186.8,379.9L165.8,382.7L144.8,377.1L129.0,363.9L120.9,344.5L115.3,324.2L107.3,301.7L101.1,232.2L98.1,212.7L93.3,188.0L93.8,177.2L97.2,166.9L97.2,189.5L100.3,192.3L102.6,189.4L104.7,166.0L106.5,156.1L114.8,130.4L115.0,125.8L113.6,116.1L113.7,111.3L126.2,93.2L129.4,82.7L131.1,71.9L130.4,60.3L128.1,48.8L138.2,52.5L143.8,56.5L149.5,59.2L154.1,57.8L159.6,57.8L155.7,51.5L143.9,45.8L124.4,42.2L118.3,37.7L116.0,33.7L117.2,29.1L118.6,27.2Z";

// Approximate destination positions; connections illustrate ideas, not roads.
export const mapPlaces = [
  {
    id: "sigiriya",
    name: "Sigiriya",
    x: 190.1,
    y: 198.6,
    interest: "culture",
    title: "Culture & Heritage",
    description: "Ancient cities, local encounters and the Cultural Triangle.",
    route: "M190.1 198.6 Q164 230 179.1 259.3",
    side: "right",
  },
  {
    id: "ella",
    name: "Ella",
    x: 216.8,
    y: 298,
    interest: "tea",
    title: "Hill Country & Tea",
    description: "Tea terraces, scenic rail journeys and unhurried mornings.",
    route: "M179.1 259.3 Q228 258 216.8 298",
    side: "right",
  },
  {
    id: "galle",
    name: "Galle",
    x: 140.4,
    y: 375.2,
    interest: "beaches",
    title: "Beaches & Coast",
    description: "Coastal towns, local food and slow days beside the ocean.",
    route: "M216.8 298 Q204 354 140.4 375.2",
    side: "left",
  },
];
