/**
 * @swagger
 * tags:
 *   name: Seat Exchange
 *   description: APIs for Railway Seat Exchange
 */

/**
 * @swagger
 * /api/v1/seat-exchange/request:
 *   post:
 *     summary: Create a seat exchange request
 *     tags: [Seat Exchange]
 *     responses:
 *       201:
 *         description: Seat exchange request created successfully
 */

/**
 * @swagger
 * /api/v1/seat-exchange/requests:
 *   get:
 *     summary: Get all seat exchange requests
 *     tags: [Seat Exchange]
 *     responses:
 *       200:
 *         description: List of seat exchange requests
 */

/**
 * @swagger
 * /api/v1/seat-exchange/requests/{id}:
 *   get:
 *     summary: Get seat exchange request by ID
 *     tags: [Seat Exchange]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat exchange request details
 */

/**
 * @swagger
 * /api/v1/seat-exchange/find-matches:
 *   post:
 *     summary: Find matching passengers
 *     tags: [Seat Exchange]
 *     responses:
 *       200:
 *         description: Matching passengers found
 */

/**
 * @swagger
 * /api/v1/seat-exchange/accept/{id}:
 *   patch:
 *     summary: Accept a seat exchange request
 *     tags: [Seat Exchange]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request accepted successfully
 */

/**
 * @swagger
 * /api/v1/seat-exchange/reject/{id}:
 *   patch:
 *     summary: Reject a seat exchange request
 *     tags: [Seat Exchange]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request rejected successfully
 */

/**
 * @swagger
 * /api/v1/seat-exchange/cancel/{id}:
 *   patch:
 *     summary: Cancel a seat exchange request
 *     tags: [Seat Exchange]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request cancelled successfully
 */

module.exports = {};