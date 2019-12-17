import Responder from '../../lib/expressResponder';
import mongoose from 'mongoose';
import { Employee } from '../models';
import { ServiceUnavailableError, ParameterInvalidError, BadRequestError, ForbiddenError } from '../errors';
import _ from 'lodash';

const validate = (body) => {
	const regexName = /[a-z]/gi;
	const technologyKey = [ 'node', 'ruby' ];
	const rolesKey = [ 'trainee', 'trainer', 'hr', 'planner' ];
	const { name, technologies, DOB, gender, email, roles } = body;

	if (!_.isUndefined(name) && (!_.isString(name) || !name.trim() || name.match(regexName).length != name.length))
		return { message: 'Name must be valid' };

	if (!_.isUndefined(gender) && (gender !== 'male' && gender !== 'female'))
		return { message: 'gender can be male or female' };

	if (
		!_.isUndefined(technologies) &&
		(_.isEmpty(technologies) &&
			!_.isArray(technologies) &&
			!_.every(technologies, _.partial(_.includes, technologyKey)))
	)
		return { message: `roles must be an array having ${technologyKey} as possible values` };

	if (!_.isUndefined(email) && (!_.isString(email) || !email.trim())) return { message: 'Email must be valid' };

	if (
		(!_.isUndefined(roles) && (!_.isArray(roles) || _.isEmpty(roles))) ||
		!_.every(roles, _.partial(_.includes, rolesKey))
	)
		return { message: `roles must be an array having ${rolesKey} as possible values` };

	if (!_.isUndefined(DOB) && !_.isDate(new Date(DOB))) return { message: 'DOB must be a date' };
};

export default class EmployeeController {
	static async showOne(req, res) {
		try {
			let employeeData = await Employee.findOne({ _id: req.params.employeeId }, { _id: 0 });
			let result = [];
			if (employeeData == null) return err;
			Responder.success(res, employeeData);
			// try {
			// 	let managerData = await Employee.find(
			// 		{ _id: employeeData.reportingManager },
			// 		{
			// 			_id: 0,
			// 			name: 1,
			// 			designation: 1
			// 		}
			// 	);
			// 	managerData = managerData[0];
			// 	return {
			// 		employeeData: employeeData,
			// 		managerData: managerData
			// 	};
			// } catch (err) {
			// 	console.log('An error occured.', err);
			// }
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Invalid ID'));
		}
	}

	static async showAll(req, res) {
		try {
			let employees = await Employee.find(
				{ deleted: false },
				{
					name: 1,
					designation: 1,
					technologies: 1,
					_id: 1,
					roles: 1
				}
			);
			Responder.success(res, employees);
		} catch (err) {
			Responder.operationFailed(res, new ServiceUnavailableError('Could not connect'));
		}
	}

	static async create(req, res) {
		const requiredKeys = [ 'name', 'technologies', 'DOB', 'gender', 'email', 'roles' ];
		const body = req.body;

		if (!_.every(requiredKeys, _.partial(_.has, body)))
			return Responder.operationFailed(res, new BadRequestError('Property missing'));

		if (!_.isUndefined(body.leaves) || !_.isUndefined(body.deleted))
			return Responder.operationFailed(res, new ForbiddenError('Not Authorized'));

		const employeeValidate = validate(body);

		if (!_.isUndefined(employeeValidate) && employeeValidate.hasOwnProperty('message'))
			return Responder.operationFailed(res, new BadRequestError(employeeValidate.message));

		try {
			let created = await Employee.create(body);
			Responder.created(res, created);
		} catch (err) {
			Responder.operationFailed(res, new BadRequestError(err.message));
		}
	}

	static async update(req, res) {
		if (!_.isUndefined(req.body.leaves) || !_.isUndefined(req.body.deleted))
			return Responder.operationFailed(res, new ForbiddenError('Not Authorized'));
		const employeeValidate = validate(req.body);

		if (!_.isUndefined(employeeValidate) && employeeValidate.hasOwnProperty('message'))
			return Responder.operationFailed(res, new BadRequestError(employeeValidate.message));

		try {
			let update = await Employee.update({ _id: req.params.employeeId }, req.body);
			if (!update.ok) throw new ParameterInvalidError('Updation failed : No matching properties found');
			if (!update.n) throw new BadRequestError('Invalid Id');
			Responder.success(res, update);
		} catch (err) {
			Responder.operationFailed(res, err);
		}
	}

	static async remove(req, res) {
		try {
			let removed = await Employee.update({ _id: req.params.employeeId }, { deleted: true });
			if (!removed.n) throw new BadRequestError('Invalid Id');
			Responder.deleted(res);
		} catch (err) {
			Responder.operationFailed(res, err);
		}
	}
}
