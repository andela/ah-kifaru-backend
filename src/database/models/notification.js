module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      message: DataTypes.TEXT,
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      userId: DataTypes.INTEGER,
      url: DataTypes.STRING
    },
    {}
  );
  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      as: 'notifications',
      foreignKey: 'userId'
    });
  };
  return Notification;
};
