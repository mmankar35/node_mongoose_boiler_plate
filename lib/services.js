import Responder from './expressResponder';
import { Plan, Employee, Holiday, Task, Training } from '../app/models';
import mongoose from 'mongoose';
import shootMail from './email';
import createTrelloCard from './trelloCards';

exports.Job = {
	on: '*/10 11-20 * * 1-5',
	job: async function() {
		try {
			let responses = await Training.find({ state: 'in progress' }).exec();
			let length = responses.length;
			for (let index = 0; index < length; index++) {
				let training = [];
				let emails, trello;
				let response = responses[index];
				try {
					await Employee.findOne({ _id: response.trainee_id }, { email: 1 }).exec((err, result) => {
						training[0] = result.email;
					});
				} catch (err) {
					console.log('Error Occuerd', err);
				}
				try {
					await Employee.findOne({ _id: response.trainer_id }, { email: 1 }).exec((err, result) => {
						training[1] = result.email;
					});
				} catch (err) {
					console.log('Error Occuerd', err);
				}
				try {
					await Plan.findOne({ _id: response.program_id }, { tasks: 1 }).exec((err, result) => {
						training[2] = result.tasks[response.nextTaskIndex];
					});
				} catch (err) {
					console.log('Error Occuerd', err);
				}
				try {
					await Task.findOne({ _id: training[2] }).exec((err, result) => {
						emails = result.emails;
						trello = result.trello;
					});
				} catch (err) {
					console.log('Error Occuerd', err);
				}
				return new Promise((resolve, reject) => {
					for (var pointer = 0; pointer < trello.title.length; pointer++) {
						createTrelloCard(response.trelloListId, trello.title[pointer], trello.description[pointer]);
					}
					for (var pointer = 0; pointer < emails.subject.length; pointer++) {
						shootMail(training[1], training[0], emails.subject[pointer], emails.body[pointer]);
					}
					resolve();
				});
			}
		} catch (err) {
			console.log('Error Occuerd', err);
		}
	},
	spawn: false
};
