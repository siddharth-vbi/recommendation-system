import sequelize from '../config/database.js';
import Template from './Template.js';
import View from './View.js';
import Like from './Like.js';
import Search from './Search.js';
import User from './User.js';

Template.hasMany(View, { foreignKey: 'templateId' });
View.belongsTo(Template, { foreignKey: 'templateId' });

Template.hasMany(Like, { foreignKey: 'templateId' });
Like.belongsTo(Template, { foreignKey: 'templateId' });

User.hasMany(View, { foreignKey: 'userId' });
View.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Search, { foreignKey: 'userId' });
Search.belongsTo(User, { foreignKey: 'userId' });

const syncDatabase = async () => {
  await sequelize.sync();
};

export { sequelize, Template, View, Like, Search, User, syncDatabase };
