// Mapbox
const mapboxConfig = {
	urlTemplate: "https://api.mapbox.com/styles/v1/sdurrenmath/cjqzpwamk0kyx2sqv5zguw9zq/tiles",
	accessToken: "pk.eyJ1Ijoic2R1cnJlbm1hdGgiLCJhIjoiY2pxeTdpMjk2MDBqcDRhbXk0bzYzYXVhNyJ9.IFLnN_RQmycBsiu6SAK3eA"
};

// Spin
const spinConfig = {
	options: {
	    lines: 9, // The number of lines to draw
	    length: 20, // The length of each line
	    width: 10, // The line thickness
	    radius: 20, // The radius of the inner circle
	    scale: 1, // Scales overall size of the spinner
	    corners: 0.9, // Corner roundness (0..1)
	    color: "black", // CSS color or array of colors
	    fadeColor: "transparent", // CSS color or array of colors
	    speed: 1, // Rounds per second
	    rotate: 0, // The rotation offset
	    animation: "spinner-line-fade-quick", // The CSS animation name for the lines
	    direction: 1, // 1: clockwise, -1: counterclockwise
	    zIndex: 2e9, // The z-index (defaults to 2000000000)
	    className: "spinner", // The CSS class to assign to the spinner
	    top: "50%", // Top position relative to parent
	    left: "50%", // Left position relative to parent
	    shadow: "0 0 1px transparent", // Box-shadow for the lines
	    position: "absolute" // Element positioning
	}
};
