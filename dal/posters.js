const { Poster, MediaProperty, Tag } = require("../models");

const getAll = async () => {
  let posters = await Poster.collection();
  return posters;
};

const getMediaProperties = async () => {
  let mediaProperties = await MediaProperty.fetchAll().map((mediaProperty) => {
    return [mediaProperty.get("id"), mediaProperty.get("name")];
  });
  return mediaProperties;
};

const addPoster = async () => {};

const findPoster = async (posterId) => {
  let poster = await Poster.where({
    id: posterId,
  }).fetch({
    require: true,
    withRelated: ["tags"],
  });
  return poster;
};

const getTags = async () => {
  let tags = await Tag.fetchAll().map((tag) => {
    return [tag.get("id"), tag.get("name")];
  });
  return tags;
};

module.exports = { getAll, getMediaProperties, addPoster, findPoster, getTags };
