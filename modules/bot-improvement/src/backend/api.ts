import axios from 'axios'
import * as sdk from 'botpress/sdk'
import { Response } from 'express'
import _ from 'lodash'

import { Database } from './db'
import { flowsToGoals } from './helpers'
import { FeedbackItem, FlowView, MessageGroup } from './typings'
import { FeedbackItemSchema } from './validation'

export default async (bp: typeof sdk, db: Database) => {
  const router = bp.http.createRouterForBot('bot-improvement')

  router.get('/feedback-items', async (req, res: Response<FeedbackItem[]>) => {
    const botId = req.params.botId

    const feedbackItems = await db.getFeedbackItems(botId)

    res.send(feedbackItems)
  })

  router.get('/goals', async (req, res) => {
    const axiosConfig = await bp.http.getAxiosConfigForBot(req.params.botId, { localUrl: true })
    const flows: FlowView[] = (await axios.get('/flows', axiosConfig)).data
    const goals = flowsToGoals(flows)
    res.send(goals)
  })

  router.post('/feedback-items/:eventId', async (req, res) => {
    const { error, value } = FeedbackItemSchema.validate(req.body)
    if (error) {
      return res.status(400).send('Body is invalid')
    }

    const { eventId } = req.params
    const { status, correctedActionType, correctedObjectId } = value

    await db.updateFeedbackItem({ eventId, status, correctedActionType, correctedObjectId })

    res.sendStatus(200)
  })

  router.get('/sessions/:sessionId', async (req, res: Response<MessageGroup[]>) => {
    const { sessionId } = req.params

    const messageGroups = await db.getMessageGroups(sessionId)

    res.send(messageGroups)
  })
}
