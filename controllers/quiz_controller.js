var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(
        function(quiz){
          if(quiz)
            {req.quiz = quiz;next();}
          else
            {next (new Error('No existe quizId ' + quizId));}
        }
  ).catch(function(error){ next(error);});
};

// GET /quizes
// Si hay un parametro search:
// Remplaza el principio del string, los espacios, y el fin del string con % 
// y lo guarda en la variable search
// con la opcion "order:" ordena las preguntas filtradas

 exports.index = function(req, res) {
 
	var string = req.query.search;

	if(string == null){
	  models.Quiz.findAll().then(function(quizes) {
 		res.render('quizes/index.ejs', { quizes: quizes});
		}).catch(function(error){ next(error);});
	}else{
	  string = string.replace(" ","%");
	  string = "%"+string+"%";
	  models.Quiz.findAll({where:["pregunta like ?", string], order: 'pregunta ASC'}).then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes});
		}).catch(function(error){ next(error);});
 	}

};


// GET /quizes/:id

exports.show = function(req,res) {
   models.Quiz.findById(req.params.quizId).then(function(quiz){
	res.render('quizes/show', {quiz: req.quiz})
   })
};

// GET /quizes/:id/answer

exports.answer = function(req,res) {
   models.Quiz.findById(req.params.quizId).then(function(quiz){
	if(req.query.respuesta === req.quiz.respuesta){
		res.render('quizes/answer', 
                           {quiz:quiz, respuesta: 'Correcto'});
		} else {
		res.render('quizes/answer', 
                           {quiz:req.quiz, respuesta: 'Incorrecto'});
	}
   })
};


//GET author

exports.author = function (req, res){res.render ('author',{});
};





