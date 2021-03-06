/* global exports */
const localhost =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';
const localKoku = 'http://' + localhost + ':8000';

exports.routes = {
  '/api/cost-management/': {
    host: localKoku,
  },
  '/apps/cost-management': {
    host: `http://${localhost}:8002`,
  },
  '/beta/apps/cost-management': {
    host: `http://${localhost}:8002`,
  },
  '/cost-management': {
    host: `http://${localhost}:8002`,
  },
  '/beta/cost-management': {
    host: `http://${localhost}:8002`,
  },
};
