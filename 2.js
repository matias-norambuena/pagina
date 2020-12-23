var width = 1100,
    height = 500,
    centered;

// Define color scale
var color = d3v3.scale.linear()
    .domain([1, 20])
    .clamp(true)
    .range(['#fff', '#409A99']);

var projection = d3v3.geo.mercator()
    .scale(110)
    // Center the Map
    .center([20, 4.5])
    .translate([width / 1.5, height / 2]);

var path = d3v3.geo.path()
    .projection(projection);

// Set svg width & height
var svg1 = d3v3.select('#mapa')
    .attr('id', '#hola1')
    .attr('width', width)
    .attr('height', height);

// Add background
svg1.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .on('click', clicked);

var g = svg1.append('g');

var effectLayer = g.append('g')
    .classed('effect-layer', true);

var mapLayer = g.append('g')
    .classed('map-layer', true);

var dummyText = g.append('text')
    .classed('dummy-text', true)
    .attr('x', 10)
    .attr('y', 30)
    .style('opacity', 0);

var bigText = g.append('text')
    .classed('big-text', true)
    .attr('x', 20)
    .attr('y', 45);

var url = "https://www.visualizaciondedatos.cl/wp-content/uploads/2020/12/geojsonmatiasn.txt"

// Load map data
d3v3.json(url, function (error, mapData) {

    // const features = mapData.features;
    const features = mapData.features;

    const arrayPaises = ["AUT", "BEL", "CZE", "DNK", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "JPN", "KOR", "LUX", "NLD", "NOR", "POL", "PRT", "SVK", "ESP", "SWE", "TUR", "GBR", "CHL", "CHN", "EST", "ROU", "RUS", "SGP", "SVN", "TWN", "USA", "LVA", "LTU"
    ];
    const arrayIndex = [11.2, 11.8, 7.6, 15.7, 14.5, 10.9, 9.7, 8.6, 8.1, 11.6, 6, 9.9, 15.3, 6.7, 10.3, 12.3, 7.2, 9.7, 6.8, 7.1, 14.8, 4.4, 9.4, 1.1, 2.4, 7.7, 2, 5.6, 10.6, 9.9, 13.5, 8.8, 3.8, 6.5];
    const invest = [];

    for (let i = 0; i < arrayPaises.length; i++) {
        invest.push({pais: arrayPaises[i], cantidad: arrayIndex[i]});
    }
    var realFeatureSize = d3v3.extent(invest, function (d) {
        return +d.cantidad
    });

    var newFeatureColor = d3v3.scale.quantize()
        .domain(realFeatureSize)
        .range(["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]);

    // Update color scale domain based on data
    color.domain([0, d3v3.max(features, nameLength)]);

    // Draw each province as a path
    mapLayer.selectAll('path')
        .data(features)
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .style("fill", d => {
            let investEncontrados;
            invest.forEach(function (e) {
                if (e.pais === d.id) {
                    investEncontrados = e.cantidad;
                }
            });

            console.log(investEncontrados)
            return newFeatureColor(investEncontrados)
        })
        .style("stroke", d => d3v3.rgb(newFeatureColor(d3v3.geo.area(d))).darker())
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', clicked);
});

const arrayPaises = ["AUT", "BEL", "CZE", "DNK", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "JPN", "KOR", "LUX", "NLD", "NOR", "POL", "PRT", "SVK", "ESP", "SWE", "TUR", "GBR", "CHL", "CHN", "EST", "ROU", "RUS", "SGP", "SVN", "TWN", "USA", "LVA", "LTU"
];
const arrayIndex = [11.2, 11.8, 7.6, 15.7, 14.5, 10.9, 9.7, 8.6, 8.1, 11.6, 6, 9.9, 15.3, 6.7, 10.3, 12.3, 7.2, 9.7, 6.8, 7.1, 14.8, 4.4, 9.4, 1.1, 2.4, 7.7, 2, 5.6, 10.6, 9.9, 13.5, 8.8, 3.8, 6.5];
const invest = [];

for (let i = 0; i < arrayPaises.length; i++) {
    invest.push({pais: arrayPaises[i], cantidad: arrayIndex[i]});
}

// Get country name
function nameFn(d) {
    return d * d.properties ? d.properties.name : null;
}
function siglas(d) {
    return d * d.properties ? d.id : null;
}

// Get country name length
function nameLength(d) {
    var n = nameFn(d);
    return n ? n.length : 0;
}


// When clicked, zoom in
function clicked(d) {
    var x, y, k;

    // Compute centroid of the selected path
    if (d * centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

}

function mouseover(d) {
    // Highlight hovered province
    d3v3.select(this).style('opacity', 0.7);

    // Draw effects

    let indice;
    invest.forEach(function (e) {
        if (e.pais === siglas(d)) {
            indice = e.cantidad;
        }
    })
    textArt(nameFn(d)+", N: "+indice);
}

function mouseout(d) {
    d3v3.select(this).style('opacity', 1);


    // Remove effect text
    effectLayer.selectAll('text').transition()
        .style('opacity', 0)
        .remove();

    // Clear province name
    bigText.text('');
}


var BASE_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

var FONTS = [
    "Open Sans"
];

function textArt(text) {
    // Use random font
    var fontIndex = Math.round(Math.random() * FONTS.length);
    var fontFamily = FONTS[fontIndex] + ', ' + BASE_FONT;

    bigText
        .style('font-family', fontFamily)
        .text(text);
}