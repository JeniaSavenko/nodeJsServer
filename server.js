const Koa = require('koa');
const IO = require('koa-socket');

const app = new Koa();
const io = new IO();

io.attach(app);

io.on('connection', ctx => {
    console.log('[server] connected');
});

let usernames = [];
io.on('disconnect', ctx => {
    const { username } = ctx.socket;
    if (username) {
        console.log(`[server] disconnected: ${username}`);
        usernames = usernames.filter(u => u !== username)
    }
});

let messages = [];
io.on('CREATE_POST', (ctx, { text }) => {
    console.log(`[server] message: ${text}`);
    const message = {
        title,
        text,
    };
    messages.push(message);
    console.log(message);

    io.broadcast('CREATE_POST', { message });
});

app.listen(3000, () => {
    console.log('[server] ready');
});
