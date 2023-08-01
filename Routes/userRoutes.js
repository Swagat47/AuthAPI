const express = require("express");
const router = require("express").Router();
const {registerUser, loginUser} = require("../Controllers/userCtrl");
const {availableSlots, bookSlot} = require("../Controllers/slotCtrl");
const {isAuthenticatedUser} = require("../Middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/availableSlots").post(isAuthenticatedUser, availableSlots);
router.route("/bookSlot").put(isAuthenticatedUser, bookSlot);


module.exports = router;