export function listener(port: Number, app: any) {
    app.listen(port, () => {
        console.log(`Listening on: http://localhost:${port}`);
    });
}