import supabase from "../config/supabase.js";
import User from "../model/user.js";

//verify Supabase JWT → req.user
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "token not provided" });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: "invalid or expired token" });
  }
  req.user = data.user;

  let appUser = await User.findOne({ supabaseId: req.user.id });
  if (!appUser) {
    appUser = await User.create({
      supabaseId: req.user.id,
      email: req.user.email,
    });
  }

  next();
};

export default authenticate;
