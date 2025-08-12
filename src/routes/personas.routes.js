import { Router } from "express";
import pool from "../database.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = Router();

// Formulario para agregar persona
router.get('/add', isLoggedIn, (req, res) => {
    res.render('personas/add');
});

// Guardar nueva persona
router.post('/add', isLoggedIn, async (req, res) => {
    try {
        const { name, lastname, age } = req.body;
        const nuevaPersona = { name, lastname, age };
        await pool.query('INSERT INTO personas SET ?', [nuevaPersona]);
        res.redirect('/list');
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Listar personas
router.get('/list', isLoggedIn, async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM personas');
        res.render('personas/list', { personas: result });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Formulario editar persona
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const [persona] = await pool.query('SELECT * FROM personas WHERE id = ?', [id]);
        const personaEdit = persona[0];
        res.render('personas/edit', { persona: personaEdit });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Guardar edición persona
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const { name, lastname, age } = req.body;
        const { id } = req.params;
        const editPersona = { name, lastname, age };
        await pool.query('UPDATE personas SET ? WHERE id = ?', [editPersona, id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar persona
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM personas WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
