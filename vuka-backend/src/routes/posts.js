const router = require("express").Router();
const multer = require("multer");
const auth   = require("../middlewares/authMiddleware");
const ctrl   = require("../controllers/postsController");

const upload = multer({ dest: "uploads/" });

router.get("/",              auth, ctrl.list);
router.post("/",             auth, upload.single("imagem"), ctrl.create);
router.post("/:id/like",     auth, ctrl.toggleLike);
router.get("/:id/comments",  auth, ctrl.listComments);
router.post("/:id/comments", auth, ctrl.addComment);

module.exports = router;