
import Request from 'request';
import moment from 'moment';
import {Proxy} from './proxy';

const endpoint = 'http://127.0.0.1:3000/vlc/api/integration/1.0';
const proxy = new Proxy(endpoint);


export default {
  list: (callback) => {
    proxy.list((err, res) => callback(err, res));
  },

  create: (username, password, callback) => {
    const account = {username}
    proxy.create(account, password, (err, res) => callback(err, res));
  },

  disable: (username, callback) => {
    proxy.disable(username, (err, res) => callback(err, res));
  },
  
  enable: (username, callback) => {
    proxy.enable(username, (err, res) => callback(err, res));
  },

  changePassword: (username, password, callback) => {
    proxy.changePassword(username, password, (err, res) => callback(err, res));
  },

  reduceUsage: (username, amount, callback) => {
    proxy.reduceUsage(username, amount, (err, res) => callback(err, res));
  },

  setLimit: (username, limit, callback) => {
    proxy.setLimit(username, limit, (err, res) => callback(err, res));
  },

  setUsage: (username, usage, callback) => {
    proxy.setUsage(username, usage, (err, res) => callback(err, res));
  },

  getAccount: (username, callback) => {
    proxy.get(username, (err, res) => callback(err, res));
  },

  getAccountTime: (username, callback) => {
    const parameters = {
      from: moment().subtract(90, 'days').toISOString(),
      to: moment().toISOString()
    };

    proxy.getAccountTime(parameters, username, (err, res) => callback(err, res));
  },

  getTotalTime: (callback) => {
    const parameters = {
      from: moment().subtract(90, 'days').toISOString(),
      to: moment().toISOString()
    };

    proxy.getTotalTime(parameters, (err, res) => callback(err, res));
  }
}

/*
    Request.post({
      url : endpoint,
      json : {
        method: 'getTotalTime',
        params: {
          parameters: {
            from: moment().subtract(90, 'days').toISOString(),
            to: moment().toISOString()
          }
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
    */


    /*

    export default {
  list: (callback) => {
    Request.post({
      url : endpoint,
      json : {
          method: 'list'
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  create: (username, password, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'create',
        params: {
          account: {
            username
          },
          password
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  disable: (username, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'disable',
        params: {
          username
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },
  
  enable: (username, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'enable',
        params: {
          username
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  changePassword: (username, password, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'changePassword',
        params: {
          username,
          password
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  reduceUsage: (username, amount, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'reduceUsage',
        params: {
          username,
          amount
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  setLimit: (username, limit, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'setLimit',
        params: {
          username,
          limit
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  setUsage: (username, usage, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'setUsage',
        params: {
          username,
          usage
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  getAccount: (username, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'get',
        params: {
          username
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  getAccountTime: (username, callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'getAccountTime',
        params: {
          parameters: {
            from: moment().subtract(90, 'days').toISOString(),
            to: moment().toISOString()
          },
          username
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  },

  getTotalTime: (callback) => {
    Request.post({
      url : endpoint,
      json : {
        method: 'getTotalTime',
        params: {
          parameters: {
            from: moment().subtract(90, 'days').toISOString(),
            to: moment().toISOString()
          }
        }
      }
    }, (error, response, body) => {
      callback(error, body);
    });
  }
}
*/