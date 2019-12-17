import express from 'express';
import HolidayController from '../controllers/holidayController';

const initHolidayRoutes = () => {
  const holidayRoutes = express.Router();

  holidayRoutes.get('/', HolidayController.show);
  holidayRoutes.post('/', HolidayController.create);
  holidayRoutes.delete('/', HolidayController.remove);

  return holidayRoutes;
};

export default initHolidayRoutes;
