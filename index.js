var restify = require('restify');

const {registerBlockchain} = require('./sawtooth/client');
const processor = require('./sawtooth/processor');
const {voteHandler} = require('./sawtooth/voteHandler');
const request = require('request');
const {searchBlockchain,handlerInfo,getAddress} = require('./sawtooth/infra');

processor(new voteHandler());

function registerVote(req, res, next) {
  const voto = req.body;
  registerBlockchain(voto);

  res.send(200);
  next();
}

function search(req, res, next) {
    const address = req.params.address;

    searchBlockchain(address,(votes) => {
      res.send(votes);
      next();
    });
  }

function searchByEllectionName(req, res, next) {
    const ellectionName = req.params.ellectionName;
    const address = handlerInfo().prefix + getAddress(ellectionName,20);

    searchBlockchain(address,(votes) => {
      res.send(votes);
      next();
    });
  }


var server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser());

server.post('/register/vote', registerVote);
server.get('/search/:address', search);
server.get('/search/ellection/:ellectionName', searchByEllectionName);

server.listen(8084, function() {
  console.log('%s listening at %s', server.name, server.url);
});
