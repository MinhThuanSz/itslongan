const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  updateStatus,
  adminCreate,
  remove,
} = require("../controllers/orderController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, create); // Customer đặt hàng từ cart
router.post("/admin-create", authenticate, authorize("ADMIN"), adminCreate);
router.put("/:id/status", authenticate, authorize("ADMIN"), updateStatus);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

module.exports = router;
