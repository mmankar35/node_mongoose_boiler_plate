import Responder from '../../lib/expressResponder';
import mongoose from 'mongoose';
import { Holiday } from '../models';
import { ServiceUnavailableError, BadRequestError } from '../errors';

const validate = (body) => {
	const map = _.map(body.dates, function(dates) {
		dates = new Date(dates);
		if (dates == 'Invalid Date') return false;
		return dates;
	});
	if (_.isUndefined(body.dates) || !_.isArray(body.dates) || _.isEmpty(body.dates) || _.includes(map, false))
		return { message: 'Date must be valid' };
};

export default class HolidayController {
	static async show(req, res) {
		try {
			let holidays = await Holiday.find({}, { _id: 0 }).exec();
			Responder.success(res, holidays);
		} catch (err) {
			Responder.operationFailed(res, new ServiceUnavailableError('collection not found'));
		}
	}

	static async create(req, res) {
		const leaveValidate = validate(req.body);
		if (!_.isUndefined(leaveValidate) && leaveValidate.hasOwnProperty('message'))
			return Responder.operationFailed(res, new BadRequestError(leaveValidate.message));

		try {
			let holidays = await Holiday.update({}, { $pushAll: { dates: req.body.dates } });
			Responder.created(res, holidays);
		} catch (err) {
			Responder.operationFailed(res, new BadRequestError('Wrong body pattern'));
		}
	}

	static async remove(req, res) {
		const leaveValidate = validate(req.body);
		if (!_.isUndefined(leaveValidate) && leaveValidate.hasOwnProperty('message'))
			return Responder.operationFailed(res, new BadRequestError(leaveValidate.message));

		try {
			let holidays = await Holiday.update({}, { $pullAll: { dates: req.body.dates } });
			Responder.deleted(res);
		} catch (err) {
			Responder.operationFailed(res, new BadRequestError('Wrong body pattern'));
		}
	}
}
