// handles all the errors
export function handle(err, req, res, next) {
    return res.status(200).json({ message: "test"} );
}