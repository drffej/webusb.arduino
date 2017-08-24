// Taken and adapted from https://github.com/webusb/arduino/blob/gh-pages/demos/rgb/rgb.js
// JP 24/08/17
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let toggleButton = document.querySelector('#toggle');
	let dataDisplay = document.querySelector('#data');
    
    let port;
	let onLed = new TextEncoder().encode('H');
	let offLed = new TextEncoder().encode('L');
	let toggle = 0;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = 'Connected to '+ port.device_.productName;
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
		  let txt = textDecoder.decode(data);
		  dataDisplay.textContent = 'rcvd \''+txt+'\'';
          console.log('-', txt);
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    toggleButton.addEventListener('click', function() {
      
	  console.log('Clicked toggle');
	  if (port){
		if (!toggle){
			port.send(onLed);
			statusDisplay.textContent = 'Led On';
		}
		else
		{
			port.send(offLed);
			statusDisplay.textContent = 'Led Off';
		}
		toggle = !toggle;
		
	  } else {
		 statusDisplay.textContent = 'Please connect first!'; 
	  }
      
    });

    

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });
	
	navigator.usb.addEventListener('connect', device => {
		// Add |device| to the UI.
		console.log('connected');
		serial.getPorts().then(ports => {
		if (ports.length == 0) {
			statusDisplay.textContent = 'No device found.';
		} else {
			statusDisplay.textContent = 'Connecting...';
			port = ports[0];
			connect();
		}
		});
	});
	
	navigator.usb.addEventListener('disconnect', device => {
		// Remove |device| from the UI.
		console.log('disconnected');
		if (port) {
			port.disconnect();
			connectButton.textContent = 'Connect';
			statusDisplay.textContent = 'device disconnected';
			port = null;
		}
		
	});
	
	
  });
})();