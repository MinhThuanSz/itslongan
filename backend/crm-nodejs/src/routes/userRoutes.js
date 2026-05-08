const express = require("express");
const router = express.Router();
const {
  getAll,
  create,
  update,
  remove,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.get("/", authenticate, authorize("ADMIN", "MANAGER", "STAFF"), getAll);
router.post("/", authenticate, authorize("ADMIN"), create);
router.put("/:id", authenticate, authorize("ADMIN"), update);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

module.exports = router;
