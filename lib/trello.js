import Responder from './expressResponder';
import {
  Training,
  Employee
} from '../app/models/index';
import {
  ParameterInvalidError,
  BadRequestError,
  ServiceUnavailableError,
  ForbiddenError
} from '../app/errors';
import mongoose from 'mongoose';
import {
  key,
  token
} from '../config/trelloKeys';
const request = require("request");
var boardId;

export default class Trello {
  static createBoard(trainingId, boardName) {
    let optionsBoardCreation = {
      method: 'POST',
      url: `https://api.trello.com/1/boards/?key=${key}&token=${token}`,
      qs: {
        name: boardName,
        desc: 'Welcome to Techracers'
      }
    }

    return new Promise(function(resolve, reject) {
      request(optionsBoardCreation, function(error, response, body) {
        if (body) {
          boardId = JSON.parse(body).id;
          Training.findOneAndUpdate({
            _id: trainingId
          }, {
            trelloBoard: boardId
          }, () => {
            console.log('trello board Process done');
          });
          resolve();
        } else reject();
      });
    });
  }

  static updateToDoListId(trainingId) {
    let optionsToDoList = {
      method: 'GET',
      url: `https://api.trello.com/1/boards/${boardId}/lists/?key=${key}&token=${token}`
    };

    return new Promise(function(resolve, reject) {
      request(optionsToDoList, function(error, response, body) {
        if (body) {
          var toDoBody = JSON.parse(body);
          Training.findOneAndUpdate({
            _id: trainingId
          }, {
            trelloListId: toDoBody[0].id
          }, () => {
            console.log('todo list Process done');
          });
          resolve();
        } else reject();
      });
    });
  }

  static createList(listName) {
    let options = {
      method: 'POST',
      url: `https://api.trello.com/1/lists/?key=${key}&token=${token}`,
      qs: {
        name: listName,
        idBoard: boardId
      }
    };

    return new Promise(function(resolve, reject) {
      request(options, function(error, response, body) {
        if (error) reject();
        resolve();
      });
    });
  }

  static addContributor(trainerId, traineeId) {
    let trainerEmail, traineeEmail;
    Employee.find({
        _id: trainerId
      }, {
        email: 1
      }).exec((err, result) => {
        trainerEmail = result[0].email;
      })
      .then(function addContributorTrainer(trainerEmail) {
        var options = {
          method: 'PUT',
          url: `https://api.trello.com/1/boards/${boardId}/members/?key=${key}&token=${token}`,
          qs: {
            email: trainerEmail[0].email
          },
          headers: {
            type: 'Admin'
          }
        };

        request(options, function(error, response, body) {
          if (error) throw new Error(error);
        });
      })
      .then(function findTraineeEmail() {
        Employee.find({
          _id: traineeId
        }, {
          email: 1
        }).exec((err, result) => {
          traineeEmail = result[0].email;
          var options = {
            method: 'PUT',
            url: `https://api.trello.com/1/boards/${boardId}/members/?key=${key}&token=${token}`,
            qs: {
              email: traineeEmail
            },
            headers: {
              type: 'Trainee'
            }
          };
          request(options, function(error, response, body) {
            if (error) throw new Error(error);
          });
        });
      });
  }

  static completeProcess() {
    console.log('All steps completed');
  }

  static createTrelloCard(listId, cardName, cardDescription) {
    let options = {
      method: 'POST',
      url: `https://api.trello.com/1/cards/?key=${key}&token=${token}`,
      qs: {
        idList: listId,
        name: cardName,
        desc: cardDescription
      }
    };
    request(options, (error, response, body) => {
      if (error) throw new Error(error);
      console.log(body);
    });
  }
}