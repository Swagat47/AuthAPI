const express = require("express");
const router = require("express").Router();
const {registerUser, loginUser} = require("../Controllers/userCtrl");
const {availableSlots, bookSlot} = require("../Controllers/slotCtrl");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/availableSlots").post(availableSlots);
router.route("/bookSlot/:id").put(bookSlot);


module.exports = router;