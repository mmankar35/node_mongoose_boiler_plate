import Responder from '../../lib/expressResponder';
import mongoose from 'mongoose';
import { Employee } from '../models';
import { BadRequestError, ServiceUnavailableError } from '../errors';
import _ from 'lodash';

const validate = (body) => {
	const map = _.map(body.dates, function(dates) {
		dates = new Date(dates);
		if (dates == 'Invalid Date') return false;
		return dates;
	});
	if (_.isUndefined(body.dates) || !_.isArray(body.dates) || _.isEmpty(body.dates) || _.includes(map, false))
		return { message: 'Date must be valid' };
};

export default class LeavesController {
	static async add(req, res) {
		const leaveValidate = validate(req.body);
		if (!_.isUndefined(leaveValidate) && leaveValidate.hasOwnProperty('message'))
			return Responder.operationFailed(res, new BadRequestError(leaveValidate.message));

		try {
			let employees = await Employee.update(
				{ _id: req.params.employeeId },
				{ $pushAll: { leaves: req.body.dates } }
			);
			Responder.success(res, 'leaves added');
		} catch (err) {
			Responder.operationFailed(res, new ServiceUnavailableError('could not connect'));
		}
	}

	static async remove(req, res) {
		const leaveValidate = validate(req.body);
		if (!_.isUndefined(leaveValidate) && leaveValidate.hasOwnProperty('message'))
			return Responder.operationFailed(res, new BadRequestError(leaveValidate.message));

		try {
			let employees = await Employee.update(
				{ _id: req.params.employeeId },
				{ $pullAll: { leaves: req.body.dates } }
			);
			Responder.deleted(res);
		} catch (err) {
			Responder.operationFailed(res, new ServiceUnavailableError('could not connect'));
		}
	}
}
