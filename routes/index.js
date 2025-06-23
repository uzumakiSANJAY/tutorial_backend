const express = require('express');
const router = express.Router();

const mailRoutes = require('./mail.route');

// Prefix all user routes with /users
router.use('/mail', mailRoutes);

module.exports = router;
