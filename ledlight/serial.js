var serial = {};

(function() {
  'use strict';

  serial.getPorts = function() {
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new serial.Port(device));
    });
  };

  serial.requestPort = function() {
    const filters = [
      { 'vendorId': 0x2341, 'productId': 0x8036 },
      { 'vendorId': 0x2341, 'productId': 0x8037 },
    ];
    return navigator.usb.requestDevice({ 'filters': filters }).then(
      device => new serial.Port(device)
    );
  }

  serial.Port = function(device) {
    this.device_ = device;
  };

  serial.Port.prototype.connect = function() {
    let readLoop = () => {
      this.device_.transferIn(5, 64).then(result => {
        this.onReceive(result.data);
        readLoop();
      }, error => {
        this.onReceiveError(error);
      });
    };

    return this.device_.open()
        .then(() => {
          if (this.device_.configuration === null) {
            return this.device_.selectConfiguration(1);
          }
        })
        .then(() => this.device_.claimInterface(2))
        .then(() => this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x01,
            'index': 0x02}))
        .then(() => {
          readLoop();
        });
  };
  
  serial.Port.prototype.connect2 = function() {
    let readLoop = () => {
		console.log('reading...');
	    this.device_.transferIn(5, 64).then(result => { 
		console.log('\tread=',result);
		if (result.status === 'ok'){
			this.onReceive(result.data);
			readLoop();
		}
		if (result.status === 'stall'){
			console.error('Endpoint stalled. Clearing.');
			this.device_.clearHalt(5);
		}
      }, error => {
		console.error(error);
        this.onReceiveError(error);
      });
    };

    return this.device_.open()
        .then(() => {
		  console.log("\topening  ...");
		  if (this.device_.configuration === null) {
            return this.device_.selectConfiguration(1);
          }
          
        })
        .then(() => { 
		  console.log("\tclaiming (2)..."); 
		  this.device_.claimInterface(2);
		  console.log("\t\tclaimed");
		})  
		
		.then(() => {
		  this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x01,
            'index': 0x02});
		  console.log('\tcontrol request done');
		})
		.then(() => {
		  console.log('\tlistening');
          readLoop();
        })
		.catch(err => {
        console.error("USB Error ---", err);
		})		;
  };

  serial.Port.prototype.disconnect = function() {
    return this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x00,
            'index': 0x02})
        .then(() => this.device_.close());
  };

  serial.Port.prototype.send = function(data) {
    return this.device_.transferOut(4, data);
  };
})();