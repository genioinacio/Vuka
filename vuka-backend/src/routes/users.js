const router = require("express").Router();
const multer = require("multer");
const auth   = require("../middlewares/authMiddleware");
const ctrl   = require("../controllers/usersController");

const upload = multer({ dest: "uploads/" });

router.get("/:id",         auth, ctrl.getProfile);
router.put("/me",          auth, upload.single("avatar"), ctrl.updateProfile);
router.post("/:id/follow", auth, ctrl.toggleFollow);

module.exports = router;