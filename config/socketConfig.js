let ioInstancePromise;

module.exports = function (io) { 
    console.log(io,"check")
    ioInstancePromise = new Promise((resolve) => {
        const connectionHandler = (socket) => {
            console.log('A user connected');

            socket.on('user', (userId) =>{
                socket.join(userId)
                console.log(`User connected: ${userId}`)
            })

            socket.on('joinMatchRoom', (matchId) => {
                socket.join(matchId);
                console.log(`User joined room: ${matchId}`);
            });

            socket.on('hi', (data) => {
                console.log(data)
            })

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
 
            // Clean up the event listener after the first connection
            socket.off('connection', connectionHandler);
 
            // Resolve the promise with the io instance 
            resolve(io); 
        };
        // Attach the connection event listener
        io.on('connection', connectionHandler);
    });
};

// Create a function to get the io instance
module.exports.getIOInstance = async function () { 
    // Ensure ioInstancePromise is initialized
    if (!ioInstancePromise) {
        throw new Error('IO instance promise not initialized');
    }

    return ioInstancePromise;
}

// console.log(ioInstancePromise,"check")
