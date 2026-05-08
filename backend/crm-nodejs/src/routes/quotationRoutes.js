const express = require("express");
const router = express.Router();
const quotationController = require("../controllers/quotationController");
const { authenticate, authorize } = require("../middleware/auth");

// All quotation routes require authentication
router.use(authenticate);

router.get("/", quotationController.getAll);
router.get("/:id", quotationController.getById);
router.post("/", authorize("ADMIN"), quotationController.create);
router.put("/:id", authorize("ADMIN"), quotationController.update);

module.exports = router;
