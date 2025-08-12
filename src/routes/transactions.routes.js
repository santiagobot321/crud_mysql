import { Router } from "express";
import pool from "../database.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = Router();

// Formulario para agregar persona
router.get('/add', isLoggedIn, (req, res) => {
    res.render('transactions/add');
});

// Guardar nueva persona
router.post('/add', isLoggedIn, async (req, res) => {
    try {
        const { date_tra, hour_tra, amount, status_tra, type_tra } = req.body;
        const newTransaction = { date_tra, hour_tra, amount, status_tra, type_tra };
        await pool.query('INSERT INTO transactions SET ?', [newTransaction]);
        res.redirect('/list');
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Listar personas
router.get('/list', isLoggedIn, async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM transactions');
        res.render('transactions/list', { transactions: result });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Formulario editar persona
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const [transaction] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
        const transEdit = transaction[0];
        res.render('transactions/edit', { transaction: transEdit });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Guardar edición persona
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const { date_tra, hour_tra, amount, status_tra, type_tra } = req.body;
        const { id } = req.params;
        const editTransaction = { date_tra, hour_tra, amount, status_tra, type_tra };
        await pool.query('UPDATE transactions SET ? WHERE id = ?', [editTransaction, id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar persona
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
