// Routes for all Album related operations //

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:playlist/albums", async (req, res) => {
    const { playlist } = req.params;
    const query = `
        select albumid, name
        from album
        where albumid in (
            select distinct albumid
            from song
            where sid in (
                select sid
                from playlist_contains
                where pid = ${playlist}
            )
        )
        order by name asc
    `;
    pool.query(query, (error, vals) => {
        if (error) {
            console.log(`Error on getting albums from playlist.\n${error}`);
            res.status(500).send(error.toString());
            return;
        }

        res.status(200).json(vals.rows);
    })
});

module.exports = router;
