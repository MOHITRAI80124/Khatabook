const express = require("express");
const router = express.Router();
const {
    createHisaabController,
    hisaabPageController,
    readHisaabController,
    readVerifiedHisaabController,
    deleteController,
    editController,
    editPostController,
} = require("../controllers/hisaab-controller");

const { 
    isLoggedIn, 
    redirectIfLoggedIn, 
} = require("../middlewares/auth-middlewares");

router.get("/create", isLoggedIn , hisaabPageController);
router.post("/create", isLoggedIn , createHisaabController);
router.get("/view/:id", isLoggedIn , readHisaabController);
router.get("/delete/:id", isLoggedIn , deleteController);
router.get("/edit/:id", isLoggedIn , editController);
router.post("/edit/:id", isLoggedIn , editPostController);
router.post("/verify/:id", readVerifiedHisaabController);

module.exports = router;