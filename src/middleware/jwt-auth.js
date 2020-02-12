const AuthService = require("../auth/auth-service");

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";
  console.log('auth token within jwt auth is', authToken);
  let bearerToken;
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);
    console.log('payload.sub is', payload.sub);
    AuthService.getUserWithUserName(
      req.app.get("db"),
      payload.sub
    )
      .then(user => {

        if (!user) {
          console.log('not user error is', user);
          return res.status(401).json({ error: "Unauthorized Request" });
        }
        req.user = user;
        next();
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    console.log('plain old error error is', error);
    res.status(401).json({ error: "Unauthorized Request" });
  }
}

module.exports = requireAuth;
