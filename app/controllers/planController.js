import Responder from '../../lib/expressResponder';
import { Plan } from '../models';
import { ParameterInvalidError, BadRequestError, ServiceUnavailableError, ForbiddenError } from '../errors';

export default class PlanController {
	static async getAllPlans(req, res) {
		// try {
		// 	let plans = getFromDB;
		// 	Responder.success(res, plans);
		// } catch (errorOnDBOp) {
		// 	Responder.operationFailed(res, errorOnDBOp);
		// }
		try {
			let plans = await Plan.find({});
			Responder.success(res, plans);
		} catch (err) {
			Responder.operationFailed(res, new BadRequestError('Bad Request'));
		}
	}

	static async getPlanById(req, res) {
		try {
			let plan = await Plan.findOne({ _id: req.params.planId });
			Responder.success(res, plan);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
		}
	}

	static async createPlans(req, res) {
		if (req.body.hasOwnProperty('tasks'))
			return Responder.operationFailed(res, new ForbiddenError('Tasks creation is not allowed'));
		try {
			let plan = await Plan.create(req.body);
			Responder.created(res, plan);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Schema must be correct'));
		}
	}

	static async updatePlans(req, res) {
		Plan.findById(req.params.planId, (err, plan) => {
			if (err) return Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
			if (req.body.hasOwnProperty('tasks'))
				return Responder.operationFailed(res, new ForbiddenError('Tasks cannot be modified'));

			try {
				let newPlan = plan.update({ $set: req.body });
				Responder.success(res, newPlan);
			} catch (err) {
				Responder.operationFailed(res, new BadRequestError('Bad request'));
			}
		});
	}

	static async removePlans(req, res) {
		try {
			let plan = await Plan.remove({ _id: req.params.planId });
			Responder.deleted(res);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
		}
	}

	static updatePlanTask(req, res) {
		Plan.findById(req.params.planId, (err, plan) => {
			if (err) return Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
			let body = req.body;
			let keys = Object.keys(body);
			if (keys.length > 2) {
				Responder.operationFailed(res, new ForbiddenError('Only task and status can be modified'));
			}
			if (
				keys.length == 2 &&
				keys[0] !== 'status' &&
				keys[0] !== 'tasks' &&
				keys[1] !== 'tasks' &&
				keys[1] !== 'status'
			) {
				Responder.operationFailed(res, new ForbiddenError('Only task and status can be modified'));
			}
			if (keys.length == 1 && keys[0] !== 'status' && keys[0] !== 'tasks')
				Responder.operationFailed(res, new ForbiddenError('Only task and status can be modified'));

			plan.status = 'Drafted';
			plan.set(req.body);
			plan.save((err) => {
				if (err) return Responder.operationFailed(res, new BadRequestError('Bad request'));
				Responder.success(res, { message: 'Updated Plan' });
			});
		});
	}

	static removePlanTask(req, res) {
		Plan.findById(req.params.planId, (err, plan) => {
			if (err) return Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
			plan.update({ $pull: { tasks: req.params.taskId } }, (err) => {
				if (err) return Responder.operationFailed(res, new ServiceUnavailableError('Service not available'));
				Responder.success(res, { message: 'Plan updated' });
			});
		});
	}
}
