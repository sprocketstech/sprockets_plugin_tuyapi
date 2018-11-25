var plugin = require('./index.js');

var inst = plugin.createInstance('abc', {
    /*id: '02200059ecfabc849b03',
    key: 'd657c584136500b3',*/
    id: '02200059ecfabc8480ad', key: 'e25ef5700f0f37c2',
    deviceType: 'Switch'
}, {});
inst.start();
inst.setComponentValues({
   controls: {
       OUTLET_OUTPUT: {value: true}
   } 
});