const mongoose = require("mongoose");
import {Task} from '../app/models';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const serverPort = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Task', () => {
  describe('Get Tasks', () => {
    it('Should get all the tasks', (done) => {
      chai.request(serverPort)
        .get('/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.should.be.json;
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('trello');
          res.body[0].should.have.property('emails');
          res.body[0].should.have.property('duration');
          res.body[0].trello.should.have.property('title');
          res.body[0].trello.should.have.property('description');
          done();
        });
    });
    it('Should get task if correct Id is provided', (done) => {
      chai.request(serverPort)
          .get('/tasks')
          .end((err, res) => {
            chai.request(serverPort)
              .get('/tasks/' + res.body[0]._id)
              .end((error, response) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('trello');
                res.body[0].should.have.property('emails');
                res.body[0].should.have.property('duration');
                res.body[0].trello.should.have.property('title');
                res.body[0].trello.should.have.property('description');
                done();
            });
        });     
      });
    it('Should get not found status if correct id is not supplied', (done) => {
      chai.request(serverPort)
        .get('/tasks/' + '59c4dd9f9d4f1870e')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a.json;
          res.should.be.a('object');
          done();
      });
    });
  });
  describe('Post Tasks', () => {
    it('Should have trello.description, trello.title, duration, email properties', (done) => {
      chai.request(serverPort)
        .post('/tasks')
        .send({duration: 200, emails: [
            "Email to shoot to trainee"
        ],
        trello: {
            description: [
                "It is Node Project"
            ],
            title: [
                "Node Project"
            ]
          }
         })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('trello');
          res.body.should.have.property('emails');
          res.body.should.have.property('duration');
          res.body.trello.should.have.property('title');
          res.body.trello.should.have.property('description');
          done();
      });
    });
    it('Should not post without trello.description and trello.title', (done) => {
      chai.request(serverPort)
        .post('/tasks')
        .send({duration: 200, emails: 'Email to shoot to trainee'})
        .end((err, res) => {
          res.should.have.status(404);
          done();
      });
    });
    it('Should not post without duration', (done) => {
      chai.request(serverPort)
        .post('/tasks')
        .send({emails: 'Email to shoot to trainee'})
        .end((err, res) => {
          res.should.have.status(404);
          done();
      });
    });
    it('Should not post without emails', (done) => {
      chai.request(serverPort)
        .post('/tasks')
        .send({duration: 200})
        .end((err, res) => {
          res.should.have.status(404);
          done();
      });
    });
  });
  describe('Put tasks', () => {
    it('should be able to update task schema', (done) => {
      chai.request(serverPort)
          .get('/tasks')
          .end((err, res) => {
            chai.request(serverPort)
              .put('/tasks/' + res.body[0]._id)
              .send({duration: 400})
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
  describe('Delete Tasks', () => {
    it('Should be able to Delete task if valid id is provided', (done) => {
      chai.request(serverPort)
        .get('/tasks')
        .end((err, res) => {
          chai.request(serverPort)
            .delete('/tasks/' + res.body[0]._id)
            .end((error, response) => {
              response.should.have.status(204);
              done();
          });
       });
    });
    it('Should not be able to delete tasks if valid Id is not provided', (done) => {
      chai.request(serverPort)
        .delete('/tasks/' + '59c4dd9f9d4ff718c68701')
        .end((error, response) => {
          response.should.have.status(404);
          done();
       });
    });
  });
});