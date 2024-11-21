const Transaction = require("../models/Transaction");

exports.getStatistics = async (req, res) => {
    const { month } = req.query;

    try {
        const startOfMonth = new Date(`${month}-01`);
        const endOfMonth = new Date(`${month}-31`);

        const transactions = await Transaction.find({
            dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const totalSales = transactions.reduce((acc, tx) => acc + tx.price, 0);
        const soldItems = transactions.filter((tx) => tx.isSold).length;
        const unsoldItems = transactions.length - soldItems;

        res.json({ totalSales, soldItems, unsoldItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

