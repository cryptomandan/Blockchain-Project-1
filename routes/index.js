// ./routes/index.js
// * Dynamically loads route files included in this folder.

// * Imports
const fs = require("fs"); // Used for file indexing; Built-in

function dynamicallyLoadRoutes(app) {
    // Read all of the filenames in the current folder, then apply this function
    //  to each of them
    fs.readdirSync(__dirname).forEach(function (file) {
        // Make sure we skip this file, as it's not a route!
        //  Also skip all non JS files!
        if (
            file === "index.js" ||
            file.substr(file.lastIndexOf(".") + 1) !== "js"
        )
            return;

        // Let's grab the name of the file
        let name = file.substr(0, file.indexOf("."));
        // Add the routes file to the exports
        require("./" + name)(app);
    });
}

// Export this function to dynamically load routes from the files in the folder
module.exports = dynamicallyLoadRoutes;
// ./routes/brew.js
// * The server attempts to brew coffee, but fails, because it is a teapot.

function brew(app) {
    // (Attempt) to get some coffee
    app.get("/brew", function (request, response) {
        // Send the response for brewing coffee
        response
            .status(418) // HTTP status code 418: I'm a teapot
            .send("I'm a teapot, so I cannot brew coffee!"); // Response message
    });
}

module.exports = brew;
