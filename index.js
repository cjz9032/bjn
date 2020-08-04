// const dns = require('native-dns');
// util = require('util');
// var consts = require('native-dns-packet').consts;

// var question = dns.Question({
//   name: 'www.google.com',
//   type: consts.NAME_TO_QTYPE.A,
//   class: consts.NAME_TO_QCLASS.IN,
// });

// var start = Date.now();

// var req = dns.Request({
//   question: question,
//   server: { address: '8.8.8.8', port: 53, type: 'udp' },
//   timeout: 1000,
// });

// req.on('timeout', function () {
//   console.log('Timeout in making request');
// });

// req.on('message', function (err, answer) {
//   answer.answer.forEach(function (a) {
//     console.log(a.address);
//   });
// });

// req.on('end', function () {
//   var delta = Date.now() - start;
//   console.log('Finished processing request: ' + delta.toString() + 'ms');
// });

// req.send();

const dns = require('native-dns');
// const axios = require('axios');
// const https = require('https');
// const net = require('net');
// const URL = require('url');

function resolveARecord(hostname, dnsServer = '127.0.0.1') {
  return new Promise(function (resolve, reject) {
    var question = dns.Question({
      name: hostname,
      type: 'A',
    });
    var request = dns.Request({
      question: question,
      server: { address: dnsServer, port: 53, type: 'udp' },
      timeout: 2000,
    });
    request.on('timeout', function () {
      reject(new Error('Timeout in making request'));
    });
    request.on('message', function (err, response) {
      // Resolve using the first populated A record
      for (var i in response.answer) {
        if (response.answer[i].address) {
          resolve(response.answer[i]);
          break;
        }
      }
    });
    request.on('end', function () {
      reject(new Error('Unable to resolve hostname'));
    });
    request.send();
  });
}

setTimeout(() => {
  resolveARecord('example.com');
}, 3000);

// axios.interceptors.request.use(function (config) {
//   var url = URL.parse(config.url);

//   if (!config.dnsServer || net.isIP(url.hostname)) {
//     // Skip
//     return config;
//   } else {
//     return resolveARecord(url.hostname, config.dnsServer).then(function (
//       response
//     ) {
//       config.headers = config.headers || {};
//       config.headers.Host = url.hostname; // put original hostname in Host header

//       url.hostname = response.address;
//       delete url.host; // clear hostname cache
//       config.url = URL.format(url);

//       return config;
//     });
//   }
// });

// axios
//   .get(`https://hostA.examplewqeeqweqweqwe.org`, {
//     // httpsAgent: agent,
//     dnsServer: '127.0.0.1',
//   })
//   .then(({ data }) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
