"use strict";
var SDK = require('sprockets-sdk');
var OUTLET_OUTPUT_ID = 'OUTLET_OUTPUT';
var tuya = require('tuyapi');

var TuyaSwitch = function(instance, id, key) {
    this.instance = instance;
    this.id = id;
    this.key = key;
    this.ready = false;
    instance.addControl(new SDK.Devices.DeviceBooleanComponent(OUTLET_OUTPUT_ID, 'Output', SDK.DeviceType.OUTLET));
};

TuyaSwitch.prototype.start = function() {
    var that = this;
    this.device = new tuya({
                            id: this.id,
                            key: this.key,
                            persistentConnection: true
    });

     this.device.resolveId().then(function(found) {
         if (found) {
             that.device.on('data', function(data) {
		 if (data.dps.hasOwnProperty('1')) {
                    var state = data.dps['1'];
                    that.instance.updateControlValue(OUTLET_OUTPUT_ID, state);
	         }
             });

             that.device.on('connected', function() {
                 that.ready = true;
             });

             that.device.on('disconnected', function() {
                 that.ready = false;
                 that.device.connect();
             });
             that.device.connect();
         }
     });
};

TuyaSwitch.prototype.shutdown = function() {
};


TuyaSwitch.prototype.setComponentValues = function(newVals) {
    var that = this;
    if (this.ready) {
        if (newVals.controls.hasOwnProperty(OUTLET_OUTPUT_ID)) {
            var o1 = newVals.controls[OUTLET_OUTPUT_ID].value;
            var newVal;
            newVal = (o1 === 'true' || o1 === true) ? true : false;

            this.device.set({dps: '1', set: newVal}).then(function(result) {
                that.instance.updateControlValue(OUTLET_OUTPUT_ID, newVal);
            });
        }
    } else {

        setTimeout(function() {
            that.setComponentValues(newVals);
        }, 500);
    }
};

module.exports = TuyaSwitch;
