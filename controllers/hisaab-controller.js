const { isLoggedIn } = require("../middlewares/auth-middlewares");
const hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/user-model");

module.exports.createHisaabController = async function (req, res) {
    let { title, description, encrypted, shareable, passcode, editpermissions} = 
    req.body;

    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;

    try {
        let hisaabcreated = await hisaabModel.create({
            title, 
            description,
            user: req.user._id,
            passcode,
            encrypted,
            shareable,
            editpermissions,
        });
    
        let user = await userModel.findOne({ email: req.user.email });
        user.hisaab.push(hisaabcreated._id);
        await user.save();
    
        res.redirect("/profile");
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.hisaabPageController = function (req, res) {
    res.render("create", { isLoggedIn: true })
}

module.exports.readHisaabController = async function (req, res) {

    const id = req.params.id;
    const hisaab = await hisaabModel.findOne({
        _id: id
    });

    if (!hisaab) {
        return res.redirect("/profile")
    }

    if (hisaab.encrypted) {
        return res.render("passcode", { isLoggedIn: true, id })
    }

    res.render("hisaab", { isLoggedIn: true, hisaab })
}

module.exports.deleteController = async function (req, res) {
    const id = req.params.id;

    const hisaab = await hisaabModel.findOne({
        _id: id,
        user: req.user.id,
    });
    if(!hisaab) {
        return res.redirect("/profile")
    }
    await hisaabModel.deleteOne({
        _id: id
    });

    return res.redirect("/profile")
}

module.exports.editController = async function(req, res) {
    const id = req.params.id;

    const hisaab = await hisaabModel.findById(id);

    if(!hisaab) {
        return res.redirect("/profile")
    }

    return res.render("edit", { isLoggedIn: true, hisaab })
}

module.exports.editPostController = async function (req, res) {
    const id = req.params.id;

    const hisaab = await hisaabModel.findById(id);

    if(!hisaab) {
        return res.redirect("/profile")
    }

    let { title, description, encrypted, shareable, passcode, editpermissions} = 
    req.body;

    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;

    try {
            hisaab.title = title;
            hisaab.description = description;
            hisaab.passcode = passcode;
            hisaab.encrypted = encrypted;
            hisaab.shareable = shareable;
            hisaab.editpermissions = editpermissions;
        
        await hisaab.save();
    
        res.redirect("/profile");
    } catch (err) {
        res.send(err.message);
    }
}

module.exports.readVerifiedHisaabController = async function (req, res) {

    const id = req.params.id;

    const hisaab = await hisaabModel.findOne({ _id: id});

    if (!hisaab) {
        return res.redirect("/profile")
    }

    if (hisaab.passcode !== req.body.passcode) {
        return res.redirect("/profile")
    }

    return res.render("hisaab", {
        isLoggedIn: true,
        hisaab
    })
}