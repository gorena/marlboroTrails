/********************************************
 * draw_MarlboroMap.js
 *
 *  reads in a csv of point coordinates, uses 
 *  Mapbox and the JS library Leaflet to render 
 *  a map of the Marlboro trail system and make 
 *  it interactive
 * 
 *  By Anna Goren, with editing assistance from Jim Mahoney
 *  March 2015 | MIT License
 ********************************************/
 /* use circle rather than marker for buildings */
 /* git problem solver: $ export GIT_SSH=/usr/bin/ssh.exe */
 
/* debugging */
var trails; 
/* var name; */
/* Convert Papa.parse cvs result and call draw_trails to render it. */
function convert_and_draw(results){
    var data = results.data; /* in form [{'X':-72,'Y':42,'id':8982,'name':'TT'}] */
    trails = {};
    for (var i=0; i < data.length; i++){   
	    var line = data[i];        
	    var trailname = line.name; 
        var x = line.X;            
	    var y = line.Y;   
	    if (!trails[trailname]){
	        trails[trailname] = [];
	    };
	    trails[trailname].push([y,x]);
    };
    draw_trails(trails);
}

/* for debugging purposes */
 var trail_info = {
	'Ho Chi Minh Trail':{trail: 'Ho Chi Minh', mileage: 'mileage', description: 'Short description here.' },
    'Lower Loop':{trail: 'Lower Loop', mileage: 'mileage', description: 'Short description here.' },
    'Town Trail':{trail: 'Town Trail', mileage: 'mileage', description: 'Short description here.' },
	'Ridge Trail':{trail: 'Ridge Trail', mileage: 'mileage', description: 'Short description here.' },
	'Old Oaks Trail':{trail: 'Old Oaks Trail', mileage: 'mileage', description: 'Short description here.' },
	'cot2oaks':{trail: '', mileage: 'mileage', description: 'Connects Cottage Land to Old Oaks Trail' },		
	'cot2lot':{trail: '', mileage: 'mileage', description: 'Connects Cottage Land to parking lot' },			
	}; 

var building_labels = {
	'Dining Hall': {name:'Dining Hall' ,coords: [42.83915, -72.73528]},
	'Mather': {name: 'Mather',coords:[42.83903, -72.73478]},
	'Admissions': {name:'Admissions', coords:[42.83872, -72.73512]},
	'Apple Tree': {coords:[42.83845, -72.73541]},
	'Gander': {coords:[42.83824, -72.73516]},
	'Woodard': {coords:[42.83815, -72.73567]},
	'Baber': {coords:[42.83799, -72.73593]},
	'Hendricks': {coords:[42.83873, -72.73578]},
	'Half Way': {coords:[42.83865, -72.73628]},
	'All the Way': {coords:[42.83862, -72.73663]},
	'Dalrymple': {coords:[42.83912, -72.73634]},
	'The OP': {coords:[42.83951, -72.73568]},
	'Campus Center': {coords:[42.83974, -72.73516]},
	'Happy Valley': {coords:[42.83990, -72.73591]},
	'Library': {coords:[42.83977, -72.73657]},
	'Howland': {coords:[42.83899, -72.73707]},
	'The Trailer': {coords:[42.83907, -72.73758]},
	'The Science Building': {coords:[42.83978, -72.73714]},
	'Out of the Way': {coords:[42.84057, -72.73727]},
	'Schrader': {coords:[42.84018, -72.73622]},
	'Random North': {coords:[42.84041, -72.73524]},
	'Random South': {coords:[42.84016, -72.73527]},
	'Maintenance': {coords:[42.83730, -72.73388]},
	'Serkin': {coords:[42.84031, -72.73400]},
	'Whittemore Theater and Drury Gallery': {coords:[42.83982, -72.73361]},
	'Persons Auditorium': {coords:[42.83869, -72.73236]},
	'Married Student Housing': {coords:[42.83827, -72.73120]},
	};

var line_format;
/*var building;*/
	
/* Renders Marlboro map and draws interactive trails */
function draw_trails(trails){
    /*L.mapbox.accessToken = 'pk.eyJ1IjoiYWdvcmVuIiwiYSI6IlZVOFNYZmMifQ.eZrLlPh-oui4lDhkEfCNYw';*/
    var map = L.map('marlboro_map').setView([42.8388, -72.7340], 13);
    L.tileLayer(
	    'https://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}',
        {attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
		subdomains: ['a','b','c','d'],
		token: 'pk.eyJ1IjoiYWdvcmVuIiwiYSI6IlZVOFNYZmMifQ.eZrLlPh-oui4lDhkEfCNYw',
		mapId: 'agoren.ll46lblc',
        minZoom: 13, }).addTo(map);
    line_format = {color: '#999999', opacity: 1.0, clickable: true, weight: 4, dashArray: '8,5',};
	/*map.on('zoomend', function(e){
	    if(map.getzoom === 14){
	    line_format.weight: 4.5
	    }
		else if (map.getZoom > 15){
	    line_format.weight: 7
	    }
    });*/ 
	/*if (map.getZoom === 13){
	    line_format.weight = 3.5
	};*/	
    /*if (map.getZoom === 14){
	    line_format.weight = 4.5
	};*/
	/*if (map.getZoom === 15){
	    line_format.weight = 5.5
	};*/
    /*if (map.getZoom > 15){
	    line_format.weight = 7
	};*/	
	for (var name in trails){
	    /*if (!trails.hasOwnProperty(trailname)){ continue; } */
	    var polyline = L.polyline(trails[name], line_format).addTo(map);
	    /* increase line transparency on scroll-over*/
	    polyline.on('mouseover',   
		    function scrollOver(e){e.target.setStyle({opacity: 0.5})});
	    /* reset transparency on scroll-out*/ 		
	    polyline.on('mouseout',    
		    function scrollOut(e){e.target.setStyle({opacity: 1.0})});	
	    /* binds a click-automated pop-up to the trails that have a mileage and description */
	    var tName = trail_info[name].trail;
	    var tMile = trail_info[name].mileage;
	    var tDescrip = trail_info[name].description;
	    var tInfo = "<h2>" + tName + "</h2><h3>" + tMile + "</h3>" + tDescrip;
	    polyline.bindPopup(tInfo);
	    /* binds a scrollover popup to trails */
	    polyline.bindLabel(tName);
		/* static building labels */
      }; 
	/*if(map.getZoom === 18){  };*/
	for (var place in building_labels){
		/*var building_name = building_labels[place].name*/
		var coordinates = building_labels[place].coords;
	    var building = L.marker(coordinates, {opacity: 0.5});
		var label = new L.Label();
		label.setContent(building_labels[place].name);
		/*label.setLatLng(coordinates);*/
		/*building.bindLabel(building_name, */
			/*{nohide: true, className: "building-labels", offset: [0,0], */
		/*}); */
		/*map.bindLabel(label);*/
		/*map.showLabel(label);	 */
        building.bindLabel(label).addTo(map);		
	};
	

}

/* calls data into Papa Parse, runs when the page loads, 
   calls function to draw interactive map*/
function init(){
    Papa.parse('marlboroTrails2.csv',
	    { download: true, 
		header: true, 
		dynamicTyping: true,
		complete: convert_and_draw,
	    }
	);
}