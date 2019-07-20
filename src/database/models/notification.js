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
      link: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: DataTypes.DATE
      }
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
