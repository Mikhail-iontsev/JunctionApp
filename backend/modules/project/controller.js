const yup = require('yup')
const bcrypt = require('bcrypt')
const Promise = require('bluebird')
const { ProjectSchema } = require('@hackjunction/shared')
const Project = require('./model')
const { ForbiddenError } = require('../../common/errors/errors')

const controller = {}

controller.getPublicProjectById = projectId => {
    return Project.findById(projectId).then(project => {
        if (!project.sourcePublic) {
            delete project.source
        }
        return project
    })
}

controller.getProjectPreviewsByEvent = eventId => {
    return Project.find({
        event: eventId,
    }).then(projects => {
        return projects.map(project => {
            return project.getPreview()
        })
    })
}

controller.getAllProjectsByEvent = eventId => {
    return Project.find({
        event: eventId,
    })
}

controller.getProjectsByEventAndTeam = (eventId, teamId) => {
    return Project.find({
        event: eventId,
        team: teamId,
    })
}

controller.createProjectForEventAndTeam = async (event, team, data) => {
    const schema = yup.object().shape(ProjectSchema(event))
    const validatedData = await schema.validate(data, { stripUnknown: true })
    const project = new Project({
        event: event._id,
        team: team._id,
        ...validatedData,
    })

    return project.save()
}

controller.updateProjectForEventAndTeam = async (event, team, data) => {
    const schema = yup.object().shape(ProjectSchema(event))
    const validatedData = await schema.validate(data, { stripUnknown: true })
    const projects = await controller.getProjectsByEventAndTeam(
        event._id,
        team._id,
    )
    const project = projects.find(p => p._id.toString() === data._id)
    project.set(validatedData)

    return project.save()
}

controller.generateChallengeLink = async (event, challengeSlug) => {
    const hashed = await bcrypt.hash(challengeSlug, global.gConfig.HASH_SALT)
    console.log('inhere challenge :>> ')
    return {
        hash: hashed,
        link: `${global.gConfig.FRONTEND_URL}/projects/${
            event.slug
        }/challenges/${encodeURIComponent(hashed)}`,
    }
}

controller.generateTrackLink = async (event, trackSlug) => {
    const hashed = await bcrypt.hash(trackSlug, global.gConfig.HASH_SALT)
    console.log('inhere track  :>> ')
    return {
        hash: hashed,
        link: `${global.gConfig.FRONTEND_URL}/projects/${
            event.slug
        }/tracks/${encodeURIComponent(hashed)}`,
    }
}

controller.getChallengeProjectsWithToken = async (event, token) => {
    if (
        !event.challengesEnabled ||
        !event.challenges ||
        event.challenges.length === 0
    ) {
        throw new ForbiddenError('This event has no challenges')
    }

    const matches = await Promise.filter(event.challenges, challenge => {
        return bcrypt.compare(challenge.slug, token)
    })

    if (matches.length === 0) {
        throw new ForbiddenError('Invalid token')
    }

    const challenge = matches[0]
    const projects = await Project.find({
        event: event._id,
        challenges: challenge.slug,
    })

    return {
        projects,
        challenge,
        event,
    }
}

controller.getTrackProjectsWithToken = async (event, token) => {
    if (!event.tracksEnabled || !event.tracks || event.tracks.length === 0) {
        throw new ForbiddenError('This event has no tracks')
    }
    console.log('event :>> ', event)
    const matches = await Promise.filter(event.tracks, track => {
        return bcrypt.compare(track.slug, token)
    })
    console.log('matches :>> ', matches)

    if (matches.length === 0) {
        throw new ForbiddenError('Invalid token')
    }

    const track = matches[0]
    const projects = await Project.find({
        event: event._id,
        track: track.slug,
    })
    console.log('projects :>> ', projects)

    return {
        projects,
        track,
        event,
    }
}

// TODO remove
controller.validateToken = async (event, token) => {
    if (
        !event.challengesEnabled ||
        !event.challenges ||
        event.challenges.length === 0
    ) {
        throw new ForbiddenError('This event has no challenges')
    }

    const matches = await Promise.filter(event.challenges, challenge => {
        return bcrypt.compare(challenge.slug, token)
    })

    if (matches.length === 0) {
        throw new ForbiddenError('Invalid token')
    }
    return true
}

module.exports = controller
