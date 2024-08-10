const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authUserMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    // Check if authorization header is present and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // Extract the token from the authorization header
        token = req.headers.authorization.split(" ")[1];
        // Check if the token is null or undefined
        console.log(token)
        if (!token || token==="null" || token==="undefined") {
            return res.status(401).json({ error: "You must be logged in." });
        }

        try {
            // Verify the token
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const { email } = payload;

            // Find the user associated with the token's email
            const user = await prisma.users.findUnique({ where: { email } });

            // Attach the user information to the request object
            req.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ error: "You must be logged in." });
        }
    } else {
        return res.status(401).json({ error: "You must be logged in." });
    }
});

module.exports = { authUserMiddleware };
