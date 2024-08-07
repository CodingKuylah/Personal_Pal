import Account from "../account.entity.js";
import User from "../user.entity.js";
import Role from "../role.entity.js";
import userRoleTransactional from "../transactionalTable/userRole.transactional.js";
import ClientHistories from "../histories/client.histories.js";

// Account.belongsTo(User, {
//     foreignKey: "id",
//     as: "User"
// })
//
// User.hasOne(Account, {
//     foreignKey: "id",
//     as: "Account"
// })

Account.hasOne(User, {
  foreignKey: "id",
  as: "User",
});
User.belongsTo(Account, {
  foreignKey: "id",
  as: "Account",
});

User.belongsToMany(Role, {
  through: userRoleTransactional,
  foreignKey: "userId",
});
Role.belongsToMany(User, {
  through: userRoleTransactional,
  foreignKey: "roleId",
});

User.hasMany(ClientHistories, { foreignKey: "userId" });
