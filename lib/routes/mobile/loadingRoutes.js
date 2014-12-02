/* list of all routes */
var rosettaRoutes = require('./rosetta');
function register(app)
{
  rosettaRoutes.registerRoutes(app);
  // add your routes here ,,,,
}
module.exports.register = register;



