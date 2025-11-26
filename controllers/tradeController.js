const Item = require("../models/Item");
const Trade = require("../models/Trade");

exports.createTradeRequest = async (req, res) => {
  try {
    const { offeredItem, requestedItem } = req.body;

    const item = await Item.findById(requestedItem);
    if (!item) {
      return res.status(404).json({ message: "Requested item not found" });
    }

    if (item.owner.toString() == req.user.id) {
      return res.status(400).json({ message: "Cannot request your own item" });
    }

    let trade = new Trade({
      offeredItem,
      requestedItem,
      requester: req.user.id,
      owner: item.owner,
    });

    await trade.save();

      trade = await Trade.findById(trade._id)
        .populate("offeredItem", "title status")
        .populate("requestedItem", "title status")
        .populate("requester", "name email")
        .populate("owner", "name email");

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

    if(trade.status !== "pending"){
        return res.status(400).json({message:"Trade already processed"});
    }

    trade.status = "accepted"
    await trade.save();

    await Item.findByIdAndUpdate(trade.offeredItem, {status:"traded"});
    await Item.findByIdAndUpdate(trade.requestedItem, {status:"traded"});

    res.json({message:"Trade accepted successfully"});
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

    if(trade.status !== "pending"){
        return res.status(400).json({message:"Trade already processed"});
    }

    trade.status = "rejected"
    await trade.save();


    res.json({message:"Trade rejected"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
