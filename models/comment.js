module.exports = function(sequelize, DataTypes){
	return sequelize.define('Comment',
				{ 	texto: {
						type: DataTypes.STRING,
						validate: { notEmpty: { msg: "-> Falta Comentario" }}
					},
					autor: {
						type: DataTypes.STRING,
						validate: { notEmpty: { msg: "-> Falta autor del comentario" }}
					},
					publicado: {
						type: DataTypes.BOOLEAN,
						dafaultValue: false

					}

				},
				{
					classMethods: {	
						count: function () {
							return this.aggregate('QuizId', 'count', { distinct: false })
						},
						countUnpublished: function () {
		    				return this.count({ where: { publicado: false } });
		    			},
						countCommentedQuizes: function () {
							return this.aggregate('publicado', 'count', { distinct: false })
						}	
					}
				});
};

