// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config.js";

// export const authenticate = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err)
//       return res.status(500).json({ message: "Failed to authenticate token" });
//     req.userId = decoded.id;
//     next();
//   });
// };

import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "ultimate-recipe-84d60",
    clientEmail:
      "firebase-adminsdk-p9qy0@ultimate-recipe-84d60.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCVaDIjfO4G8CRF\nR1z5yki83xYjqx06PBqcpfMMZtIHm6I5QdIuxAE0Q0QdAwySJRBlmutmmxnlarav\n1lkQdjl09lLzDFvYs2xqRsXXojbLwWfU0Y99GvX+LNvqsEwrEXImrCbsH42k0EKb\n0T5IzJCL4PqyypotbZHpZ+4fDSX6n6NuW/00G84jupnYTSVz0HAdu30VSopTQ5ms\nuDEj2xnHRj6p7ygCyxiMIOqBNcvpWEg3e2ox7HkDLYV+kg4omR71HZaOBklztPGA\n3/a1agRcVeibGJLQUtzmle0wLXtWKbQICwwcc0SnTBTdpfDERLFsGQigqQQK8eD3\nyVTPwPlJAgMBAAECggEABaA/uOa+I3RhTxVxCHkazSwVueHAMIuNZbYiBtVXnplb\nVTFZIm5o2wQ5yUo/69dyiymmEQyued1DwUaTBRbC8sEaVW5y+pRc3ai4lbwa52VI\nG9NDOq71CR7UC1UPzBpI+8H/aNjMakWlVqNF54Gw17llPSJLkiTljjm7G1/cpbTr\n5KexoWVHYs5uO5C+aMIqWaj52MSKJo+9zyVhoA4sMnvyuUWiKKA14TREeXu341Na\npswwlwIOzhUDZ1+SoPi8sbXIQ8MAlHluQvYNtY8h5Ns5HQNQ3bNT1gbn8NnzNPb5\niGA/zak8zd2qiF9SOmOfIQtXwWXdeCdFRrKJH9Tv+QKBgQDPok2qHroNzMnHmrMI\nvVVIBDkDsLha30gl5diLsl5TWG6zQe1kIxysagGb671xSJjReaVkL4dI4IwZg4wH\nIze0MbUXWf5XLHajCTLFM0gULL3oIVRl8ECv6XlyroXUKPYD4O/rUOlkcEYIeLIL\nxVVL+Y+Vxq3Xq+/3nUm4ykiLOwKBgQC4Na6585BoYc4HM+GxM0f3UwyH9hTCSOCT\nG2+WsiUaG4lt20ks3WE1r5B36k4/AGBQBeksoCNJzzVdMPCoYHNU+GCAoJ1AjI5t\nUjRutvNGvXaaKwinNxz5fWIZBTi07PYhf8ZxTZJCKJ8jqjAJVVCssRGUYolGt825\nzu2MuYedSwKBgQCQ4A6QxR/MwTeJrsd9MZ5vwYKGsKfxwBn3V4jg8HQgc3PKYBXj\n6Rv4sX6t7K8ifCUlBFwCq6cZkpQuuTrbQBd+A7D3ujNdYAjneWOTdVS1vwJDFf5t\nolWAaMf03RFEF9CQpELDTpGLI0u6XXzd+bKqcFdfimGCOtYVUApAheRYQQKBgQCa\nA3gkzLluLGffqccHKsL+zBbsDhjpH5l0JTo1GpjerStICFG0CxvdkP4O5H2rOxtL\njMWZpAIdEfuiAOsVPB7xagD1SlRvxZTHXjWsY5YfDQV+fIBtnizBg81i8fSpgH2B\nIJ2/2YVxfxke7onfI8+hsyHpmEECOWbt9U6zm+MA5QKBgFg14LktWp8p5OaG6vGq\nPSXabrM1xSUq9m5VrOEPmoycuxNjGsOZUrQbWFdYgG7fg02s5xRj8fCxnMxSjVlC\nKvF/mPPh0M1CFOL+bTTGiOM4IM3ug9mP0Z0qbOA+eea1dFvCvriHwVtgfa3p6ULb\n53AbjiBFbWJtfKR8m1r17XOG\n-----END PRIVATE KEY-----\n".replace(
        /\\n/g,
        "\n"
      ),
  }),
});

export const authenticate = async (req, res, next) => {
  const { idToken } = req.body;
  // console.log(idToken);
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // console.log(decodedToken, "decodedToken");
    const { email, name, picture } = decodedToken;

    let user = await User.findOne({ email });
    // console.log(user, "user");
    if (!user) {
      user = new User({
        displayName: name,
        email,
        photoURL: picture,
        coin: 50,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      // process.env.JWT_SECRET,
      "The_JWT_Secreate",
      { expiresIn: "1h" }
    );

    // console.log(token, "token");

    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // console.log("protect", "inside protect");
      token = req.headers.authorization.split(" ")[1];
      // console.log(token, "token");
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const decoded = jwt.verify(token, "The_JWT_Secreate");
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
