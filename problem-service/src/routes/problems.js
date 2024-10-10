const express = require('express');
const { submitProblem, deleteProblem, getView, getResults, updateInputData} = require('../controllers/problemController');
const router = express.Router();

router.post('/submit-problem', submitProblem);
router.delete('/delete-problem/:id', deleteProblem);
router.get('/:id/results', getResults);
router.get('/:id/view', getView);
router.put('/:id/save', updateInputData);


module.exports = router;
