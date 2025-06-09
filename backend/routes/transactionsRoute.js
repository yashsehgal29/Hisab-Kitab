import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

// IMPORTANT: Put specific routes BEFORE parameterized routes
router.get("/summary/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const balanceresult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${id};
        `
        //incomeresult is the sum of all the amounts that are greater than 0
        const incomeresult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions
            WHERE user_id = ${id} AND amount > 0;
        `
        //expenseresult is the sum of all the amounts that are less than 0
        const expenseresult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions
            WHERE user_id = ${id} AND amount < 0;
        `
        res.status(200).json({
            total: balanceresult[0].balance,  // Changed from 'balance' to 'total'
            income: incomeresult[0].income,
            expense: Math.abs(expenseresult[0].expense) // Make expense positive for display
        })
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ message: "Error fetching summary" });
    }
})

router.get("/:id", async (req, res) => { 
    try {
        const { id } = req.params;
        console.log(id)
        const transaction = await sql`SELECT * FROM transactions WHERE user_id = ${id} ORDER BY created_at DESC`;
        console.log(transaction);
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Error fetching transactions" });
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category } = req.body;
        // Fixed: This should update by transaction ID, not user_id
        const transaction = await sql`UPDATE transactions SET title = ${title}, amount = ${amount}, category = ${category} WHERE id = ${id} RETURNING *;`;
        res.status(200).json({ message: "Transaction updated successfully", transaction });
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Error updating transaction" });
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))){
            return res.status(400).json({ message: "Invalid transaction ID" });
        }
 
        // Fixed: Delete by transaction ID, not user_id
        const result = await sql`DELETE FROM transactions WHERE id = ${id}`;
        //if the transaction is not found, return a 404 error
        if(result.rowCount === 0){
            return res.status(404).json({ message: "Transaction not found" });
        }
        //if the transaction is found, return a 200 status and a message
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Error deleting transaction" });
    }
})

//creating a post request to create a transaction
router.post("/", async (req, res) => {
    try {
         const { user_id, title, amount, category } = req.body;
        if(!user_id || !title || !amount || !category){
            return res.status(400).json({ message: "All fields are required" });
        }
        const transaction = await sql`INSERT INTO transactions (user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *;
        `;
        console.log(transaction);
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Error creating transaction" });
    }
});

export default router;