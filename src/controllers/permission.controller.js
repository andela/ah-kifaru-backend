const AdminAccessController = (req, res) => {
  return res
    .status(200)
    .json({ status: 200, message: 'Welcome Administrator' });
};

const SuperAdminAccessController = (req, res) => {
  return res
    .status(200)
    .json({ status: 200, message: 'Welcome Super Administrator' });
};
export { AdminAccessController, SuperAdminAccessController };
