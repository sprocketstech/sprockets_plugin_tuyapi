"use strict";

var SDK = require('sprockets-sdk');
var util = require('util');
var TuyaSwitch = require('./TuyaSwitch.js');
var TuyaInstance = function(id, config, services) {
    SDK.Devices.DeviceInstance.call(this, id);
    this.instance = null;
    this.config = config;
};

util.inherits(TuyaInstance, SDK.Devices.DeviceInstance);

/*Overrides of Device Instance */

TuyaInstance.prototype.start = function() {
    this._getInstance().start();
};

TuyaInstance.prototype.shutdown = function() {
    this._getInstance().shutdown();
};


TuyaInstance.prototype.setComponentValues = function(newVals) {
    this._getInstance().setComponentValues(newVals);
};

TuyaInstance.prototype.invokeCommand = function(commandId) {
    //no commands
};

TuyaInstance.prototype._getInstance = function() {
    if (!this.instance) {
        switch (this.config.deviceType) {
            case "Switch":
                this.instance = new TuyaSwitch(this, this.config.id, this.config.key);
                break;
            default:
                this.instance = new TuyaUnknown(this, this.config.id, this.config.key);
                break;
        };
    }
    return this.instance;
};

var TuyaPlugin = function() {
    SDK.Devices.DevicePlugin.call(this, 'Tuya Device');
    this.addSetupParameter('id', 'Id', true, SDK.ValueType.TEXT);
    this.addSetupParameter('key', 'Key', true, SDK.ValueType.PASSWORD);
    this.addSetupParameter('deviceType', 'Device Type', true, SDK.ValueType.OTHER, [
        'Switch',
        'Dimmer'
    ]);
};

util.inherits(TuyaPlugin, SDK.Devices.DevicePlugin);


TuyaPlugin.prototype.createInstance = function(id, config, services) {
    return new TuyaInstance(id, config, services);
};

module.exports = new TuyaPlugin();