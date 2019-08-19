const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        const { devId } = req.params;
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev does not exists' });
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();
        console.log(`${loggedDev.name} liked ${targetDev.name}`)

        if (targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[loggedDev._id];
            const targetSocket = req.connectedUsers[targetDev._id];

            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
                console.log('\x1b[36m%s\x1b[0m', `(LOGGED) ${loggedDev.name} emitted a match!`);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
                console.log('\x1b[36m%s\x1b[0m', `(TARGET) ${targetDev.name} emitted a match!`);
            }

            console.log(`${loggedDev.name} matched ${targetDev.name}`);
        }
        return res.json({ loggedDev });
    }
};