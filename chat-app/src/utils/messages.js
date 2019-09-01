const generateMessage = (author, text) => {
  return { author, text, createdAt: new Date().getTime() };
};

const generateLocationMessage = (author, url) => {
  return { author, url, createdAt: new Date().getTime() };
};

module.exports = { generateMessage, generateLocationMessage };
