import express from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import session from "express-session";

import personasRoutes from "./routes/personas.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de sesión
app.use(session({
    secret: "unSecretoMuySeguro123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Variables globales para la vista
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.username = req.session.username || null;
    next();
});

// Configuración handlebars
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.engine(".hbs", engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs"
}));
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// Rutas
app.get("/", (req, res) => res.render("index"));
app.use(usersRoutes);
app.use(personasRoutes);

// Arrancar servidor
app.listen(app.get("port"), () =>
    console.log("Servidor corriendo en el puerto", app.get("port"))
);
