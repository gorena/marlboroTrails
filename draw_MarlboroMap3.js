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
	'Apple Tree': {name: 'Apple Tree', coords:[42.83845, -72.73541]},
	'Gander': {name: 'Gander', coords:[42.83824, -72.73516]},
	'Woodard': {name:'Woodard', coords:[42.83815, -72.73567]},
	'Baber': {name:'Baber',coords:[42.83799, -72.73593]},
	'Hendricks': {name:'Hendricks',coords:[42.83873, -72.73578]},
	'Half Way': {name:'Half Way',coords:[42.83865, -72.73628]},
	'All the Way': {name:'All the Way',coords:[42.83862, -72.73663]},
	'Dalrymple': {name:'Dalrymple',coords:[42.83912, -72.73634]},
	'The OP': {name:'The OP',coords:[42.83951, -72.73568]},
	'Campus Center': {name:'Campus Center',coords:[42.83974, -72.73516]},
	'Happy Valley': {name:'Happy Valley',coords:[42.83990, -72.73591]},
	'Library': {name:'Library',coords:[42.83977, -72.73657]},
	'Howland': {name:'Howland',coords:[42.83899, -72.73707]},
	'The Trailer': {name:'The Trailer',coords:[42.83907, -72.73758]},
	'The Science Building': {name:'The Science Building', coords:[42.83978, -72.73714]},
	'Out of the Way': {name:'Out of the Way',coords:[42.84057, -72.73727]},
	'Schrader': {name:'Schrader',coords:[42.84018, -72.73622]},
	'Random North': {name:'Random North',coords:[42.84041, -72.73524]},
	'Random South': {name:'Random South',coords:[42.84016, -72.73527]},
	'Maintenance': {name:'Maintenance',coords:[42.83730, -72.73388]},
	'Serkin': {name: 'Serkin',coords:[42.84031, -72.73400]},
	'Whittemore Theater and Drury Gallery': {name:'Whittemore Theater and Drury Gallery',coords:[42.83982, -72.73361]},
	'Persons Auditorium': {name:'Persons Auditorium', coords:[42.83869, -72.73236]},
	'Married Student Housing': {name:'Married Student Housing', coords:[42.83869, -72.73124]},
	'cot1':{name:'Cottage 1', coords:[42.83904, -72.72756]},
	'cot2':{name: 'Cottage 2', coords:[42.83933, -72.72720]},
	'cot3':{name: 'Cottage 3', coords:[42.83916, -72.72829]},
	'cot4':{name:'Cottage 4', coords:[42.83943,-72.72802]},
	'cot5':{name:'Cottage 5', coords:[42.83746,-72.73149]},
	'cot6':{name:'Cottage 6', coords:[42.83746,-72.73117]},
	'cab1':{name: 'Cabin 1', coords:[42.83800,-72.72833]},
	'cab2':{name: 'Cabin 2', coords:[42.83867, -72.72804]},
	};
	
var pic_locations = {{pic: 'Ridge Trail/Stone Circle Fork',coords:[42.84572,-72.73505],url:'images/tt_stoneCirc.jpeg'},
                     {pic:'South Pond Fork',coords:[42.85588,-72.72985],url:'images/tt_southPond.jpeg'},
                     {pic:'End of Town Trail',coords:[42.85970,-72.72817],url:'images/tt_end.jpeg'},
					 {pic:'Lower Loop Steps',coords:[42.83707,-72.73309],url:'images/ll_steps.jpeg'},
					 {pic:'Lower Loop Trail Sign',coords:[42.83765,-72.73346],url:'images/ll_sign.jpeg'},
					 {pic:'Lower Loop Private Property Fork',coords:[42.83566,-72.73954],url:'images/ll_noEnter.jpeg'},
					 {pic:'South Pond Marlboro Residents Access Point',coords:[42.845802,-72.712984],url:'images/sp_access'},
                    }; 					 
/*var trails_polyline;
var line_format;
var weight;*/
/*var building;*/
	
/* Renders Marlboro map and draws interactive trails, building labels and picture pop-ups */
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
    var line_format = {color: '#999999', opacity: 1.0, clickable: true, weight: 3.5, dashArray: '8,5',};
	var circle_format = {color: 'blue', opacity:0, clickable: true, fill: 'blue', fillOpacity:0};
    var label_format = {noHide:true, offset:[0,0]}; /* add , className: "place-labels" if noHide works */
	var pic_format = {opacity: 1.0, clickable: true};
	/* storing the trail polylines to allow changes with zoom events */
    trails_polyline = {};	
	for (var name in trails){
	    /*if (!trails.hasOwnProperty(trailname)){ continue; } */
	    var polyline = L.polyline(trails[name], line_format).addTo(map);
	    /* increase line transparency on scroll-over*/
		trails_polyline[name] = polyline;
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
	
	/*test label
	var label = new L.Label();
	label.setContent(building_labels.Dalrymple.name);
	label.setLatLng(building_labels.Dalrymple.coords);
	map.showLabel(label);*/
	
	var building_dots = {};
	for (var place in building_labels){
	    /*var label = new L.Label();
	    label.setContent(building_labels[place].name);
		label.setLatLng(building_labels[place].coords);
		map.showLabel(label);*/
		
		var coordinates = building_labels[place].coords;
		var building = L.circle(coordinates, 2, circle_format);
		building_dots[place] = building;
		/*var label = new L.Label();
		label.setContent(building_labels[place].name);*/
		building.bindPopup(building_labels[place].name, label_format).addTo(map);
		
		/*var building_name = building_labels[place].name
		var coordinates = building_labels[place].coords;
	    var building = L.marker(coordinates, {opacity: 0.5});*/
		/*var label = new L.Label();*/
		/*building.bindLabel('label').addTo(map);*/
		/*var label = new L.Label();
		label.setContent(building_labels[place]);*/
		/*label.setLatLng(coordinates);*/
		/*building.bindLabel(building_name, */
			/*{nohide: true, className: "building-labels", offset: [0,0], */
		/*}); */
		/*map.bindLabel(label);*/
		/*map.showLabel(label);	 */
        /*building.bindLabel(label).addTo(map);	*/	
	};
    /* adds clickable markers with trail picture pop-ups */
    for(var pic in pic_locations){
        var trail_pic = new L.circleMarker(pic_format);	
	    var coords = pic_locations[pic].coords;
        trail_pic.setLatLng(coords);
        trail_pic.setRadius(2);
        		
    	trail_pic.bindPopup(pic_filler).addTo(map);	
    };	
	
	/* zoom event changes line and dash width as well as visibility of building markers */
	map.on('zoomend', function(e){
	    var zoom = map.getZoom();
		/*weight = line_format.weight;*/
		for (var name in trails_polyline){
		    var line = trails_polyline[name];
			if(zoom === 13){
			    line.setStyle({weight:3.5, dashArray: '8,5'});
			    /*weight = 3.5; */
				/*alert('zoom is' + zoom 'and weight is' + weight);*/
			};
			if(zoom === 14){
			    line.setStyle({weight:4.0, dashArray: '9,6'});
			};			
			if(zoom === 15){
			    line.setStyle({weight:4.5, dashArray: '10,7'});
			};
			if(zoom === 16){
			    line.setStyle({weight:5.0, dashArray: '10,7'});
			};
			if(zoom === 17){
			    line.setStyle({weight:6.0, dashArray: '10,7'});
			};
			if(zoom === 18){
			    line.setStyle({weight:7.5, dashArray: '10,7'});
			};
		};
		for (var building in building_dots){
		    var circle = building_dots[building];
		    if (zoom === 18){
			    circle.setStyle({opacity:1.0, clickable:true, fillOpacity:1.0});
			}
			else{
			    circle.setStyle({opacity:0, clickable:false, fillOpacity:0});
			};
		};
	    /*for (var place in building_labels){
	        var label = new L.Label();
	        label.setContent(building_labels[place].name);
		    label.setLatLng(building_labels[place].coords);
			if(zoom === 18){
		        map.showLabel(label);
			}
			else{
			    map.hideLabel();
			};
		};	*/
  
		/*alert('zoom is' + zoom);*/
	});
	

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