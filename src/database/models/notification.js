module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      message: DataTypes.TEXT,
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      receiverId: DataTypes.INTEGER,
      link: DataTypes.STRING
    },
    {}
  );
  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      as: 'notifications',
      foreignKey: 'receiverId'
    });
  };
  return Notification;
};
