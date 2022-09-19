import mockArticlesData from './mock-data/articles.json';

export default function mockArticles(req, res) {
  res.json(mockArticlesData);
}
