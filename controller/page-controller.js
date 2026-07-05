import Page from "../model/page.js";

const createPage = async (req, res, next) => {
  const { username, bio } = req.body;
  try {
    const usernameExist = await Page.findOne(username);
    if (usernameExist) {
      const err = new Error("username already taken");
      err.status = 409;
      return next();
    }

    const createpage = await Page.create({
      userId: req.user.id,
      username,
      bio,
    });

    return res.status(200).json({
      success: true,
      data: createpage,
    });
  } catch (error) {
    next(error);
  }
};

const getPage = async (req, res, next) => {
  const { username } = req.params;

  try {
    const page = await Page.findOne({
      username,
    });
    if (!page) {
      const err = new Error("Page doesn't exist");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

const updatePage = async (req, res, next) => {
  const { username, bio } = req.body;

  try {
    const page = await Page.findOne({
      userId: req.user.id,
    });
    if (!page) {
      const err = new Error("Page doesn't exist");
      err.status = 404;
      return next(err);
    }

    const usernameTaken = await Page.findOne({
      username,
    });
    if (usernameTaken) {
      const err = new Error("username already exist");
      err.status = 409;
      return next(err);
    }

    page.username = username || null;
    page.bio = bio || null;

    await page.save();

    return res.status(201).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

const deletePage = async (req, res, next) => {
  try {
    const page = await Page.findOne({
      userId: req.user.id,
    });
    if (!page) {
      const err = new Error("Page doesn't exist");
      err.status = 404;
      return next(err);
    }

    await Page.findOneAndDelete({
      userId: req.user.id,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
export { createPage, getPage, updatePage, deletePage };
