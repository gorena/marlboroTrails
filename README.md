# marlboroTrails README file

This repository includes 4 versions of the JavaScript file for my webpage: 
1. draw_MarlboroMap2.js - the most basic version, draws trails and adds trail pop-ups
2. draw_MarlboroMap3.js - close to the final version, 
   zoomend event not working correctly in this version, no trail detail added yet
3. draw_MarlboroMap4.js - shows Jim Mahoney's notes on the zoomend event 
   as well as his tester code which fires an alert each time the map is zoomed
4. draw_MarlboroMap5.js - the final working code, minimal comments noting portions 
   of the debugging process general functionality of each element

The marlboroMap.html file is the final webpage file, it calls my draw_MarlboroMap5.js 
and  marlboroMap_style.css (Cascading style-sheet) files in addition to: 
1. leaflet.js and leaflet.css - the Leaflet library and stylesheet 
2. BaseMarkerMethods.js, CircleMarker.Label.js, copyright.js, FeatureGroup.Label.js, 
   Label.js, Map.Label.js, Marker.Label.js, Path.Label.js, and Leaflet.label.js  
   - Leaflet library extension, used to add scroll over trail labels, initially 
     tried to add static labels for buildings using this extension
3. papaparse.min.js - parses the csv files allowing them to be put into a usable format
	 
The images included on the web-page can be found within the images file. 
The marlboroTrails.csv is an earlier version of the trails coordinates csv file;
the marlboroTrails2.csv is the final version for the web-page. 

Sources:
Discussing issue of pop-ups being cut off by map bounds:
  -> http://stackoverflow.com/questions/21029255/leaflet-marker-popup-extends-past-the-map 
     (accessed 04/17/2015)
  -> http://leafletjs.com/examples/custom-icons.html
     (accessed 04/12/2015)
Discussion of static labels for circle markers:
  -> http://stackoverflow.com/questions/17798794/how-to-display-leaflet-static-labels-for-objects-in-a-layergroup
     (accessed 04/17/2015)
  -> https://github.com/Leaflet/Leaflet.label/issues/31
     (accessed 04/17/2015)
Showing images in a pop-up:
  -> http://stackoverflow.com/questions/10575765/show-image-in-leaflet-popup
     (accessed 04/18/2015)
Issue with Github ssh key:
  -> http://stackoverflow.com/questions/10166173/git-servers-host-key-not-cached-in-registry-github-com
     (accessed 04/16/2015)
Leaflet labels:
  -> http://jsfiddle.net/CrqkR/6/
     (accessed 04/04/2015)
  -> http://stackoverflow.com/questions/13316925/simple-label-on-a-leaflet-geojson-polygon
     (accessed 04/04/2015)
Zoom events:
  -> https://www.mapbox.com/mapbox.js/example/v1.0.0/markers-only-at-zoom-level/
     (accessed 04/04/2015)
  -> http://stackoverflow.com/questions/18609091/leaflet-js-detecting-when-map-finishes-zooming
     (accessed 04/04/2015)
  -> https://p2pu.org/en/groups/online-maps-with-leaflet/content/events-listening-to-your-users/
     (accessed 04/05/2015)  
