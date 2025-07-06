// const express = require("express");
import express from "express";
// config template engine
let configViewEngine = (app) => {
  app.set("views", "./src/views");
  app.set("view engine", "ejs");
  // config statis file
  app.use(express.static("./src/public"));
};

// không để dấu () phía sau , vì làm vậy là để gọi hàm , còn này mình đang tham chiếu
export default configViewEngine;
