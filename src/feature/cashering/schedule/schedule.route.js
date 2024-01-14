const router = require('express').Router()
const service = require('./schedule.query')

router.route('/cashering/schedule')
    .get(async (req, res) => {
        await service.selectRecord(req.query, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })
    .post(async (req, res) => {
        await service.createRecord(req.body, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })
    .patch(async (req, res) => {
        await service.updateRecord(req.body, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })
    .delete(async (req, res) => {
        await service.deleteRecord(req.body, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })

router.get('/cashering/schedule/element', async (req, res) => {
    await service.uniqueRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans.length === 1 ? ans[0] : {} || {},
        })
    })
})

router.get('/cashering/schedule/search', async (req, res) => {
    await service.searchRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.patch('/cashering/schedule/balance', async (req, res) => {
    await service.balanceRecord(req.body, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/cashering/schedule/start', async (req, res) => {
    await service.startRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans.length > 0 ? ans[0] : {} || {},
        })
    })
})

router.get('/cashering/schedule/account', async (req, res) => {
    await service.accountRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.patch('/cashering/schedule/transfer', async (req, res) => {
    await service.transferRecord(req.body, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/cashering/schedule/logged', async (req, res) => {
    let batch = await Promise.all([
        new Promise(async (resolve, reject) => {
            await service.loggedRecord(req.query, (err, ans) => {
                if (err) reject({ status: "Error", error: err })
                resolve({ status: "Success", data: ans })
            })
        }),
        new Promise(async (resolve, reject) => {
            await service.closedRecord(req.query, (err, ans) => {
                if (err) reject({ status: "Error", error: err })
                resolve({ status: "Success", data: ans })
            })
        })
    ])
    if (batch.filter(f => f.status === "Error")?.length) {
        return res.status(200).json({
            success: false, error: err
        })
    }
    return res.status(200).json({
        success: true,
        result: [...batch[0].data, ...batch[1].data],
    })
})

router.get('/cashering/schedule/closed', async (req, res) => {
    await service.closedRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

module.exports = router