// 부트스트랩 등 vendors를 추가하기 위한 라우터

var express = require("express");
var vendorsRouter = express.Router();
var path = require("path");
vendorsRouter.use(
    "/bootstrap",
    express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))
);

vendorsRouter.use(
    "/jquery",

    express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);
vendorsRouter.use(
    "/jqueryui",
    express.static(path.join(__dirname, "../node_modules/jqueryui"))
);
vendorsRouter.use(
    "/fontawesome",
    express.static(
        path.join(__dirname, "../node_modules/@fortawesome/fontawesome-free/")
    )
);

module.exports = vendorsRouter;
