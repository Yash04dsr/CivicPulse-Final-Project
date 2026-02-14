const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController.js');

router.get('/', issueController.getAll);
router.get('/month', issueController.getAllIssuesByMonth);
router.get('/departmentType', issueController.getAllIssuesByDepartment);
router.get('/clearance', issueController.getAllIssuesByClearance);
router.get('/department/:dep', issueController.getByDep);
router.get('/heatmap/getData', issueController.getHeatmapData);
router.get('/:id', issueController.getById);
router.delete('/issues/:id', issueController.deleteByIssueId);
router.delete('/:id', issueController.deleteById);
router.put('/:id', issueController.updateProgress);

module.exports = router;