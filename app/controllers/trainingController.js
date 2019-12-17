import Responder from '../../lib/expressResponder';
import { Training } from '../models/index';
import { ParameterInvalidError, BadRequestError, ServiceUnavailableError, ForbiddenError } from '../errors';
import Trello from '../../lib/trello';
import _ from 'lodash';
export default class TrainingController {
	static checkKeysType(input) {
		if (_.isString(input) && input.match(/^[a-z0-9]+$/i) && input.trim().length == 24) return true;
		return false;
	}
	static hasBeenSet(input, body) {
		let checkIfSet = [];
		checkIfSet.push(input);
		let keySet = _.every(checkIfSet, _.partial(_.has, body));
		if (keySet) return true;
		return false;
	}
	static async show(req, res) {
		try {
			let trainings = await Training.find();
			Responder.success(res, trainings);
		} catch (error) {
			Responder.operationFailed(res, new BadRequestError('Bad Request'));
		}
	}

	static async showById(req, res) {
		try {
			let training = await Training.findOne({
				_id: req.params.id
			});
			if (training === null) return Responder.operationFailed(res, new ParameterInvalidError('No Results'));
			Responder.success(res, training);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
		}
	}

	static async add(req, res) {
		let record, requiredKeys, allKeysSet, keysNotAllowed, keysTypes;
		requiredKeys = [ 'trainer_id', 'trainee_id', 'program_id' ];
		allKeysSet = _.every(requiredKeys, _.partial(_.has, req.body));
		if (
			TrainingController.hasBeenSet('next_task_index', req.body) ||
			TrainingController.hasBeenSet('completion_time', req.body) ||
			TrainingController.hasBeenSet('trelloBoard', req.body) ||
			TrainingController.hasBeenSet('trelloListId', req.body) ||
			TrainingController.hasBeenSet('state', req.body)
		)
			return Responder.operationFailed(
				res,
				new BadRequestError('Only trainer_id,trainee_id,program_id should be passed')
			);
		if (!allKeysSet)
			return Responder.operationFailed(
				res,
				new BadRequestError('trainee_id,trainer_id,program_id are mandatory fields')
			);
		if (
			!TrainingController.checkKeysType(req.body.trainer_id) ||
			!TrainingController.checkKeysType(req.body.trainee_id) ||
			!TrainingController.checkKeysType(req.body.program_id)
		)
			return Responder.operationFailed(
				res,
				new BadRequestError('trainee_id,trainer_id,program_id should be valid object ids')
			);
		try {
			let records = await Training.create(req.body);
			record = records;
			return Trello.createBoard(record._id, 'tist');
		} catch (err) {
			console.log('Training creation failed');
		}
		try {
			await Trello.updateToDoListId(record._id);
		} catch (err) {
			console.log('Trello board creation failed');
		}
		try {
			await Trello.addContributor(record.trainer_id, record.trainee_id);
		} catch (err) {
			console.log('Trello updation ToDoList failed');
		}
		try {
			await Trello.createList('In Review');
		} catch (err) {
			console.log('Trello adding contributor failed');
		}
		try {
			await Trello.createList('Open');
		} catch (err) {
			console.log('Trello InReview list creation failed');
		}
		try {
			await Trello.completeProcess();
		} catch (err) {
			console.log('Trello Open list creation failed');
		}
	}

	static async remove(req, res) {
		try {
			let training = await Training.findOneAndRemove({
				_id: req.params.id
			});
			if (training === null)
				return Responder.operationFailed(res, new ParameterInvalidError('training not found'));
			Responder.deleted(res);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Invalid Id'));
		}
	}
	static async update(req, res) {
		let requiredKeys = [ 'trainer_id' ];
		let allKeysSet = _.every(requiredKeys, _.partial(_.has, req.body));
		if (!allKeysSet) return Responder.operationFailed(res, new BadRequestError('trainer_id is mandatory'));
		if (!TrainingController.checkKeysType(req.body.trainer_id))
			return Responder.operationFailed(res, new BadRequestError('trainer_id should be a valid objectId'));
		try {
			let update = await Training.update(
				{
					_id: req.params.id
				},
				{
					trainer_id: req.body.trainer_id
				}
			);
			if (update.n === 0) return Responder.operationFailed(res, new BadRequestError('Training not found'));
			if (!update.ok) return Responder.operationFailed(res, new BadRequestError('Wrong body pattern'));
			else Responder.success(res, update);
		} catch (err) {
			Responder.operationFailed(res, new ParameterInvalidError('Training not found'));
		}
	}
}
