let getHomePage = (req, res) => {
  return res.status(200).json({
    message: "Hello world",
  });
};

export { getHomePage };
