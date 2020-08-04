const dns = require('native-dns');
const server = dns.createServer();
const resolveARecord = require('./upstream');

server.on('request', function (request, response) {
  // console.log(request)

  // https://serverfault.com/questions/742785/multi-query-multiple-dns-record-types-at-once
  // The short answer is it's allowed in the protocol, but practically not supported.
  if (request.question.length > 1) {
    console.log('err me', request.question);
    response.send();
    return;
  }
  // ups

  const whiteList = ['exampleaa.com', 'cqsf1.xingdy.com'];
  const req = request.question[0];
  if (whiteList.includes(req.name)) {
    console.log('its me', req);
    response.answer.push(
      dns.A({
        name: req.name,
        address: '192.168.11.72',
        ttl: 0,
      })
    );
    response.send();
  } else {
    resolveARecord(req).then((ans) => {
      console.log('normal me', request.question[0]);
      console.log('normal me ans', ans);
      response.answer = ans;
      response.send();
    });
  }
});

server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

server.serve(53, '0.0.0.0');
