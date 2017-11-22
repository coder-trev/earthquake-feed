define([
	'jquery',
	'ramda',
	'io',
	'pointfree',
	'leaflet',
	'rx',
	'rx.dom'
], function(
	$,
	_,
	io,
	P,
	L,
	Rx
) {
	'use strict';
	io.extendFn();
	
	// HELPERS
	var compose = P.compose,
		map = P.map,
		log = function(x) { console.log(x); return x; },
		flatMap = _.curry(function(f, obs) {
			return obs.flatMap(f);
		}),
		retry = _.curry(function(times, obs) {
			return obs.retry(times);
		}),
		distinct = _.curry(function(f, obs) {
			return obs.distinct(f);
		}),
		interval$ = function(time) {
			return Rx.Observable.interval(time);
		},
		getJsonp$ = compose(map(_.prop('response')), retry(3), Rx.DOM.jsonpRequest);

	// PURE
	var quakeJson$ = function(params) {
		return interval$(5000).flatMap(getJsonp$(params));
	};

	var eqFeature$ = function(eq_json) { return Rx.Observable.from(eq_json.features); };

	var getQuakeCode = function(quake) { return quake.properties.code; };

	var getQuakeData = function(quake) {
		return {
			lat: quake.geometry.coordinates[1],
			lon: quake.geometry.coordinates[0],
			size: quake.properties.mag * 10000
		};
	}

	var quakeData$ = compose(map(getQuakeData), distinct(getQuakeCode), flatMap(eqFeature$));

	var quake$ = compose(quakeData$, quakeJson$);

	// IMPURE
	var leafletMap = L.map('map').setView([33, -118], 7);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(leafletMap);

	var QUAKE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp';

	var jsonpParams = {url: QUAKE_URL, jsonpCallback: 'eqfeed_callback'};

	quake$(jsonpParams).subscribe(function(quake) {
		L.circle([quake.lat, quake.lon], quake.size).addTo(leafletMap);
	});
});