
var { EventEmitter } = require('fbemitter');

module.exports = {
    emitter: new EventEmitter(),
    LOGIN_STATUS: 'false',
    LOGOUT_EVENT: 'logout'
};
