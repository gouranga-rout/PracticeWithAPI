const Transaction = require("../models/Transaction");

exports.getBarChart = async (req, res) => {
    const { month } = req.query;

    try {
        const startOfMonth = new Date(`${month}-01`);
        const endOfMonth = new Date(`${month}-31`);

        const transactions = await Transaction.find({
            dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const priceRanges = [
            { range: "0-100", count: 0 },
            { range: "101-200", count: 0 },
            { range: "201-300", count: 0 },
            { range: "301-400", count: 0 },
            { range: "401-500", count: 0 },
            { range: "501-600", count: 0 },
            { range: "601-700", count: 0 },
            { range: "701-800", count: 0 },
            { range: "801-900", count: 0 },
            { range: "901-above", count: 0 },
        ];

        transactions.forEach((tx) => {
            const { price } = tx;

            for (let i = 0; i < priceRanges.length - 1; i++) {
                const [min, max] = priceRanges[i].range.split("-").map(Number);
                if (price >= min && price <= max) {
                    priceRanges[i].count++;
                    return;
                }
            }
            if (price > 900) priceRanges[9].count++;
        });

        res.json(priceRanges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPieChart = async (req, res) => {
    const { month } = req.query;

    try {
        const startOfMonth = new Date(`${month}-01`);
        const endOfMonth = new Date(`${month}-31`);

        const transactions = await Transaction.find({
            dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const categoryData = transactions.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + 1;
            return acc;
        }, {});

        res.json(categoryData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

