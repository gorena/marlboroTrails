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
/* var trails; */
/* var name; */
/* Convert Papa.parse cvs result and call draw_trails to render it. */
function convert_and_draw(results){
    var data = results.data; /* in form [{'X':-72,'Y':42,'id':8982,'name':'TT'}] */
    var trails = {};
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
/* var trail_info = [
	        {trail: 'Ho Chi Minh', mileage: 'mileage', description: 'Short description here.' },
            {trail: 'Lower Loop', mileage: 'mileage', description: 'Short description here.' },
            {trail: 'Town Trail', mileage: 'mileage', description: 'Short description here.' },
			{trail: 'Ridge Trail', mileage: 'mileage', description: 'Short description here.' },
			{trail: 'Old Oaks Trail', mileage: 'mileage', description: 'Short description here.' },
			]; */

/* Renders Marlboro map and draws interactive trails */
function draw_trails(trails){
    var map = L.map('marlboro_map').setView([42.8388, -72.7340], 13);
    L.tileLayer(
      'http://{s}.tiles.mapbox.com/v3/agoren.k15g6m29/{z}/{x}/{y}.png',
      {attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
       maxZoom: 18 }).addTo(map);
    var line_format = {color: 'green', opacity: 1.0, clickable: true, weight: 3, dashArray: '',};
	trail_info = [
	        {trail: 'Ho Chi Minh Trail', mileage: 'mileage', description: 'Short description here.' },
            {trail: 'Lower Loop', mileage: 'mileage', description: 'Short description here.' },
            {trail: 'Town Trail', mileage: 'mileage', description: 'Short description here.' },
			{trail: 'Ridge Trail', mileage: 'mileage', description: 'Short description here.' },
			{trail: 'Old Oaks Trail', mileage: 'mileage', description: 'Short description here.' },
			];
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
	  for (var i=0; i < trail_info.length; i++){
	    var tName = trail_info[i].trail;
		var tMile = trail_info[i].mileage;
		var tDescrip = trail_info[i].description;
		var tInfo = "<h2>" + tName + "</h2><h3>" + tMile + "</h3>" + tDescrip;
	    if(trail_info[i].trail === name){
          /* var description = "<h2> <script> trail_info[i].trail <\script> </h2><h3> <script> trail_info[i].mileage <\script> </h3> <script> trail_info[i].description <\script>"			 
            */
		  /* var description = "trail!" */
		  /* var description = "<h2> <script> trail_info[i].trail <\script> </h2>" */
		  polyline.bindPopup(tInfo);	
        }
		/* if(trail_info[i].trail !== name) */
		else {
		  polyline.bindPopup("Anonymous Connecting Trail")
		}; 
      };     
	};

}

/* calls data into Papa Parse, runs when the page loads, 
   calls function to draw interactive map*/
function init(){
    Papa.parse('marlboroTrails.csv',
	       { download: true, 
		 header: true, 
		 dynamicTyping: true,
		 complete: convert_and_draw,
	       }
	      );
}