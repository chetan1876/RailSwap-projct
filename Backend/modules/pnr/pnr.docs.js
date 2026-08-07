/**
 * @swagger
 * tags:
 *   name: PNR
 *   description: PNR Verification APIs
 */

/**
 * @swagger
 * /api/pnr/verify:
 *   post:
 *     summary: Verify a PNR Number
 *     tags: [PNR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pnr:
 *                 type: string
 *                 example: "8425639178"
 *     responses:
 *       200:
 *         description: PNR Verified Successfully
 *       404:
 *         description: PNR Not Found
 */

/**
 * @swagger
 * /api/pnr/history:
 *   get:
 *     summary: Get Recently Verified PNRs
 *     tags: [PNR]
 *     responses:
 *       200:
 *         description: Success
 */
