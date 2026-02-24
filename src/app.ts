import express, { Request, Response } from 'express';
import pool from './config/connection';
import { Student, CreateStudentInput, UpdateStudentInput } from './types/student';
import { listener } from './utils/listener';

// INIT
const app = express();
app.use(express.json());

// GET
app.get('/students', async (req: Request, res: Response) => {
    // INIT
    let conn;
    let query;
    try {
        // awaiting pool to get connection
        conn = await pool.getConnection();
        // prepared query
        query = "SELECT * FROM students";
        // execution
        const rows: Student[] = await conn.query(query);
        // await request's responses to return a json
        res.json(rows);
    } catch (error) {
        // throw rescode 500 with json containing error msgs
        res.status(500).json({
            error: error
        });
    } finally {
        // release connection from pool using null safety check (?)
        conn?.release();
    }
});

// POST
app.post('/students', async (req: Request, res: Response) => {
    let { first_name, last_name, gender }: CreateStudentInput = req.body;

    gender = gender.toUpperCase() as "MALE" | "FEMALE";

    // validations
    if (!first_name || !last_name) {
        return res.status(400).json({
            error: "First name or Last name cannot be blank"
        });
    }

    if (!(gender == "MALE" || gender == "FEMALE")) {
        return res.status(400).json({
            error: "Gender value is invalid"
        });
    }

    let conn;
    let query;
    try {
        conn = await pool.getConnection();
        query = "INSERT INTO students (first_name, last_name, gender) VALUES (?, ?, ?)";
        const result = await conn.query(
            query,
            [first_name, last_name, gender]
        );

        res.status(201).json({
            success: true,
            id: Number.parseInt(result.insertId),
            messages: "Successfully create student"
        });
    } catch (error) {
        res.status(500).json({
            error: error
        });
    } finally {
        conn?.release();
    }
});

// PUT
app.put('/students/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { first_name, last_name, gender }: UpdateStudentInput = req.body;

    // validations
    if (!first_name || !last_name) {
        return res.status(400).json({
            error: "First name or Last name cannot be blank"
        });
    }

    if (gender as string != "MALE" || gender as string != "FEMALE") {
        return res.status(400).json({
            error: "Gender value is invalid"
        });
    }

    let conn;
    let query;
    try {
        conn = await pool.getConnection();
        query = "UPDATE students SET first_name = ?, last_name = ?, gender = ? WHERE id = ?";
        const result = conn.query(
            query,
            [first_name, last_name, gender, id]
        );

        if ((result as any).affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: `There is no student with ID ${id}`
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully update student"
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    } finally {
        conn?.release();
    }
});

// DELETE
app.delete('/students/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    let conn;
    let query;
    try {
        conn = await pool.getConnection();
        query = "DELETE FROM students WHERE id = ?";
        const result = conn.query(
            query,
            [id]
        );

        if ((result as any).affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: `There is no student with ID ${id}`
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully delete student"
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    } finally {
        conn?.release();
    }
});

listener(Number.parseInt(process.env.SERVER_PORT as string), app);