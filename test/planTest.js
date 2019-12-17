const mongoose = require("mongoose");
import {Plan} from '../app/models';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const serverPort = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Plan', () => {
  describe('GET plans', () => {
    it('Should get all the plans', (done) => {
      chai.request(serverPort)
        .get('/plans')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.should.be.json;
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('name');
          res.body[0].should.have.property('technology');
          done();
        });
    });
  });
  describe('GET Plan By Id', () => {
    it('Should get Plan having atleast name and technology field', (done) => {
      chai.request(serverPort)
        .get('/plans/')
        .end((err, response) => {
          chai.request(serverPort)
          .get('/plans/' + response.body[0]._id)
          .end((err, res) => {
           res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('technology');
            res.body.should.have.property('version');
            res.body.should.have.property('status');
            res.body.version.should.be.equal(1);
            done();
          })
        });
     });
    it('Should get not found  status code if invalid id is supplied', (done) => {
      chai.request(serverPort)
        .get('/plans/' + '59c4dd9f9d4f1870e')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a.json;
          res.should.be.a('object');
          done();
      });
    });
  });
  describe('Post Plan', () => {
    it('Should not have plan without name, technology and version, status should be automatically created', (done) => {
      chai.request(serverPort)
        .post('/plans')
        .send({name:'Node Project', technology: 'node'})
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('technology');
          res.body.name.should.equal('Node Project');
          res.body.technology.should.equal('node');
          res.body.should.have.property('planner_id');
          res.body.should.have.property('version');
          res.body.should.have.property('status');
          res.body.version.should.be.equal(1);
          res.body.status.should.be.equal('Created');
          done();
       });
     });
    it('Should not be able to post without name', (done) => {
      chai.request(serverPort)
        .post('/plans')
        .send({technology: 'node'})
        .end((err, res) => {
          res.should.have.status(404);
          done();
      });
    })
    it('Should not be able to post without technology', (done) => {
      chai.request(serverPort)
        .post('/plans')
        .send({name: 'Node'})
        .end((err, res) => {
          res.should.have.status(404);
          done();
      });
    })
    it('Should not be able to create tasks', (done) => {
      chai.request(serverPort)
        .post('/plans')
        .send({tasks: ['59c4dd9f9d4ff718c6870e48']})
        .end((err, res) => {
          res.should.have.status(403);
          done();
      });
    })
  });
  describe('Put plan', () => {
    describe('HR updating Plan', () => {
      it('Should update the plan except the tasks and status', (done) => {
        chai.request(serverPort)
          .get('/plans')
          .end((err, res) => {
            chai.request(serverPort)
              .put('/plans/' + res.body[0]._id)
              .send({'name': 'Node Updated'})
              .end((error, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('ok');
                response.body.should.have.property('nModified');
                response.body.should.have.property('n');
                done();
             });
        });
      });
      it('Should not be able to update tasks', (done) => {
        chai.request(serverPort)
          .get('/plans')
          .end((err, res) => {
            chai.request(serverPort)
              .put('/plans/' + res.body[0]._id)
              .send({tasks: ['59c4dd9f9d4ff718c6870e48']})
              .end((error, response) => {
                response.should.have.status(403);
                response.should.have.property('error');
                done();
             });
        });
      });
    });
    describe('Planner updating Plan', () => {
      it('Should update only tasks and status', (done) => {
        chai.request(serverPort)
          .get('/plans')
          .end((err, res) => {
            chai.request(serverPort)
              .put('/plans/' + res.body[0]._id + '/tasks')
              .send({tasks: ['59c4dd9f9d4ff718c6870e48'], status: 'Drafted'})
              .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal('Updated Plan');
                done();
            });
        });
      });
      it('Should not be able to update name', (done) => {
        chai.request(serverPort)
          .get('/plans')
          .end((err, res) => {
            chai.request(serverPort)
              .put('/plans/' + res.body[0]._id + '/tasks')
              .send({name: 'Node'})
              .end((error, response) => {
                response.should.have.status(403);
                done();
            });
        });
      });
      it('Should not be able to update technology', (done) => {
        chai.request(serverPort)
          .get('/plans')
          .end((err, res) => {
            chai.request(serverPort)
              .put('/plans/' + res.body[0]._id + '/tasks')
              .send({name: 'Node', technology: 'node'})
              .end((error, response) => {
                response.should.have.status(403);
                done();
            });
        });
      });
    });
  });
  describe('Delete Plan', () => {
    it('Should delete if Id is valid', (done) => {
      chai.request(serverPort)
        .get('/plans')
        .end((err, res) => {
          chai.request(serverPort)
            .delete('/plans/' + res.body[0]._id)
            .end((error, response) => {
              response.should.have.status(204);
              done();
          });
       });
     });
    it('Should not delete if Id is invalid', (done) => {
      chai.request(serverPort)
        .delete('/plans/' + '59c4dd9f9d4ff718c68701')
        .end((error, response) => {
          response.should.have.status(404);
          done();
       });
     });
  });
  describe('Removing tasks from plan', () => {
    it('Should remove task if TaskId and PlanId is valid', (done) => {
      chai.request(serverPort)
        .get('/plans')
        .end((err, res) => {
          chai.request(serverPort)
            .delete('/plans/' + res.body[0]._id + '/tasks/' + '59c513e0d82e3330853cb956')
            .end((err, response) => {
              response.should.be.a.json;
              response.should.be.a('object');
              response.should.have.status(200);
              done();
        });       
      });
    });
    it('Should get service unavailable status if invalid taskId is provided', (done) => {
      chai.request(serverPort)
        .get('/plans')
        .end((err, res) => {
          chai.request(serverPort)
            .delete('/plans/' + res.body[0]._id + '/tasks/' + '59c513e0d82e3353cb956')
            .end((err, response) => {
              response.should.be.a.json;
              response.should.be.a('object');
              response.should.have.status(503);
              done();
        });     
      });
    });
    it('Should have Not Found Status if invalid planID is provided', (done) => {
      chai.request(serverPort)
        .get('/plans')
        .end((err, res) => {
          chai.request(serverPort)
            .delete('/plans/' + '59c513e0d82e3cb956' + '/tasks/' + '59c513e0d82e3353cb956')
            .end((err, response) => {
              response.should.be.a.json;
              response.should.be.a('object');
              response.should.have.status(404);
              done();
        });     
      });
    });
  });
});