import {PlanController} from '../controllers';
import express from 'express';

const initPlanRoutes = () => {

  const app = express.Router();
  app.get('/', PlanController.getAllPlans);  
  app.post('/', PlanController.createPlans);
  app.put('/:planId', PlanController.updatePlans);
  app.delete('/:planId', PlanController.removePlans);
  app.get('/:planId', PlanController.getPlanById);
  app.put('/:planId/tasks', PlanController.updatePlanTask);
  app.delete('/:planId/tasks/:taskId', PlanController.removePlanTask);

  return app;
};

export default initPlanRoutes;