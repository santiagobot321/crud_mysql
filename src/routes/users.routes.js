import { Router } from "express";
import pool from "../database.js";
import bcrypt from "bcryptjs";

const router = Router();

// Mostrar formulario de registro
router.get("/register", (req, res) => {
    res.render("users/register");
});

// Registrar usuario
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
        res.redirect("/login");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Mostrar formulario de login
router.get("/login", (req, res) => {
    res.render("users/login");
});

// Procesar login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) return res.send("Usuario no encontrado");

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.send("Contraseña incorrecta");

        req.session.userId = user.id;
        req.session.username = user.username;

        res.redirect("/panel");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Cerrar sesión
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// Panel protegido
router.get("/panel", (req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    res.render("users/panel", { username: req.session.username });
});

export default router;
