const express = require("express")
const router = express.Router()

const { register, login } = require("../controllers/authControllers")

/**
 *  @swagger
 *  /auth/register:
 *    post:
 *      summary: Create a new User
 *      tags:
 *        - name: Authentication
 *      responses:
 *        200:
 *          content:
 *            application/json
 */

router.route("/register").post(register)

/**
 *  @swagger
 *  /auth/login:
 *    post:
 *      summary: Login a user
 *      tags:
 *        - name: Authentication
 */
router.route("/login").post(login)

module.exports = router