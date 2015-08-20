var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		where: { id: Number(quizId)},
		include: [{ model: models.Comment }]
	}).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next (new Error('No existe quizId ' + quizId));
			}
		}).catch(function(error){ next(error);});
};

exports.index = function(req, res) {
	
	var string = req.query.search;
	var tema = "%"+req.query.tema+"%";


	if(string == null){
		models.Quiz.findAll({order:[['tematica','ASC']]}).then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes, errors: []});
		}).catch(function(error){ next(error);});
	}else{
		string = string.replace(" ","%");
		string = "%"+string+"%";
		models.Quiz.findAll({where:{ pregunta:{ $iLike: string}, tematica:{ $iLike: tema}}, order:[['tematica','ASC']]}).then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes, errors: []});
	}).catch(function(error){ next(error);});
	}

};



// GET /quizes/question
exports.show = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz, errors: []})
	})
};


// GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === req.quiz.respuesta){
			res.render('quizes/answer',
				{ quiz: quiz, respuesta: 'Correcto', errors: []});
		}else{
			res.render('quizes/answer',
				{ quiz: req.quiz, respuesta: 'Incorrecto', errors: []});
		}
		
	})

};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{ pregunta: "pregunta", Respuesta: "respuesta", Tematica: "Tematica"});

		res.render('quizes/new',{quiz: quiz, errors: []});	
};

// GET /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

		// guarda en DB solo los campos pregunta,respuesta y tematica de quiz. Evitamos virus por entrada de mas parametros en la DB
		
		quiz.validate().then(function(err){
								if(err){
									res.render('quizes/new',{quiz: quiz, errors: err.errors});	
								}else{
									quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
																							res.redirect('/quizes')})
								}
							}
		
						);
};


// GET quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz;	
	res.render('quizes/edit',{quiz: quiz, errors: []});
};


exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

	req.quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else{
				req.quiz
				.save( {fields: ["pregunta", "respuesta", "tematica"]})
				.then( function(){ res.redirect('/quizes');});
			}
		});
};


exports.destroy = function(req, res){
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){ next(error)});
};
