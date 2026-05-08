const express = require("express");
const router = express.Router();
const { daily, monthly, summary } = require("../controllers/revenueController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/summary", authenticate, authorize("ADMIN", "MANAGER", "STAFF"), summary);
router.get("/daily", authenticate, authorize("ADMIN", "MANAGER", "STAFF"), daily);
router.get("/monthly", authenticate, authorize("ADMIN", "MANAGER", "STAFF"), monthly);

module.exports = router;
