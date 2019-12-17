import Responder from '../../lib/expressResponder';
import { Plan } from '../models';
import { Task } from '../models';
import { ParameterInvalidError, BadRequestError, ServiceUnavailableError, ForbiddenError } from '../errors';

export default class TaskController {
	static async getAllTasks(req, res) {
		try {
			let tasks = await Task.find({});
			Responder.success(res, tasks);
		} catch (err) {
			Responder.operationFailed(res, new BadRequestError('Bad Request'));
		}
	}

	static async getTaskById(req, res) {
		try {
			let task = Task.findOne({ _id: req.params.taskId });
			Responder.success(res, task);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
		}
	}

	static async createTasks(req, res) {
		try {
			let task = await Task.create(req.body);
			Responder.created(res, req.body);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Schema must be correct'));
		}
	}

	static async updateTasks(req, res) {
		try {
			let update = await Task.update({ _id: req.params.taskId }, req.body);
			if (!update.ok) return Responder.operationFailed(res, new BadRequestError('Wrong body pattern'));
			else Responder.success(res, update);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Task not found'));
		}
	}

	static async removeTasks(req, res) {
		let id = req.params.taskId;
		Plan.update({ tasks: id }, { $pull: { tasks: id } }, { multi: true }, (err) => {
			if (err) return Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
		});
		try {
			let task = await Task.remove({ _id: id });
			Responder.deleted(res);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
		}
	}
}
