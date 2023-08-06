const express = require("express");
const router = require("express").Router();
const {registerUser, loginUser} = require("../Controllers/userCtrl");
const {availableSlots, bookSlot, viewSessions} = require("../Controllers/slotCtrl");
const {isAuthenticatedUser} = require("../Middleware/auth");
const {updateSession} = require("../Middleware/sessionUpdate");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/availableSlots").post(isAuthenticatedUser, updateSession, availableSlots);
router.route("/bookSlot").put(isAuthenticatedUser, updateSession, bookSlot);
router.route("/viewSessions").get(isAuthenticatedUser, updateSession, viewSessions);


module.exports = router;