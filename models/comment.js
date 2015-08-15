// definicion de mondelo de comentario con validacion

module.exports = function(sequelize, DataTypes) {
 return sequelize.define(
	 'Comment',
	 { texto: {
 	   type: DataTypes.STRING,
 	   validate: { notEmpty: { msg: "-> Comentario vacío." } }
	   }	
	 }
 );
}
