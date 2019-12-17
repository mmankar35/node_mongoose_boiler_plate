const mongoose = require("mongoose");
import {
  Training
} from '../app/models';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const serverPort = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Training', () => {
  describe('GET trainings', () => {
    it('Should get all the trainings', (done) => {
      chai.request(serverPort)
        .get('/training')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.should.be.json;
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('trainer_id');
          res.body[0].should.have.property('trainee_id');
          res.body[0].should.have.property('program_id');
          done();
        });
    });
  });
});

describe('GET Training By Id', () => {
  it('Should get Training having atleast program id,trainee id and training id', (done) => {
    chai.request(serverPort)
      .get('/training')
      .end((err, response) => {
        chai.request(serverPort)
          .get('/training/' + response.body[0]._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id');
            res.body.should.have.property('trainer_id');
            res.body.should.have.property('trainee_id');
            res.body.should.have.property('state');
            res.body.should.have.property('trelloListId');
            res.body.should.have.property('trelloBoard');
            res.body.trainer_id.should.equal(response.body[0].trainer_id);
            res.body.trainee_id.should.equal(response.body[0].trainee_id);
            res.body.program_id.should.equal(response.body[0].program_id);
            done();
          });
      });
  });
  it('Should throw error if invalid id is supplied', (done) => {
    chai.request(serverPort)
      .get('/training/' + '59c4dd9f9')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.a.json;
        res.should.be.a('object');
        done();
      });
  });
});

describe('Delete Training', () => {
  it('Should delete if Id is valid', (done) => {
    chai.request(serverPort)
      .get('/training')
      .end((err, res) => {
        console.log('i m here');
        chai.request(serverPort)
          .delete('/training/' + res.body[0]._id)
          .end((error, response) => {
            response.should.have.status(204);
            done();
          });
      });
  });
  it('Should not delete if Id is invalid', (done) => {
    chai.request(serverPort)
      .delete('/training/' + '59c4dd9f9d4ff718')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('Post Training', () => {
  it('Should not post without trainer_id,trainer_id,program_id and status should be automatically created', () => {
    chai.request(serverPort)
      .post('/training')
      .send({
        trainee_id: "59c51eb8bc9616d9321dc44f",
        trainer_id: "59c51d3ebc9616d9321dc44e",
        program_id: "5933723c886d193061b99459"
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('trainer_id');
        res.body.should.have.property('trainee_id');
        res.body.name.should.equal('program_id');
        res.body.should.have.property('state');
        res.body.technology.should.equal('in progress');
        done();
      });
  });
  it('Should not be able to post without trainer_id', () => {
    chai.request(serverPort)
      .post('/training')
      .send({
        trainee_id: "59c51eb8bc9616d9321dc44f",
        program_id: "5933723c886d193061b99459"
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  })
  it('Should not be able to post without trainee_id', () => {
    chai.request(serverPort)
      .post('/training')
      .send({
        trainer_id: "59c51d3ebc9616d9321dc44e",
        program_id: "5933723c886d193061b99459"
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  })
  it('Should not be able to post without program_id', () => {
    chai.request(serverPort)
      .post('/training')
      .send({
        trainee_id: "59c51eb8bc9616d9321dc44f",
        trainer_id: "59c51d3ebc9616d9321dc44e"
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  })
});

describe('PUT Trainer', () => {
  describe('Updating trainer', () => {
    it('Should update the trainer_id parameters', () => {
      chai.request(serverPort)
        .get('/training')
        .end((err, res) => {
          chai.request(serverPort)
            .put('/training/' + res.body[0]._id + '/trainer')
            .send({
              trainer_id: '59c60bcf913627130c595c93'
            })
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

  });
});