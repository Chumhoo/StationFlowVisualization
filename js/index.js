// Map details
L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlbmluamEiLCJhIjoiSjg5eTMtcyJ9.g_O2emQF6X9RV69ibEsaIw';
var map = L.mapbox.map('map', 'mapbox.streets').setView([27.697399139404297,120.30279876708984], 11);
var temp = [];
// info_site_number - 基站的数量   info_time_periods - 时间段数量
var info_site_number, info_time_periods;

// 基站数据
var file_site = d3.csv("siteID.csv", function(error, readDataSite){
	var data_site = [];
	readDataSite.forEach(function(d, i) {
		// +的作用是将字符串转换为数字
		data_site.push({"coords":[+d.latitude, +d.longtitude]});
	});
// 文件标识
var file_data_info = d3.text("inputData_intro.csv", function(error, readDataInfo){
	var data_info = [];
	temp = readDataInfo.match(/\d+/g);
	temp.forEach(function(d) {
		data_info.push(parseInt(d));
	});
	info_time_periods = data_info[0];
	info_site_number  = Math.sqrt(data_info[1]); 
// 流量数据
var file_flow = d3.text("inputData_sparse.csv", function(error, readDataFlow) {
	var data_flow = [];
	if (error) console.log(error);
	temp = readDataFlow.match(/\d+/g);
	temp.forEach(function(d) {
		data_flow.push(parseInt(d));
	});
// 基站角标
var file_index_station = d3.text("inputData_stationID.csv", function(error, readDataIndexStation) {
	var data_index_station = [];
	temp = readDataIndexStation.match(/\d+/g);
	temp.forEach(function(d) {
		data_index_station.push(parseInt(d));
	});
// 时间角标
var file_index_time = d3.text("inputData_timeID.csv", function(error, readDataIndexTime) {
	var data_index_time = [];
	temp = readDataIndexTime.match(/\d+/g);
	temp.forEach(function(d) {
		data_index_time.push(parseInt(d));
	});


// var site = [
//         {"coords":[27.697399139404297,120.28279876708984]},
//         {"coords":[53.4050, -2.9607]},
//         {"coords":[53.4082, -2.9837]},
//         {"coords":[53.4282, -2.9537]}
//     ];
//     site.push({"coords":[0,1]});


// // Loop through data and create d.LatLng 
// data_site.forEach(function(d) {
//     d.LatLng = new L.LatLng(d.coords[0], d.coords[1]);
//     // 绘制圆圈的外轮廓
//     map.addLayer(L.circle([d.coords[0], d.coords[1]], 500));
// });

// // 用svg绘制可交互的填充透明圆圈
// // Append <svg> to #map
// var svg = d3.select(map.getPanes().overlayPane).append("svg")
//     .attr("class", "leaflet-zoom-animated")
//     .attr("width", window.outerWidth)
//     .attr("height", window.outerHeight);
// // g是将多个元素组织在一起的元素 Append <g> to <svg>
// var g = svg.append("g").attr("class", "leaflet-zoom-hide");
// // 填充的透明圆圈
// // Append <circle> to <g>
// var circles = g.selectAll("circle")
//     .data(data_site)
//     .enter()
//     .append("circle")
//     .style("fill", "rgba(255, 255, 255, .5)");
// // 鼠标悬浮时透明度变化
// circles.on("mouseenter", function() { return d3.select(this).style("opacity", "0"); });
// circles.on("mouseleave", function() { return d3.select(this).style("opacity", "1"); });




var min = d3.rgb(233,205,175);    //红色  
var max = d3.rgb(41,29, 64);    //绿色 
var interpolation = d3.interpolate(min, max);

//绘制直线  
for (var j = 0; data_index_time[j] < 1 && j < info_site_number * info_site_number; j++) {
	 data_flow[j].polyline = 
	 new L.polyline(
	 [data_site[parseInt(data_index_station[j]/info_site_number)].coords, 
	  data_site[parseInt(data_index_station[j]%info_site_number)].coords], 
	 { color:getColor(data_flow[j] / 100),
	   weight:data_flow[j] * 0.00005 * Math.pow(2, map.getZoom())})
	 .addTo(map);
}


// 更新函数
function update() {
//     translateSVG()
	console.log(map.getZoom());
    // 更新透明圆圈的位置
//     circles.attr("cx", function(d) { return map.latLngToLayerPoint(d.LatLng).x; })
//     circles.attr("cy", function(d) { return map.latLngToLayerPoint(d.LatLng).y; })
//     circles.attr("r", function(d) { return 0.005 * Math.pow(2, map.getZoom()); })
}

// // Adjust the circles when the map is moved
// function translateSVG() {
//     //屏幕的可操作边界范围
//     var viewBoxLeft = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.x;
//     var viewBoxTop = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.y;
//     // Reszing width and height incase of window resize
//     svg.attr("width", window.innerWidth)
//     svg.attr("height", window.innerHeight)
//       // Adding the ViewBox attribute to our SVG to contain it
//     svg.attr("viewBox", function() {
//       return "" + viewBoxLeft + " " + viewBoxTop + " " + window.innerWidth + " " + window.innerHeight;
//     });
//     // Adding the style attribute to our SVG to transkate it
//     svg.attr("style", function() {
//       return "transform: translate3d(" + viewBoxLeft + "px, " + viewBoxTop + "px, 0px);";
//     });
// }

// Re-draw on reset, this keeps the markers where they should be on reset/zoom
map.on("moveend", update);
update();

function getColor(value)
{
	var stage0, stage1, stage2, stage3, stage4, stage5, stage6, stage7, stage8, stage9;
	if (value > 0.0 && value < 0.1) {
		var interpolator = d3.interpolate(d3.rgb(240, 194, 162), d3.rgb(225, 157, 148));
		return interpolator((value - 0.0) / 0.1);
	}
	else if (value >= 0.1 && value < 0.2) {
		var interpolator = d3.interpolate(d3.rgb(225, 157, 148), d3.rgb(218, 121, 137));
		return interpolator((value - 0.1) / 0.1);
	}
	else if (value >= 0.2 && value < 0.3) {
		var interpolator = d3.interpolate(d3.rgb(218, 121, 137), d3.rgb(207, 87, 124));
		return interpolator((value - 0.2) / 0.1);
	}
	else if (value >= 0.3 && value < 0.4) {
		var interpolator = d3.interpolate(d3.rgb(207, 87, 124), d3.rgb(176, 71, 123));
		return interpolator((value - 0.3) / 0.1);
	}
	else if (value >= 0.4 && value < 0.5) {
		var interpolator = d3.interpolate(d3.rgb(176, 71, 123), d3.rgb(138, 56, 122));
		return interpolator((value - 0.4) / 0.1);
	}
	else if (value >= 0.5 && value < 0.6) {
		var interpolator = d3.interpolate(d3.rgb(138, 56, 122), d3.rgb(100, 45, 127));
		return interpolator((value - 0.5) / 0.1);
	}
	else if (value >= 0.6 && value < 0.7) {
		var interpolator = d3.interpolate(d3.rgb(100, 45, 127), d3.rgb(69, 37, 127));
		return interpolator((value - 0.6) / 0.1);
	}
	else if (value >= 0.7 && value < 0.8) {
		var interpolator = d3.interpolate(d3.rgb(69, 37, 127), d3.rgb(56, 28, 96));
		return interpolator((value - 0.7) / 0.1);
	}
	else if (value >= 0.8 && value < 0.9) {
		var interpolator = d3.interpolate(d3.rgb(56, 28, 96), d3.rgb(40, 23, 74));
		return interpolator((value - 0.8) / 0.1);
	}
	else if (value >= 0.9 && value <= 1.0) {
		var interpolator = d3.interpolate(d3.rgb(40, 23, 74), d3.rgb(24, 15, 41));
		return interpolator((value - 0.9) / 0.1);
	}

}






});
});
});
});
});
