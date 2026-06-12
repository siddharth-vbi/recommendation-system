import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Search = sequelize.define('Search', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  updatedAt: false,
  tableName: 'Searches',
});

export default Search;
