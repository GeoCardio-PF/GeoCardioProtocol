const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json');

const sequelize = new Sequelize(config.database,config.username,config.password,{
	host: config.host,
	dialect: config.dialect,
	port: config.port,
});

const Device = sequelize.define('Device', {
	DeviceId: {
		type: DataTypes.STRING(13),
		primaryKey: true,
		allowNull: false,
	},
	Name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
});

const Position = sequelize.define('Position', {
	PositionId: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	DeviceId: {
		type: DataTypes.STRING(13),
		allowNull: false,
	},
	TimeStamp: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	Latitude: {
		type: DataTypes.DECIMAL(3,6),
		allowNull: false,
	},
	Longitude: {
		type: DataTypes.DECIMAL(4,6),
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
});

const HeartRate = sequelize.define('HeartRate',{
	HeartRateId: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	DeviceId: {
		type: DataTypes.STRING(13),
		allowNull: false,
	},
	TimeStamp: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	HeartRate: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
})

const Temperature = sequelize.define('Temperature',{
	TemperatureId: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	DeviceId: {
		type: DataTypes.STRING(13),
		allowNull: false,
	},
	TimeStamp: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	Temperature: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
})

const Oxygen = sequelize.define('Oxygen',{
	OxygenId: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	DeviceId: {
		type: DataTypes.STRING(13),
		allowNull: false,
	},
	TimeStamp: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	Oxygen: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
})

Device.hasMany(Position, {foreignKey: 'DeviceId' });
Device.hasMany(HeartRate, {foreignKey: 'DeviceId' });
Device.hasMany(Temperature, {foreignKey: 'DeviceId' });
Device.hasMany(Oxygen, {foreignKey: 'DeviceId' });

Position.belongsTo(Device, {foreignKey: 'DeviceId'});
HeartRate.belongsTo(Device, {foreignKey: 'DeviceId'});
Temperature.belongsTo(Device, {foreignKey: 'DeviceId'});
Oxygen.belongsTo(Device, {foreignKey: 'DeviceId'});

sequelize.sync()
	.then(() =>{
		console.log('Models synced successfully');
	})
	.catch((error) =>{
		console.error('Error syncing models:', error);
	});

module.exports = {
	Device,
	Position,
	HeartRate,
	Temperature,
	Oxygen,
};