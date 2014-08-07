var app = require('../../app.js');
var request = require('supertest');

describe("Routing site files", function(){

  it ("root should return", function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
  it ("about should return", function(done){
    request(app)
      .get('/about')
      .expect(200)
      .end(done);
  });
  it ("login should return", function(done){
    request(app)
      .get('/login')
      .expect(200)
      .end(done);
  });


});