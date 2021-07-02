const { Sequelize, DataTypes}  = require('sequelize');
const { Op } = require("sequelize");  // 操作符

var sequelize = new Sequelize('my_database', 'root', '971008.wmz', {
  host: "localhost",
  port: 3306,
  dialect: 'mysql'
});

const User = sequelize.define('User',{
  // 在这里定义模型属性
  username: {
      type: DataTypes.STRING,
      allowNull: false, // allowNull 默认为 true
      primaryKey: true,  // 没有主键会自动生成id作为主键
      unique: true,
    },
  password: {
      type: DataTypes.STRING,
      // 设置器
      set(value){
        this.setDataValue('password', value + 'set');
      },
      // 获取器
      get(){
         let value = this.getDataValue('password');
         return value + 'get';
      }
  },
  age: {
    type: DataTypes.INTEGER
  },
  gender: {
    type: DataTypes.STRING
  }
},
{
  tableName: 'user',
  timestamps: false,
})
 // 同步模型和数据库
async function mxtb(){
  await User.sync({ alter: true });
} 
// 插入一条记录
async function insertUser() {
  const user = await User.create({ username: 'Janenew',password: '97888' });
  console.log('user', user.toJSON());
}
// 查询
async function selectUser() {
   // 查询所有记录
  const users1 = await User.findAll();
  const users2 = await User.findAll({
    attributes: ['username', ['age', 'newage']]
  });
  // SELECT `username`, char_length(`password`) AS `char_length` FROM `user` AS `User`;
  const users3 = await User.findAll({
    attributes: ['username', [sequelize.fn('char_length', sequelize.col('password')), 'char_length']]
  });
  // SELECT `username`, `password` FROM `user` AS `User` WHERE char_length(`password`) = 4;
  const users4 = await User.findAll({
    attributes: ['username', 'password'],
    where: sequelize.where(sequelize.fn('char_length', sequelize.col('password')), 4),
  });
  // SELECT `username`, `password`, `gender` FROM `user` AS `User` WHERE (`User`.`age` = 22 OR `User`.`password` LIKE '%1%') AND `User`.`gender` = 'nv';
  const users = await User.findAll({
    attributes: {
      exclude: ['age']
    },
    where: {
      [Op.or]: [{
          age: {
            [Op.eq]: 22
          }
        },
        {
          password: {
            [Op.like]: '%1%'
          }
        }
      ],
    },
    group: 'age',
    order: [
      ['age', 'DESC']
    ],
    limit: 10,
    offset: 1,
  });
  console.log('users', users1);
  
}
// 更新记录
async function updateUser() {
  // UPDATE `user` SET `password`=? WHERE `username` = ?
  const user = await User.update({ password: "helloworld" }, {
    where: {
      username: 'wmz'
    }
  });
  console.log('user', user);
}
// 插入一条记录
async function destoryUser() {
  // DELETE FROM `user` WHERE `username` = 'wmz'
  const user = await User.destroy({
    where: {
      username: 'wmz',
    }
  });
  console.log('user', user);
}

selectUser();