var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){

  models.Quiz.find({
             where: { id: Number(quizId) },
             include: [{ model: models.Comment }]
             }).then(function(quiz) {
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

exports.index = function(req, res){
	if(req.query.search) { // texto seleccionado
                var filtro = (req.query.search || '').replace(" ", "%");
                models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta ASC'}).then(function(quizes){
                res.render('quizes/index', {quizes: quizes, errors: []});
                }).catch(function(error) { next(error);});

	}else {     // tematica seleccionada

          if(req.query.tema) {
                var filtro = (req.query.tema || '');
                models.Quiz.findAll({where:["tema like ?", '%'+filtro+'%'],order:'tema ASC'}).then(function(quizes){
                res.render('quizes/index', {quizes: quizes, errors: []});
                }).catch(function(error) { next(error);});

	  } else {    // nada seleccionado
                models.Quiz.findAll().then(function(quizes){
                res.render('quizes/index', {quizes: quizes, errors: []});
               }).catch(function(error) { next(error);});
          }       
        }
};


// GET /quizes/:id

exports.show = function(req,res) {
   models.Quiz.findById(req.params.quizId).then(function(quiz){
	res.render('quizes/show', {quiz: req.quiz, errors:[]})
   })
};

// GET /quizes/:id/answer

exports.answer = function(req,res) {
   models.Quiz.findById(req.params.quizId).then(function(quiz){
	if(req.query.respuesta === req.quiz.respuesta){
		res.render('quizes/answer', 
                           {quiz:quiz, respuesta: 'Correcto', errors:[]});
		} else {
		res.render('quizes/answer', 
                           {quiz:req.quiz, respuesta: 'Incorrecto', errors:[]});
	}
   })
};


// GET /quizes/new
exports.new = function(req, res){
       var quiz = models.Quiz.build(    //crea objeto quiz
           {pregunta: "Pregunta", Respuesta: "Respuesta", Tematica: "Tematica"}
           );
       res.render('quizes/new',{quiz: quiz, errors:[]});
};

// GET /quizes/create
exports.create = function(req, res){
 var quiz = models.Quiz.build( req.body.quiz );

 // guarda en DB solo los campos pregunta y respuesta de quiz. 
 // Evitamos virus por entrada de mas parametros en la DB


 quiz.validate().then(function(err){
     if(err){
       res.render('quizes/new',{quiz: quiz, errors: err.errors});
    }else{
       quiz.save({fields: ["pregunta", "respuesta","tematica"]}).then(function(){
       res.redirect('/quizes')})
    }
 });
};


// GET quizes/:id/edit
exports.edit = function(req, res){
 var quiz = req.quiz;
 res.render('quizes/edit',{quiz: quiz, errors: []});
};


// PUT /quizes/:id
exports.update = function(req, res){
 req.quiz.pregunta = req.body.quiz.pregunta;
 req.quiz.respuesta = req.body.quiz.respuesta;
 req.quiz.tematica = req.body.quiz.tematica;

 req.quiz.validate().then(
    function(err){
       if(err){
         res.render('quizes/edit', {quiz: req.quiz, erros: err.errors});
       }else{
         req.quiz.save( {fields: ["pregunta", "respuesta", "tematica"]})
         .then( function(){ res.redirect('/quizes');});
       }
   });
};


// DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then( function() {
     res.redirect('/quizes');
  }).catch(function(error){ next(error)});
};


//GET author

exports.author = function (req, res){res.render ('author',{});
};





