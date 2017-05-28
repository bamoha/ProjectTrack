var mongoose        = require("mongoose");
var Schema          = mongoose.Schema;
var bcrypt          = require("bcryptjs");


mongoose.connect('mongodb://localhost:27017/Ilab');
var db = mongoose.connection;

var userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
    group : String,
    mentor : String

});



var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback) {

	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(); 
    });
});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username : username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {

		if(err) throw err;
		callback(null, isMatch);
     
});
}