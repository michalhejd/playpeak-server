import express from "express"

const router = express.Router()

//invite player to team
router.post("/:id/invite", async (req, res) => {
})

//request to join team
router.post("/:id/request", async (req, res) => {
})

//remove invitation or request
router.delete("/:id/invitations/:invitationId", async (req, res) => {
})

//accept invitation
router.patch("/:id/accept", async (req, res) => {
})

//decline invitation
router.patch("/:id/decline", async (req, res) => {
})

//leave team
router.patch("/:id/leave", async (req, res) => {
})

//get team invitations
router.get("/:id/invitations", async (req, res) => {
})

//get team requests
router.get("/:id/requests", async (req, res) => {
})