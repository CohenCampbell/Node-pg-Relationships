const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/", async(res, req, next) =>{
    try{
    results = await db.query(`SELECT * FROM companies`);
    if(results.length === 0){
        throw new ExpressError("No companies found", 404);
    }
    return res.json({companies: results.rows});
    } catch(e) {
        next(e);
    }
});

router.get("/:code", async(res, req, next) =>{
    try{
        const {code} = req.params;
        results = await db.query(`SELECT * FROM companies WHERE code=$1`, [code]);
        if(results.length === 0){
            throw new ExpressError("No companies found", 404);
        }
        return res.json({companies: results.rows});
    } catch(e){
        next(e);
    }
})

router.post("/", async(res, req, next) =>{
    try{
        const {code, name, description} = req.body;
        results= await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) 
        RETURNING code, name, description`, [code, name, description]);
        return res.json({company: results.rows});
    } catch(e){
        next(e);
    }
});

router.put("/:code", async(res, req, next)=>{
    try{
        const {code} = req.params;
        const {name, description} = req.body;
        results= await db.query(`UPDATE companies SET name=$1, description=$2, WHERE code=$3 
        RETURNING code, name, description`, [name, description, code]);
        return res.json({company: results.rows});
    } catch(e){
        next(e);
    }
});

router.delete("/:code", async(res, req, next)=> {
    const {code} = req.params;
    results= await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
    return res.setEncoding({status: "deleted"})
});

module.exports = router;