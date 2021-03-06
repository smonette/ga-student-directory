module.exports = function (sequelize, DataTypes){

  var Course = sequelize.define('course',{
      id: {
        type: DataTypes.INTEGER,
        unique: true 
      },
      name: DataTypes.STRING,
      topic: DataTypes.STRING,
      time: DataTypes.STRING,
      
      
  },
  {   classMethods: {
      associate: function(db){
        Course.hasMany(db.user);
      }
    }
  })

  return Course;
}

