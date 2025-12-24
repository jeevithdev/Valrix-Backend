const Item = require("../models/Item");
const Trade = require("../models/Trade");

exports.createTradeRequest = async (req, res) => {
  try {
    const { offeredItem, requestedItem } = req.body;

    if (offeredItem === requestedItem) {
      return res
        .status(400)
        .json({ message: "Offered and requested items cannot be the same" });
    }

    const [reqItem, offItem] = await Promise.all([
      Item.findById(requestedItem),
      Item.findById(offeredItem),
    ]);

    if (!reqItem || !offItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (reqItem.owner.toString() == req.user.id) {
      return res.status(400).json({ message: "Cannot request your own item" });
    }
    if (offItem.owner.toString() != req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only offer your own items" });
    }
    const existingTrade = await Trade.findOne({
      offeredItem,
      requestedItem,
      requester: req.user.id,
      status: "pending",
    });

    if (existingTrade) {
      return res.status(400).json({ message: "Trade request already exists" });
    }
    let trade = new Trade({
      offeredItem,
      requestedItem,
      requester: req.user.id,
      owner: reqItem.owner,
    });

    await trade.save();

    res.json({
      message: "Trade request sent",
      trade,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.myRequests = async (req, res) => {
  try {
    const trades = await Trade.find({ requester: req.user.id })
      .populate("offeredItem", "title status")
      .populate("requestedItem", "title status")
      .populate("owner", "email name");

    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.requestForMe = async (req, res) => {
  try {
    const trades = await Trade.find({ owner: req.user.id })
      .populate("offeredItem", "title status")
      .populate("requestedItem", "title status")
      .populate("requester", "email name");
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.tradeAccept = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    if (trade.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (trade.status !== "pending") {
      return res.status(400).json({ message: "Trade already processed" });
    }
    const [offeredItem, requestedItem] = await Promise.all([
      Item.findOneAndUpdate(
        { _id: trade.offeredItem, status: "available" },
        { status: "traded" }
      ),
      Item.findOneAndUpdate(
        { _id: trade.requestedItem, status: "available" },
        { status: "traded" }
      ),
    ]);
    if (!offeredItem || !requestedItem) {
      return res.status(409).json({
        message: "One of the items is no longer available",
      });
    }

    trade.status = "accepted";
    await trade.save();

    await Trade.updateMany(
      {
        _id: { $ne: trade._id },
        status: "pending",

        $or: [
          { offeredItem: trade.offeredItem },
          { requestedItem: trade.requestedItem },
        ],
      },
      { status: "rejected" }
    );

    res.json({ message: "Trade accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.tradeReject = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    if (trade.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (trade.status !== "pending") {
      return res.status(400).json({ message: "Trade already processed" });
    }

    trade.status = "rejected";
    await trade.save();

    res.json({ message: "Trade rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
