import {TaskController} from '../controllers';
import express from 'express';

const initTaskRoutes = () => {

  const app = express.Router();
  app.get('/', TaskController.getAllTasks); 
  app.post('/', TaskController.createTasks);
  app.put('/:taskId', TaskController.updateTasks);
  app.delete('/:taskId', TaskController.removeTasks);
  app.get('/:taskId', TaskController.getTaskById);
  return app;
};

export default initTaskRoutes;