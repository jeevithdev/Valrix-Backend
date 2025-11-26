const Item = require("../models/Item");

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, condition,status } = req.body;

    const item = new Item({
      title,
      description,
      category,
      condition,
      status,
      owner: req.user.id,
    });

    await item.save();

    return res.status(200).json({ message: "Item Created Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Item not Created" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "name email");
    if(!items){
      console.log("No items found");
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMyItem = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id });
    if (items.length === 0) {
      return res.status(404).json({ message: "No items posted by you" });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItem = async (req,res) =>{
  try{
    const item = await Item.findById(req.params.id);

    if(!item){
      return res.status(404).json({message:"Item not found"});
    }
    if(item.owner.toString() !== req.user.id){
      return res.status(403).json({message:"Not authorized"});
    }

  await item.deleteOne();
  return res.json({message:'Item deleted Succesfully'});
  }
  catch(error){
    return res.status(500).json({message:error.message});
  }
}
