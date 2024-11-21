const Transaction = require("../models/Transaction");
const axios = require("axios");

// Helper function to get the month index from a month name (March -> 2)
const getMonthIndex = (month) => {
    return new Date(`${month} 1`).getMonth(); // Returns 0 for January, 1 for February, etc.
};

// Seed database with data from the third-party API
exports.seedDatabase = async (req, res) => {
    try {
        // Fetch data from the third-party API
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        const transactions = response.data;

        // Sanitize data to ensure all required fields are present
        const sanitizedTransactions = transactions.map((transaction) => ({
            title: transaction.title || "Untitled",
            description: transaction.description || "No description",
            price: transaction.price || 0,
            dateOfSale: transaction.dateOfSale ? new Date(transaction.dateOfSale) : new Date(),
            isSold: transaction.sold !== undefined ? transaction.sold : false, // Default to false
            category: transaction.category || "Uncategorized",
        }));

        // Clear existing data and insert sanitized data
        await Transaction.deleteMany(); // Deletes all previous documents in the collection
        await Transaction.insertMany(sanitizedTransactions); // Inserts new data

        res.status(201).json({ message: "Database seeded successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch transactions with search and pagination
exports.getTransactions = async (req, res) => {
    const { month, page = 1, perPage = 10, search = "" } = req.query;

    try {
        const monthIndex = getMonthIndex(month); // Get numeric month index (0-11)

        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthIndex + 1], // Match the month (1-based index)
            },
        };

        // Add search conditions if a search term is provided
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];

            if (!isNaN(Number(search))) {
                query.$or.push({ price: Number(search) });
            }
        }

        // Debugging: Log the query to inspect
       // console.log("Query Object:", JSON.stringify(query, null, 2));

        // Fetch transactions with pagination
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        const total = await Transaction.countDocuments(query);

        // Send the response with transactions and total count
        res.json({ transactions, total, page, perPage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch statistics for the selected month
exports.getStatistics = async (req, res) => {
    const { month } = req.query;

    try {
        const monthIndex = getMonthIndex(month); // Get numeric month index (0-11)

        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthIndex + 1], // Match the month (1-based index)
            },
        };

        // Fetch transactions for the selected month
        const transactions = await Transaction.find(query);

        // Calculate statistics
	// Calculate statistics
        const totalSales = transactions
            .filter((tx) => tx.isSold === true) // Only sold items
            .reduce((acc, tx) => acc + (tx.price || 0), 0); // Sum prices safely
        const soldItems = transactions.filter((tx) => tx.isSold === true).length;
        const unsoldItems = transactions.filter((tx) => tx.isSold === false).length;


	//console.log("Total sales:", totalSales);	
        //console.log("Sold items count:", soldItems); // Debug sold count
        //console.log("Unsold items count:", unsoldItems); // Debug unsold count
    
        // Send the response with the statistics
        res.json({
            totalSales,
            soldItems,
            unsoldItems,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch pie chart data (category distribution for the selected month)
exports.getPieChartData = async (req, res) => {
    const { month } = req.query;

    try {
        const monthIndex = getMonthIndex(month); // Get numeric month index (0-11)

        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthIndex + 1], // Match the month (1-based index)
            },
        };

        // Fetch transactions for the selected month
        const transactions = await Transaction.find(query);

        // Aggregate data by category for pie chart
        const categoryCounts = transactions.reduce((acc, tx) => {
            const category = tx.category || "Uncategorized"; // Handle undefined categories
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        // Prepare data for the pie chart
        const chartData = {
            labels: Object.keys(categoryCounts), // Categories (e.g., Electronics, Clothing)
            values: Object.values(categoryCounts), // Counts for each category
        };

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






// Fetch bar chart data (price range distribution for the selected month)
exports.getBarChartData = async (req, res) => {
    const { month } = req.query;

    try {
        const monthIndex = getMonthIndex(month); // Get numeric month index (0-11)

        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthIndex + 1], // Match the month (1-based index)
            },
        };

        // Fetch transactions for the selected month
        const transactions = await Transaction.find(query);

        // Define price ranges
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

        // Count transactions in each price range
        transactions.forEach((tx) => {
            const { price } = tx;

            // Match the price with a range
            for (let i = 0; i < priceRanges.length - 1; i++) {
                const [min, max] = priceRanges[i].range.split("-").map(Number);
                if (price >= min && price <= max) {
                    priceRanges[i].count++;
                    return;
                }
            }

            // Handle prices above 900
            if (price > 900) {
                priceRanges[priceRanges.length - 1].count++;
            }
        });

        // Prepare data for the bar chart
        const chartData = {
            labels: priceRanges.map((range) => range.range), // Price ranges (e.g., "0-100")
            values: priceRanges.map((range) => range.count), // Counts for each range
        };

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};









