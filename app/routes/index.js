import initPlanRoutes from './planRoutes';
import initEmployeeRoutes from './employeeRoutes';
import initHolidayRoutes from './holidayRoutes';
import initTaskRoutes from './taskRoutes';
import initTrainingRoutes from './trainingRoutes';

const initRoutes = (app) => {
  app.use('/employees',initEmployeeRoutes());
  app.use('/holidays', initHolidayRoutes());
  app.use('/plans', initPlanRoutes());
  app.use('/tasks', initTaskRoutes());	
  app.use(`/training`, initTrainingRoutes());
};

export default initRoutes;