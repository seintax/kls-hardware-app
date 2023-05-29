const router = require('express').Router()
const service = require('./reports.query')

router.get('/reports/daily-sales', async (req, res) => {
    await service.dailySales(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans.length === 1 ? ans[0] : {} || {},
        })
    })
})

module.exports = router