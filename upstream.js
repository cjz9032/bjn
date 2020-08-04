const dns = require('native-dns');

function resolveARecord(opt, dnsServer = '114.114.114.114') {
  return new Promise(function (resolve, reject) {
    var question = dns.Question({
      name: opt.name,
      type: opt.type,
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
      // for (var i in response.answer) {
      //   if (response.answer[i].address) {
      //     resolve(response.answer[i]);
      //     break;
      //   }
      // }
      resolve(response.answer);
    });
    request.on('end', function () {
      reject(new Error('Unable to resolve hostname'));
    });
    request.send();
  });
}
module.exports = resolveARecord;

// setTimeout(() => {
//   resolveARecord('example.com');
// }, 3000);
