/*
 this file define schema validator for data entry post calling.
 One route and service must have one schema file like this,,,,
 */
var schema = {
  properties: {
    from: {
      type: 'string',
      required: true,
      message: 'from language  property is required'
    },
    to: {
      type: 'string',
      required: true,
      message: 'to language  property is required'
    },
    message: {
      type: 'string',
      required: true,
      message: 'message text to translate property is required'
    }
  }
}
module.exports.schema = schema;
