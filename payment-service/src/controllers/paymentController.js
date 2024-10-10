const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'host.docker.internal',
    database: 'mydatabase',
    password: '7666',
    port: 5432,
});


// //og
// const purchaseCredits = async (req, res) => {
//     const { amount } = req.body;
//
//     try {
//         const now = new Date();
//
//         // Adjust for your timezone (UTC+3)
//         const timezoneOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
//         const localNow = new Date(now.getTime() + timezoneOffset);
//         const expiresAt = new Date(localNow.getTime() + 60 * 1000); //600 * 1000=10 minutes
//
//         const result = await pool.query(
//             'INSERT INTO payments (amount, purchased_at, expires_at) VALUES ($1, $2, $3) RETURNING *',
//             [amount, localNow, expiresAt]
//         );
//
//         res.json({ success: true, payment: result.rows[0] });
//     } catch (error) {
//         console.error('Error processing payment:', error);
//         res.status(500).json({ success: false, message: 'Failed to process payment' });
//     }
// };

// let oldBalance = 100;
let currentBalance = 100; // Set your initial balance here

const purchaseCredits = async (req, res) => {
    const { amount } = req.body;

    if (amount > currentBalance) {
        return res.status(400).json({ success: false, message: 'Insufficient funds to purchase credits.' });
    }

    // oldBalance = currentBalance;
    currentBalance -= amount; // Deduct from the current balance
    const newBalance = currentBalance; // New balance after deduction

    try {
        const now = new Date();
        const timezoneOffset = 3 * 60 * 60 * 1000;
        const localNow = new Date(now.getTime() + timezoneOffset);
        const expiresAt = new Date(localNow.getTime() + 3600 * 1000);

        const result = await pool.query(
            'INSERT INTO payments (amount, purchased_at, expires_at) VALUES ($1, $2, $3) RETURNING *',
            [amount, localNow, expiresAt]
        );

        res.json({ success: true, payment: result.rows[0], newBalance });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Failed to process payment' });
    }
};



const checkCredits = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM payments WHERE expires_at > NOW()'
        );

        if (result.rows.length > 0) {
            req.credits = result.rows; // Attach credits to the request
            next(); // Proceed to the next middleware or route
        } else {
            res.status(403).json({ success: false, message: 'No valid credits available' });
        }
    } catch (error) {
        console.error('Error checking credits:', error);
        res.status(500).json({ success: false, message: 'Failed to check credits' });
    }
};



const consumeCredits = async (req, res) => {
    const { amountToUse } = req.body; // Amount of credits to consume

    try {
        // Query for available credits (non-expired)
        const result = await pool.query(
            'SELECT * FROM payments WHERE expires_at > NOW() ORDER BY expires_at ASC'
        );

        if (result.rows.length > 0) {
            // Calculate the total available credits
            const totalCredits = result.rows.reduce((acc, row) => acc + parseFloat(row.amount), 0);

            // Check if the user is trying to use more credits than available
            if (amountToUse > totalCredits) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient credits available to consume the requested amount.'
                });
            }

            let remainingAmountToUse = amountToUse;

            // Loop through the valid credits and deduct as needed
            for (const row of result.rows) {
                const creditAmount = parseFloat(row.amount);

                if (remainingAmountToUse <= creditAmount) {
                    // Deduct the amount from the current record
                    const newAmount = creditAmount - remainingAmountToUse;

                    if (newAmount > 0) {
                        await pool.query(
                            'UPDATE payments SET amount = $1 WHERE id = $2',
                            [newAmount, row.id]
                        );
                    } else {
                        // If credits are fully consumed, delete the row
                        await pool.query(
                            'DELETE FROM payments WHERE id = $1',
                            [row.id]
                        );
                    }
                    break; // Exit the loop after deducting
                } else {
                    // Deduct the whole credit amount from the record
                    remainingAmountToUse -= creditAmount;
                    await pool.query(
                        'DELETE FROM payments WHERE id = $1',
                        [row.id]
                    );
                }
            }

            res.json({ success: true, message: `Used ${amountToUse} credits.` });
        } else {
            res.status(403).json({ success: false, message: 'No valid credits available' });
        }
    } catch (error) {
        console.error('Error consuming credits:', error);
        res.status(500).json({ success: false, message: 'Failed to consume credits' });
    }
};


const availableCredits = async (req, res) => {
    // const result1 = await pool.query(
    //     'SELECT * FROM payments'
    // );
    // console.log('Query Result1:', result1.rows);

    try {
        const result = await pool.query(
            'SELECT * FROM payments WHERE expires_at > NOW()'
        );

        if (result.rows.length > 0) {
            const totalCredits = result.rows.reduce((acc, row) => acc + parseFloat(row.amount), 0);
            res.json({ success: true, totalAvailableCredits: totalCredits, credits: result.rows, currentBalance: currentBalance });
        } else {
            res.json({ success: true, totalAvailableCredits: 0, credits: [], currentBalance: currentBalance });
        }
    } catch (error) {
        console.error('Error checking available credits:', error);
        res.status(500).json({ success: false, message: 'Failed to check available credits' });
    }
};


const clearExpiredCredits = async (req, res) => {
    try {
        // Clear records where the expiration date has passed
        const result = await pool.query(
            'DELETE FROM payments WHERE expires_at < NOW()'
        );

        res.json({
            success: true,
            message: `${result.rowCount} expired credit(s) have been cleared from the payments table.`,
        });
    } catch (error) {
        console.error('Error clearing expired credits from payments table:', error);
        res.status(500).json({ success: false, message: 'Failed to clear expired credits from payments table.' });
    }
};


module.exports = {
    purchaseCredits,
    checkCredits,
    consumeCredits,
    availableCredits,
    clearExpiredCredits,
};
