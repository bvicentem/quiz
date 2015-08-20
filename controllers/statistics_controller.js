var models = require('../models/models.js');
var Sequelize = require('sequelize');

var statistics = {
       	questions: 0,
        comments: 0,
        unpublished: 0,
        published: 0
 };
   
exports.calculate = function(req, res, next) {
        /*Sequelize.Promise.all([
        	models.Quiz.count(),
			models.Comment.count(),
			models.Comment.countUnpublished(),
			models.Comment.countCommentedQuizes()
		]).then( function( values ){
			statistics.questions=values[0];
			statistics.questions=values[1];
			statistics.questions=values[2];
			statistics.questions=values[3];
		})*/

        models.Quiz.count()
        .then(function(questions) {
            statistics.questions = questions;
            return models.Comment.count();
        })
        .then(function(comments){
            statistics.comments = comments;
            return models.Comment.countUnpublished();
        })
        .then(function(unpublished){
        	statistics.unpublished = unpublished;
        	return models.Comment.countCommentedQuizes();
        })
         .then(function(published){
        	statistics.published = published;
         })
        .catch(function(error) {next(error)})
        .finally(function(){next()});
};
   
exports.show = function(req, res) {
        res.render('quizes/statistics', {statistics: statistics, errors: []});
 };