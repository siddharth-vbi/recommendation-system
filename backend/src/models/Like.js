import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Template from './Template.js';
import User from './User.js';

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Template,
      key: 'id',
    },
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
  tableName: 'Likes',
});

export default Like;
