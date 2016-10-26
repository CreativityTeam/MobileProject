"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var ionic_native_1 = require('ionic-native');
var http_1 = require('@angular/http');
require('rxjs/Rx');
var Rx_1 = require('rxjs/Rx');
var HomePage = (function () {
    function HomePage(navController, navParams, http) {
        var _this = this;
        this.navController = navController;
        this.navParams = navParams;
        this.http = http;
        this.trackLatLng = { 'lat': 0, 'lng': 0 };
        this.previousTrackLatLng = { 'lat': 0, 'lng': 0 };
        this.loadingHide = false;
        this.socketHost = 'http://192.168.100.5:3000/locations';
        this.markers = [];
        this.locationGet = io(this.socketHost);
        this.locationGet.on('location', function (location) {
            if ((location[0]['latitude'] !== _this.trackLatLng['latitude']) || (location[0]['longitude'] !== _this.trackLatLng['longitude'])) {
                _this.trackLatLng = location[0];
                console.log("Get socket " + _this.trackLatLng['latitude'] + " " + _this.trackLatLng['longitude']);
                _this.setDirection();
                _this.addMarker();
            }
        });
    }
    //presentLoading() {
    //   this.loader = this.loadingCtrl.create({
    //        content: "Please wait...",
    //        duration: 3000
    //    });
    //    this.loader.present();
    //}
    //hideLoading() {        
    //    this.loader.hide();
    //}
    HomePage.prototype.ionViewDidEnter = function () {
        //this.presentLoading();
        this.initDirection();
        this.loadMap();
    };
    HomePage.prototype.getJson = function (response) {
        return response.json();
    };
    HomePage.prototype.checkForError = function (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        else {
            var error = new Error(response.statusText);
            error['response'] = response;
            Rx_1.Observable.throw(error);
        }
    };
    HomePage.prototype.testGet = function () {
        var _this = this;
        this.get().subscribe(function (result) {
            console.log('Res = ' + result);
            _this.trackLatLng = result[0];
            _this.setDirection();
        }, function (error) { return console.log('Error'); });
    };
    HomePage.prototype.get = function () {
        var myHeaders = new http_1.Headers;
        myHeaders.set('Content-type', 'application/json');
        var opt = new http_1.RequestOptions({
            headers: myHeaders
        });
        var url = 'https://lit-plains-83504.herokuapp.com/locations';
        return this.http
            .get(url)
            .map(this.checkForError)
            .catch(function (err) { return Rx_1.Observable.throw(err); })
            .map(this.getJson);
    };
    HomePage.prototype.initDirection = function () {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    };
    HomePage.prototype.setDirection = function () {
        var track = new google.maps.LatLng(this.trackLatLng['latitude'], this.trackLatLng['longitude']);
        var request = {
            origin: track,
            destination: this.latLng,
            travelMode: 'DRIVING'
        };
        var display = this.directionsDisplay;
        this.directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                console.log(response);
                display.setDirections(response);
            }
            else {
                alert('Something wrong. Maybe the shipper\'s position is unknown now!');
            }
        });
    };
    HomePage.prototype.addMarker = function () {
        var track = new google.maps.LatLng(this.trackLatLng['latitude'], this.trackLatLng['longitude']);
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var marker = new google.maps.Marker({
            map: this.map,
            title: 'Shipper\'s location',
            animation: google.maps.Animation.BOUNCE,
            position: track
        });
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers.push(marker);
        this.bounds.extend(marker.position);
        this.map.fitBounds(this.bounds);
        //this.map.setCenter(this.bounds.getCenter(), this.map.getBoundsZoomLevel(this.bounds));
        this.map.panToBounds(this.bounds);
    };
    HomePage.prototype.loadMap = function () {
        var _this = this;
        this.bounds = new google.maps.LatLngBounds();
        ionic_native_1.Geolocation.getCurrentPosition().then(function (position) {
            //SpinnerDialog.hide();
            _this.loadingHide = true;
            _this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            _this.bounds.extend(_this.latLng);
            var mapOptions = {
                center: _this.latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            //this.hideLoading();
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, mapOptions);
            _this.directionsDisplay.setMap(_this.map);
            _this.directionsDisplay.setPanel(_this.directionElement.nativeElement);
            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            var marker = new google.maps.Marker({
                map: _this.map,
                icon: iconBase + 'ranger_station.png',
                title: 'Order location',
                position: _this.map.getCenter()
            });
        });
    };
    ;
    __decorate([
        core_1.ViewChild('map'), 
        __metadata('design:type', core_1.ElementRef)
    ], HomePage.prototype, "mapElement", void 0);
    __decorate([
        core_1.ViewChild('direction'), 
        __metadata('design:type', core_1.ElementRef)
    ], HomePage.prototype, "directionElement", void 0);
    HomePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/home/home.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.NavParams, http_1.Http])
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
