const router = require("express").Router();
const blogController = require("../controllers/blogController");
const passport = require("passport");
const passportConfig = require("../configuration/auth");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  blogController.createBlog
);
router.get("/public", blogController.getPublicBlogs);
router.get("/public/:blogId", blogController.getSinglePublicBlog); //get a single public blog

router.get("/", blogController.getAllBlogs);
router.get("/:blogId", blogController.getSingleBlog);
router
  .route("/edit/:blogId")
  .put(blogController.reCreateBlog)
  .patch(blogController.updateBlog);

router.delete("/delete/:blogId", blogController.deleteBlog);

//Comments routes

router.get("/blog/:blogId/comments", blogController.getAllBlogComments);
router.post("/blog/:blogId/comment", blogController.addComment);
router
  .route("/blog/comment/:commentId")
  .get(blogController.getComment)
  .delete(blogController.deleteComment);

module.exports = router;
