import { PubSub } from '@google-cloud/pubsub'
import * as admin from 'firebase-admin'

admin.initializeApp()

const pubsub = new PubSub({
  apiEndpoint: 'localhost:8085',
})

const SCHEDULED_BACKUP_TOPIC = 'backupAuthUsers' // Double check this is the correct topic name
console.log(`Publishing message to topic ${SCHEDULED_BACKUP_TOPIC}`)
const data = Buffer.from(JSON.stringify({}))
const msg = await pubsub.topic(SCHEDULED_BACKUP_TOPIC).publish(data)