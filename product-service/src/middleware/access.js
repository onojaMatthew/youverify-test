import { AppError } from "../utils/errorHandler";

export const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    const { role, permissions } = req.user;
    const formattedAction = action.split("_").join(" ");
    try {
      if (!resource.includes(role.key) || !permissions.includes(action)) return next(new AppError(`${role.name.charAt(0).toUpperCase() + role.name.slice(1,20)} does not have enough permission for ${formattedAction} operation`, 403));
      next();
    } catch (err) {
      next(new AppError(`${role.name.charAt(0).toUpperCase() + role.name.slice(1,20)} does not have enough permission for ${formattedAction} operation`, 403));
    }
  }
}