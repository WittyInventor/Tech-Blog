// this is completed
// models are a table of information and the routes are what the user is requesting.

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}
// this code above is saying: the code is checking the password that has been logged in and it will return with bcrypt password and will compareSync with the login pw and the bcrypted password. checking the password means the software is checking to make sure the password is correct or the wrong password.

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
        // len= length of the characters for the password
      },

    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // newUserData.password = means (await)-will wait to receive the bcrypt actual password. bcrypt- means it takes a password and changes it in the backend to make it more secure to prevent hackers, its like extra protection for your password- example: password name : Anne but bcrypt is '\x02yÞ
      // hash is a function inside the bcrypt that it will create a function 
      // the newUserData.password, 10 means the password that has been entered by the user and the return newUserData; is the password with bcrypt data protection.
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
