// Global Variables

let map;
let lat = 0;
let lon = 0;
let zl = 1;
let globaldata;

// path to csv data

let path = "data/shops.csv";

let shopmarkers = L.featureGroup();

let shops;

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
});

function createMap()
{
    map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

};

function flyToIndex(lat, lon){
	map.flyTo([lat,lon],12)
};

function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			globaldata = data;
			shops = globaldata.data;
			console.log(shops.Latitude)

			// map the data	
			mapCSV(shops, shopmarkers, '#1681c4', 'Shops');

			let layers = {
				"Shops": shopmarkers
			};

			//L.control.layers(null, layers).addTo(map);

		}
	})
};

function mapCSV(data, featuregroup, color, name){

	// icon
	var shopIcon = L.icon({
		iconUrl: 'icons/shops.png',
		iconSize: [30,30]
	})


	// loop through each entry
	data.forEach(function(item,index){
		// create marker
		let marker = L.marker([item.Latitude,item.Longitude],{icon: shopIcon})
		.on('mouseover', function(){
			this.bindPopup(`<h3>${item.Name}</h3><p>${item.Description}</p>`).openPopup()
		})

		// add marker to featuregroup		
		featuregroup.addLayer(marker)
	})

	// add featuregroup to map
	featuregroup.addTo(map);

	// fit markers to map
	map.fitBounds(featuregroup.getBounds());
};


