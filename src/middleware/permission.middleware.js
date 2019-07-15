import responseGenerator from '../helpers/responseGenerator';

const superAdminCheck = (req, res, next) => {
  const { role } = req.currentUser;
  if (role === 'superAdmin') {
    return next();
  }
  return responseGenerator.sendError(
    res,
    403,
    'Unauthorized User, Please contact the administrator.'
  );
};

export default superAdminCheck;
