var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Vray License Manager',
  description: 'Vray License Manager by Corey Rubadue',
  script: 'C:\\License Manager\cg.proxy'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();