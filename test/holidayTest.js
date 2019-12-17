import mongoose from 'mongoose';
import {Holiday} from '../app/models';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const serverPort = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Holiday', () => {
  describe('GET holidays', () => {
    it('Should get all the holidays on /holidays GET', () => {
      chai.request(serverPort)
        .get('/holidays')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('array');
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('dates');
          res.body[0].dates.should.be.an('array');
          done();
        });
    });
  });
  describe('POST holidays', () => {
    it('Should post holidays on /holidays POST', () => {
      chai.request(serverPort)
        .post('/holidays')
        .send({dates : ['2017-12-25']})
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.an('array');
          res.body[0].should.be.an('object');
          res.body[0].should.have.property('dates');
          res.body[0].dates.should.be.an('array');
          done();
        });
    });
    it('Should pass error on wrong pattern on /holidays POST', () => {
      chai.request(serverPort)
        .post('/holidays')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.have.property('reason');
          res.body.reason.should.be.an('Wrong body pattern');
          done();
        });
    });
  });
  describe('DELETE holidays', () => {
    it('Should delete holidays on /holidays DELETE', () => {
      chai.request(serverPort)
        .delete('/holidays')
        .send({dates : ['2017-12-25']})
        .end((err, res) => {
          res.should.have.status(204);
          res.should.be.json;
          res.body.should.be.empty;
          done();
        });
    });
    it('Should pass error on wrong pattern on /holidays DELETE', () => {
      chai.request(serverPort)
        .delete('/holidays')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.have.property('reason');
          res.body.reason.should.be.an('Wrong body pattern');
          done();
        });
    });
  });
});