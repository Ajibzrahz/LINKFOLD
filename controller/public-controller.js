import Click from "../model/click.js";
import Link from "../model/link.js";
import Page from "../model/page.js";
import { v4 as uuidv4 } from "uuid";

const getPublicPage = async (req, res, next) => {
  const { username } = req.params;

  try {
    const page = await Page.findOne({ username });
    if (!page) {
      const err = new Error("This page doesn't exist.");
      err.status = 404;
      return next(err);
    }

    const links = await Link.find({ pageId: page._id }).sort({ order: 1 });
    await Page.findByIdAndUpdate(page._id, { $inc: { totalViews: 1 } });

    return res
      .status(200)
      .json({ page: { username: page.username, bio: page.bio }, links });
  } catch (error) {
    next(error);
  }
};

const redirectLink = async (req, res, next) => {
  const { linkId } = req.params;
  try {
    const link = await Link.findOne({ _id: linkId });
    if (!link) {
      return res.redirect(process.env.CLIENT_URL);
    }
    await Link.findByIdAndUpdate(linkId, {
      $inc: { clickCount: 1 },
    });

    // inside your public page or redirect route
    let visitorId = req.cookies.linkfold_visitor_id;
    if (!visitorId) {
      visitorId = uuidv4();
      res.cookie("linkfold_visitor_id", visitorId, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });
    }

    const clicked = await Click.create({
      linkId: link._id,
      pageId: link.pageId,
      visitorId,
    });

    res.status(302).redirect(`${link.url}`);
  } catch (error) {
    next(error);
  }
};

export { getPublicPage, redirectLink };
