var _ = require('lodash');
var langObj = {
    
};
function lang(key) {

    if (_.isBoolean(key)) {
        return key ? 'Да' : 'Нет';
    }

    return langObj[key] || key;
}

module.exports = lang;