import jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) => {
  const headers = req.headers.authorization;
  const accesstoken = headers ? headers.split(" ")[1] : "";
  try {
    if (!accesstoken) {
      throw new Error("No access");
    }

    //kiểm tra token có đúng là token của mình cung cấp hay không?
    const verify: any = jwt.verify(accesstoken, "123456");

    if (!verify) {
      throw new Error("Invalid token");
    }

    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
