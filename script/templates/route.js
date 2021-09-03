const router = require('express').Router();
const $MODEL = require('../models/$MODEL');
const { sanitize } = require('../lib/utils');

// GET /$ROUTE (w/pagination)
router.get('/', async (req, res, next) => {
  const page = req.query?.page || 1;
  const limit = req.query?.results || 50;
  const { data, meta } = await $MODEL.paginate({}, { page, limit }).catch(err => next(err));
  res.data(data, meta);
});

// GET /$ROUTE/:id
router.get('/:id', async (req, res, next) => {
  const $INSTANCE = await $MODEL.findById(req.params.id).catch(err => next(err));
  res.data($INSTANCE || 404);
});

// POST /$ROUTE
router.post('/', async (req, res, next) => {
  const sanitizedBody = sanitize(req.body, $MODEL);
  const $INSTANCE = await $MODEL.create(sanitizedBody).catch(err => next(err));
  res.data($INSTANCE || 404);
});

// PATCH /$ROUTE/:id
router.patch('/:id', async (req, res, next) => {
  const sanitizedBody = sanitize(req.body, $MODEL);
  const $INSTANCE = await $MODEL
    .findByIdAndUpdate(req.params.id, sanitizedBody, { new: true })
    .catch(err => next(err));
  res.data($INSTANCE || 404);
});

// DELETE /$ROUTE/:id
router.delete('/:id', async (req, res, next) => {
  const $INSTANCE = await $MODEL.findByIdAndDelete(req.params.id, req.body).catch(err => next(err));
  res.data($INSTANCE || 404);
});

module.exports = router;
