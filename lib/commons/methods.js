/*
Here we are some commons methods ready to use by services,,,
validate register, check post params with the correct schema validator,,,
 */
var validator = require('../utils/validator');

function validateRegister(register, schema, callback) {
	var result = validator.validate(register, schema.schema);
	callback(result, register);
}
module.exports.validateRegister = validateRegister;
