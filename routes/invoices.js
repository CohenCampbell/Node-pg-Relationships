const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
const { get } = require("./companies");

router.get("/", async(res, req, next) =>{
    try{
    results = await db.query(`SELECT * FROM invoices`);
    if(results.length === 0){
        throw new ExpressError("No invoices found", 404);
    }
    return res.json({invoice: results.rows});
    } catch(e) {
        next(e);
    }
});

router.get("/:id", async(res, req, next) =>{
    try{
        const {id} = req.params;
        results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
        if(results.length === 0){
            throw new ExpressError("invoice not found", 404);
        }
        return res.json({invoices: results.rows[0]});
    } catch(e){
        next(e);
    }
})

router.post("/", async(res, req, next) =>{
    try{
        const {comp_code, amt} = req.body;
        results= await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) 
        RETURNING id, amt, paid, add_date, paid_date, company`, [comp_code, amt]);
        return res.json({invoices: results.rows});
    } catch(e){
        next(e);
    }
});

router.put("/:id", async(res, req, next)=>{
    try{
        const {id} = req.params;
        const {amt} = req.body;
        results= await db.query(`UPDATE invoices SET amt=$1, WHERE id=$2 
        RETURNING id, amt, paid, add_date, paid_date, company`, [amt, id]);
        return res.json({invoices: results.rows});
    } catch(e){
        next(e);
    }
});

router.delete("/:id", async(res, req, next)=> {
    const {id} = req.params;
    results= await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);
    return res.setEncoding({status: "deleted"})
});

router.get("/companies/:code", async(res, req, next)=>{
    const {code} = req.params;
    res.json({finish: "later"})
})

module.exports = router;