import Link from "../model/link.js";
import Page from "../model/page.js";
import User from "../model/user.js";
import Click from "../model/click.js";
import mongoose from "mongoose";

const analytics = async (req, res, next) => {
  try {
    const user = await User.findOne({ supabaseId: req.user.id });
    if (!user.isPro) {
      const err = new Error("Analytics is a Pro feature. Upgrade to unlock.");
      err.status = 403;
      return next(err);
    }

    const page = await Page.findOne({ userId: req.user.id });
    if (!page) {
      return res.status(200).json({ totals: { clicks: 0, links: 0 }, byDay: [], topLinks: [] });
    }

    const linkCount = await Link.countDocuments({ pageId: page._id });

    const totalClicksResult = await Link.aggregate([
      { $match: { pageId: page._id } },
      { $group: { _id: null, totalClicks: { $sum: "$clickCount" } } },
    ]);
    const totalClicks = totalClicksResult[0]?.totalClicks || 0;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const byDay = await Click.aggregate([
      { $match: { pageId: page._id, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", clicks: 1 } },
    ]);

    const topLinksResult = await Link.find({ pageId: page._id })
      .sort({ clickCount: -1 })
      .limit(5)
      .select("title clickCount");

    const topLinks = topLinksResult.map(l => ({ title: l.title, clicks: l.clickCount }));

    return res.status(200).json({
      totals: { clicks: totalClicks, links: linkCount },
      byDay,
      topLinks,
    });
  } catch (error) {
    next(error);
  }
};

export { analytics };
