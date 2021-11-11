import rules from "../rbacRules";

const ConvertRoles = (roles) => {
  try {
    return roles.map((role) => {
      let caption = "";
      // eslint-disable-next-line
      switch (role) {
        case "0": {
          caption = "aladin";
          break;
        }
        case "1": {
          caption = "director";
          break;
        }
        case "2": {
          caption = "accountant";
          break;
        }
        case "3": {
          caption = "supplier";
          break;
        }
        case "4": {
          caption = "admin";
          break;
        }
        case "5": {
          caption = "pointHead";
          break;
        }
        case "6": {
          caption = "revisor";
          break;
        }
        default: {
          caption = "undefined";
          break;
        }
      }
      return {
        id: role,
        name: role.name,
        caption,
      };
    });
  } catch (e) {
    return roles;
  }
};

const Can = (mode, userRoles, action) => {
  // return true
  if (mode === "changepass" || mode === undefined) return true;

  try {
    userRoles = ConvertRoles(userRoles);
    let access = false;

    userRoles.forEach((role) => {
      const permissions = rules[role.caption];
      if (!permissions) {
        // return false;
        access = false;
      }

      const staticPermissions = permissions.static;
      if (role.id === "1") {
        //у этого пользователя массив staticPermissions включает в себя модули на которые нет доступа
        if (
          staticPermissions &&
          !staticPermissions.includes(mode) &&
          !staticPermissions.includes(action)
        ) {
          access = true;
          return;
        }
      } else {
        if (
          staticPermissions &&
          (staticPermissions.includes(mode) || staticPermissions.includes("*"))
        ) {
          // return true;
          access = true;
          return;
        }
      }
    });

    return access;
  } catch (e) {
    return false;
  }
};

export default Can;
