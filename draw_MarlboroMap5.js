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

 
/* debugging */
var trails;  
/* var name; */

/* Converts Papa.parse cvs result and call draw_trails to render it on map */
function convert_and_draw(results){
    var data = results.data; /* in form [{'X':-72,'Y':42,'id':8982,'name':'Town Trail'}] */
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

/* setting object lists as global variables for debugging purposes */
/* works the same when these variables are included in the draw_trails function */
 var trail_info = {
	'Ho Chi Minh Trail':{trail: 'Ho Chi Minh', mileage: '1.75 Miles', description: 'Ho Chi Minh Trail runs downhill from Town Trail and meets Moss Hollow Rd a short uphill walk from Marlboro College. The trail is generally has several wet patches and it is best to avoid skiing Ho Chi Minh until until these patches have frozen over.' },
    'Lower Loop':{trail: 'Lower Loop', mileage: '2 Miles', description: 'Lower Loop runs through private property but this portion can be avoided (the route shown on this map) by taking the access road up to Musicians\' Way drive. Wetlands Loop is accessible en-route; however, it has not been groomed in recent years and will require some bush-whacking.' },
    'Town Trail':{trail: 'Town Trail', mileage: '1.5 Miles', description: 'As the name suggests, Town Trail connects Marlboro College to Marlboro town center. The trail has little elevation change and is good for cross country ski beginners.' },
	'Ridge Trail':{trail: 'Ridge Trail', mileage: '0.8 Miles', description: 'Although relatively short, Ridge Trail provides access to the Stone Circle, the Observatory, and the tree house - each of which is a short detour from the main trail.' },
	'Old Oaks Trail':{trail: 'Old Oaks Trail', mileage: '', description: 'Old Oaks Trail passes a vernal pool and large oak trees. The trail shown here includes a portion on Squirrel Loop (not shown on map).' },
	'cot2oaks':{trail: '', mileage: '', description: 'This trail is a portion of Squirrel Loop (not shown on map). It connects Cottage Land to Old Oaks Trail.' },		
	'cot2lot':{trail: '', mileage: '', description: 'This trail connects Cottage Land to the middle parking lot.' },			
	'South Pond Loop':{trail:'South Pond Loop', mileage:'',description:'South Pond Loop runs from cottage land to Town Trail. Since this trail crosses through private property, it is not open to non-Marlboro residents. In the winter, South Pond Loop is regularly groomed for cross country skiing.'},
	'South Pond XC':{trail:'South Pond Cross Country Ski Detour', mileage:'', description:'In the winter, the groomed ski loop runs accross South Pond.'}, 
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
	'cot4':{name: 'Cottage 4', coords:[42.83916, -72.72829]},
	'cot3':{name:'Cottage 3', coords:[42.83943,-72.72802]},
	'cot5':{name:'Cottage 5', coords:[42.83746,-72.73149]},
	'cot6':{name:'Cottage 6', coords:[42.83746,-72.73117]},
	'cab1':{name: 'Cabin 1', coords:[42.83800,-72.72833]},
	'cab2':{name: 'Cabin 2', coords:[42.83867, -72.72804]},
	'soccer':{name: 'Soccer Field', coords:[42.83915,-72.73289]},
	};
	
var pic_locations = {'rt_fork':{pic: 'Ridge Trail/Stone Circle Fork',coords:[42.84572,-72.73505],url:'images/tt_stoneCirc', burl:'images/ttB_stoneCirc'},
                     'sp_fork':{pic:'South Pond Fork',coords:[42.85588,-72.72985],url:'images/tt_southPond', burl:'images/ttB_southPond'},
                     'end_tt':{pic:'End of Town Trail',coords:[42.85970,-72.72817],url:'images/tt_end', burl:'images/ttB_end'},
					 'll_step':{pic:'Lower Loop Steps',coords:[42.83707,-72.73309],url:'images/ll_steps', burl:'images/llB_steps'},
					 'll_sign':{pic:'Lower Loop Trail Sign',coords:[42.83765,-72.73346],url:'images/ll_sign', burl:'images/llB_sign'},
					 'll_pp':{pic:'Lower Loop Private Property Fork',coords:[42.83566,-72.73954],url:'images/ll_noEnter', burl:'images/llB_noEnter'},
					 'sp_acc':{pic:'South Pond Marlboro Residents Access Point',coords:[42.845802,-72.712984],url:'images/sp_access', burl:'images/spB_access'},
                    }; 					 

/*for debugging*/					
/*var trails_polyline;*/
/*var line_format;*/
/*var building;*/
	
/* Renders Marlboro map and draws interactive trails, building labels and picture pop-ups */
function draw_trails(trails){
    var map = L.map('marlboro_map').setView([42.8388, -72.7340], 13);
	/*calls in personalized Mapbox map and restricts zoom-out*/
    L.tileLayer(
	    'https://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}',
        {attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
		subdomains: ['a','b','c','d'],
		token: 'pk.eyJ1IjoiYWdvcmVuIiwiYSI6IlZVOFNYZmMifQ.eZrLlPh-oui4lDhkEfCNYw',
		mapId: 'agoren.ll46lblc',
        minZoom: 13, }).addTo(map);
	/*setting formatting variable to be called later*/	
    var line_format = {color: '#999999', opacity: 1.0, clickable: true, weight: 3.5, dashArray: '8,5',};
	var circle_format = {color: 'blue', opacity:0, clickable: true, fill: 'blue', fillOpacity:0};
    var label_format = {noHide:true, offset:[0,0]}; /* noHide doesn't work (as of yet) for polygon/circle features */
	var pic_format = {color: 'red', fillOpacity: 1.0, opacity: 1.0, clickable: true}; /*isn't actually changing the circle color*/
	
	/* storing the trail polylines to allow changes with zoom events */
    trails_polyline = {};
    /* drawing trails and making them interactive */	
	for (var name in trails){
	    var polyline = L.polyline(trails[name], line_format).addTo(map);
	    /* increase line transparency on scroll-over*/
		trails_polyline[name] = polyline;
	    polyline.on('mouseover',   
		    function scrollOver(e){e.target.setStyle({opacity: 0.5})});
	    /* reset transparency on scroll-out*/ 		
	    polyline.on('mouseout',    
		    function scrollOut(e){e.target.setStyle({opacity: 1.0})});	
	    /* binds a click-automated pop-up to the trails with trail mileage and description */
	    var tName = trail_info[name].trail;
	    var tMile = trail_info[name].mileage;
	    var tDescrip = trail_info[name].description;
	    var tInfo = "<h2>" + tName + "</h2><h3>" + tMile + "</h3>" + tDescrip;
	    polyline.bindPopup(tInfo);
	    /* binds a scrollover popup to trails */
	    polyline.bindLabel(tName);
      }; 
	
	/*test label*/
	/*var label = new L.Label();
	label.setContent(building_labels.Dalrymple.name);
	label.setLatLng(building_labels.Dalrymple.coords);
	map.showLabel(label);*/
	
	/*places circle at each building, shows building name when clicked */
	var building_dots = {};
	for (var place in building_labels){
		var coordinates = building_labels[place].coords;
		var building = L.circle(coordinates, 2, circle_format);
		building_dots[place] = building;
		building.bindPopup(building_labels[place].name, label_format).addTo(map);
	
	};
	
    /* adds clickable markers with trail picture pop-ups */
	var pic_markers = {};
    for(var picture in pic_locations){
        var trail_pic = new L.circleMarker();	
	    var coords = pic_locations[picture].coords;
		var pic_name = pic_locations[picture].pic;
		var pic_url = pic_locations[picture].url;
		var pic_big = pic_locations[picture].burl;
        trail_pic.setLatLng(coords);
        trail_pic.setRadius(3.5);
		pic_markers[picture] = trail_pic;
        pic_filler = "<h2>" + pic_name + "</h2>"+ "<a href=" + pic_big + ".JPG , target=_blank><img src=" + pic_url + ".JPG /></a>";		
    	trail_pic.bindPopup(pic_filler, pic_format, keepInView = true).addTo(map);	
    };	
	
	/* zoom event changes line and dash width as well as visibility of building markers */
	map.on('zoomend', function(e){
	    var zoom = map.getZoom();
		for (var name in trails_polyline){
		    var line = trails_polyline[name];
			if(zoom === 13){
			    line.setStyle({weight:3.5, dashArray: '8,5'});
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
			    line.setStyle({weight:7.5, dashArray: '10,8'});
			};
		};
		for (var building in building_dots){
		    var circle = building_dots[building];
		    if (zoom > 16){
			    circle.setStyle({opacity:1.0, clickable:true, fillOpacity:1.0});
			}
			else{
			    circle.setStyle({opacity:0, clickable:false, fillOpacity:0});
			};
		};
		for (var pic in pic_markers){
            var picMarker = pic_markers[pic];
			if (zoom < 14){
			    picMarker.setRadius(3.5);
			};
			if (zoom === 15){
			    picMarker.setRadius(4);
			};
			if (zoom === 16){
			    picMarker.setRadius(5);
			};
			if (zoom > 16){
			    picMarker.setRadius(6.5);
			};
        };		
		/*for debugging purposes - to make sure zoomend is triggering at each zoom*/
		/*alert('zoom is' + zoom);*/
	});
	

}

/* calls data into Papa Parse, runs when the page loads, */ 
/*   calls function to draw interactive map */
function init(){
    Papa.parse('marlboroTrails3.csv',
	    { download: true, 
		header: true, 
		dynamicTyping: true,
		complete: convert_and_draw,
	    }
	);
}