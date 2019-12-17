import express from 'express';
import trainingController from '../controllers/trainingController';

const initTrainingRoutes = () => {
  let trainingRoutes = express.Router();

  trainingRoutes.get('/', trainingController.show);
  trainingRoutes.get('/:id', trainingController.showById);
  trainingRoutes.post('/', trainingController.add);
  trainingRoutes.delete('/:id', trainingController.remove);
  trainingRoutes.put('/:id', trainingController.update);
  // trainingRoutes.put('/:id/drift', trainingController.showAllTrainings);

  return trainingRoutes;
};

export default initTrainingRoutes;