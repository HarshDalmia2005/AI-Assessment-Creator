import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const generationQueueName = 'assessment-generation';

export const generationQueue = new Queue(generationQueueName, {
  // @ts-ignore - Ignore ioredis version mismatch type error
  connection: redisConnection,
});

export const addGenerationJob = async (assignmentId: string, payload: any) => {
  await generationQueue.add('generate-assessment', {
    assignmentId,
    payload
  });
};
