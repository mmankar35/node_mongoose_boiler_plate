import express from 'express';
import {EmployeeController,LeaveController} from '../controllers';

const initEmployeeRoutes = () => {
  const employeeRoutes = express.Router();

  employeeRoutes.get('/', EmployeeController.showAll);
  employeeRoutes.get('/:employeeId', EmployeeController.showOne);
  employeeRoutes.post('/', EmployeeController.create);
  employeeRoutes.put('/:employeeId', EmployeeController.update);
  employeeRoutes.delete('/:employeeId', EmployeeController.remove);
  employeeRoutes.post('/:employeeId/leaves', LeaveController.add);
  employeeRoutes.delete('/:employeeId/leaves', LeaveController.remove)

  return employeeRoutes;
};

export default initEmployeeRoutes;
