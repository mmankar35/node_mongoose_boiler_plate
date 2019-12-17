import mongoose from 'mongoose';
import { Employee } from '../app/models';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const serverPort = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Employee', () => {
	describe('GET employees', () => {
		it('Should get all the employees on /employees GET', () => {
			chai.request(serverPort).get('/employees').end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.should.be.json;
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('name');
				res.body[0].should.have.property('technologies');
				res.body[0].should.have.property('roles');
				res.body[0].should.have.property('designation');
				done();
			});
		});
	});
	describe('Get employee by ID', () => {
		it('should get single Employee on /employees/<id> GET', () => {
			let newEmployee = new Employee({
				name: 'test',
				DOB: '1996-06-10',
				gender: 'male',
				email: 'test@grepruby.com',
				designation: 'Solution Engineer',
				roles: [ 'trainee' ],
				technologies: [ 'node' ]
			});
			newEmployee
				.save((err, data) => {
					chai.request(serverPort).get('/employees/' + data._id).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('_id');
						res.body[0].should.have.property('name');
						res.body[0].should.have.property('technologies');
						res.body[0].should.have.property('DOB');
						res.body[0].should.have.property('gender');
						res.body[0].should.have.property('email');
						res.body[0].should.have.property('roles');
						res.body[0].should.have.property('designation');
						res.body[0].name.should.equal('test');
						res.body[0].technologies.should.equal([ 'node' ]);
						res.body[0].DOB.should.equal('1996-06-10T00:00:00.000Z');
						res.body[0].gender.should.equal('male');
						res.body[0].email.should.equal('test@grepruby.com');
						res.body[0].designation.should.equal('Solution Engineer');
						res.body[0].roles.should.equal([ 'trainee' ]);
						res.body[0]._id.should.equal(employee.id);
						res.body[0].should.have.property('deleted');
						res.body[0].should.have.property('leaves');
						done();
					});
				})
				.then((data) => Employee.remove({ email: 'test@grepruby.com' }));
		});
		it('Should send error if invalid id is supplied', () => {
			chai.request(serverPort).get('/employees/' + '59c4dd9f9d4f1870e').end((err, res) => {
				res.should.have.status(404);
				res.should.be.a.json;
				res.body.should.be.a('object');
				res.body.should.have.property('reason');
				res.body.reason.should.equal('Invalid ID');
				done();
			});
		});
	});
	describe('Post Employee', () => {
		it('Should have body with required properties and deleted, leaves should be automatically created', () => {
			chai
				.request(serverPort)
				.post('/employees')
				.send({
					name: 'test',
					DOB: '1996-06-10',
					gender: 'male',
					email: 'test@grepruby.com',
					designation: 'Solution Engineer',
					roles: [ 'trainee' ],
					technologies: [ 'node' ]
				})
				.end((err, res) => {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.property('_id');
					res.body.should.have.property('name');
					res.body.should.have.property('technologies');
					res.body.should.have.property('DOB');
					res.body.should.have.property('gender');
					res.body.should.have.property('email');
					res.body.should.have.property('roles');
					res.body.should.have.property('designation');
					res.body.name.should.equal('test');
					res.body.technologies.should.equal([ 'node' ]);
					res.body.DOB.should.equal('1996-06-10T00:00:00.000Z');
					res.body.gender.should.equal('male');
					res.body.email.should.equal('test@grepruby.com');
					res.body.designation.should.equal('Solution Engineer');
					res.body.roles.should.equal([ 'trainee' ]);
					res.body._id.should.equal(employee.id);
					res.body.should.have.property('deleted');
					res.body.should.have.property('leaves');
					res.body.deleted.should.be.equal(false);
					res.body.leaves.should.be.equal([ null ]);
					done();
				});
		});
	});
	describe('Put Employee', () => {
		it('Should update Employee', () => {
			chai.request(serverPort).get('/employees').end((err, res) => {
				chai
					.request(serverPort)
					.put('/employees/' + res.body[0]._id)
					.send({ name: 'akshay' })
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
	describe('Remove employee', () => {
		it('Should soft delete Employee', () => {
			chai.request(serverPort).get('/employees').end((err, res) => {
				chai.request(serverPort).delete('/employees/' + res.body[0]._id).end((error, response) => {
					response.should.have.status(204);
					response.body.should.be.empty;
					done();
				});
			});
		});
		it('Should give error if invalid ID is supplied', () => {
			chai.request(serverPort).get('/employees/' + '59c4dd9f9d4f1870e').end((err, res) => {
				res.should.have.status(404);
				res.should.be.a.json;
				res.body.should.be.a('object');
				res.body.should.have.property('reason');
				res.body.reason.should.equal('invalid ID');
				done();
			});
		});
	});
	describe('Leaves', () => {
		it('should add leaves on /employees/<id>/leaves POST', () => {
			chai.request(serverPort).get('/employees').end((err, res) => {
				chai
					.request(serverPort)
					.post('/employees/' + res.body[0]._id + '/leaves')
					.send([ '2017-07-15' ])
					.end((error, response) => {
						response.should.have.status(200);
						response.should.be.a.json;
						response.body.should.be.a('object');
						response.body.should.have.property('message');
						response.body.message.should.equal('leaves added');
					});
			});
		});
		it('should give erron on wrong body on /employees/<id>/leaves POST', () => {
			chai.request(serverPort).get('/employees').end((err, res) => {
				chai
					.request(serverPort)
					.post('/employees/' + res.body[0]._id + '/leaves')
					.send({})
					.end((error, response) => {
						response.should.have.status(400);
						response.should.be.a.json;
						response.body.should.be.a('object');
						response.body.should.have.property('reason');
						response.body.message.should.equal('Wrong body pattern');
					});
			});
		});
		it('should remove leaves on /employees/<id>/leaves DELETE', () => {
			chai.request(serverPort).get('/employees').end((err, res) => {
				chai
					.request(serverPort)
					.delete('/employees/' + res.body[0]._id + '/leaves')
					.send({ dates: [ '2017-07-15' ] })
					.end((error, response) => {
						response.should.have.status(204);
						response.body.should.be.empty;
					});
			});
		});
		it('should give erron on wrong body on /employees/<id>/leaves DELETE', () => {
			chai.request(serverPort).get('/employees').end((err, res) => {
				chai
					.request(serverPort)
					.delete('/employees/' + res.body[0]._id + '/leaves')
					.send({})
					.end((error, response) => {
						response.should.have.status(400);
						response.should.be.a.json;
						response.body.should.be.a('object');
						response.body.should.have.property('reason');
						response.body.message.should.equal('Wrong body pattern');
					});
			});
		});
	});
});
