import config from 'config';
import * as express from './express';
import * as mongoose from './mongoose';
import logger from './logger';
import cronjob from 'node-cron-job';

cronjob.setJobsPath('/home/rails/project/training-automation-aug-batch/lib/services.js');

const start = () => {
	const port = config.get('port');

	const appStartMessage = () => {
		const env = process.env.NODE_ENV;
		logger.debug(`API is Initialized`);
		logger.info(`App Name : ${config.app.title}`);
		logger.info(`Server Name : ${config.app.name}`);
		logger.info(`Environment  : ${env || 'development'}`);
		logger.info(`App Port : ${port}`);
		logger.info(`Process Id : ${process.pid}`);
	};

	mongoose.connect(() => {
		const app = express.init();
		app.listen(port, appStartMessage);
	});

	// cronjob.startJob('Job');
};

export default start;
