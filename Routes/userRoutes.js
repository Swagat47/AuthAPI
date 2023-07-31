const express = require("express");
const router = require("express").Router();
const {registerUser, loginUser} = require("../Controllers/userCtrl");
const {availableSlots} = require("../Controllers/slotCtrl");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/availableSlots").post(availableSlots);


module.exports = router;