import Page from "../model/page.js";
import Link from "../model/link.js";
import User from "../model/user.js";

const createPage = async (req, res, next) => {
  const { username, bio } = req.body;
  try {
    const existingPage = await Page.findOne({ userId: req.user.id });

    const usernameExist = await Page.findOne({ username });
    if (usernameExist) {
      const err = new Error("username already taken");
      err.status = 409;
      return next(err);
    }

    let page;
    if (existingPage) {
      // update path
      existingPage.username = username;
      existingPage.bio = bio;

      page = await existingPage.save();
    } else {
      // create path
      page = await Page.create({ userId: req.user.id, username, bio });
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

const getMyPage = async (req, res, next) => {
  try {
    const page = await Page.findOne({ userId: req.user.id });
    const links = page ? await Link.find({ pageId: page._id }) : [];

    return res.status(200).json({ page, links });
  } catch (error) {
    next(error);
  }
};

const addLink = async (req, res, next) => {
  const payload = req.body;
  try {
    const page = await Page.findOne({ userId: req.user.id });
    if (!page) {
      const err = new Error("Page doesn't exist");
      err.status = 404;
      return next(err);
    }

    const numberOfLinks = await Link.countDocuments({ pageId: page._id });
    const user = await User.findOne({ supabaseId: req.user.id });
    const isProUser = user.isPro === true;

    if (numberOfLinks >= 5 && !isProUser) {
      const err = new Error("Free plan caps at 5 links");
      err.status = 400;
      return next(err);
    }

    const addlink = await Link.create({
      ...payload,
      pageId: page._id,
    });

    return res.status(200).json({
      success: true,
      link: addlink,
    });
  } catch (error) {
    next(error);
  }
};

const removeLink = async (req, res, next) => {
  const { id } = req.params;

  try {
    const link = await Link.findById(id);
    if (!link) {
      const err = new Error("Link does not exist");
      err.status = 404;
      return next(err);
    }

    const page = await Page.findOne({ userId: req.user.id });
    if (link.pageId.toString() !== page._id.toString()) {
      const err = new Error("you don't have the right to delete this link");
      err.status = 400;
      return next(err);
    }

    await Link.findByIdAndDelete(id);

    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export { createPage, getMyPage, addLink, removeLink };
