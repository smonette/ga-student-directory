function Course(sequelize, DataTypes){

  return sequelize.define('course',{
      id: {
        type: DataTypes.INTEGER,
        unique: true 
      },
      coursename: DataTypes.STRING,
      topic: DataTypes.STRING,
      time: DataTypes.STRING
  })
  
}

module.exports = Course;

