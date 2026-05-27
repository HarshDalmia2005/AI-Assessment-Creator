import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import Assignment from '../models/Assignment';
import { generateAssessmentWithGemini } from '../services/ai.service';
import { generationQueueName } from './generation.queue';
import { Server } from 'socket.io';

let ioInstance: Server | null = null;

export const setSocketIoInstance = (io: Server) => {
  ioInstance = io;
};

export const startGenerationWorker = () => {
  const worker = new Worker(
    generationQueueName,
    async (job) => {
      const { assignmentId, payload } = job.data;
      
      try {
        console.log(`Processing job for assignment: ${assignmentId}`);

        // Update status to generating
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'generating' });
        
        if (ioInstance) {
          ioInstance.to(assignmentId).emit('status_update', { status: 'generating' });
        }

        // Call AI Service
        const generatedPaper = await generateAssessmentWithGemini(payload);

        // Save result
        await Assignment.findByIdAndUpdate(assignmentId, { 
          status: 'completed',
          generatedPaper 
        });

        if (ioInstance) {
          ioInstance.to(assignmentId).emit('generation_complete', { assignmentId });
        }

        console.log(`Job completed for assignment: ${assignmentId}`);
      } catch (error) {
        console.error(`Failed to process assignment ${assignmentId}:`, error);
        
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
        
        if (ioInstance) {
          ioInstance.to(assignmentId).emit('status_update', { status: 'failed' });
        }
      }
    },
    // @ts-ignore - Ignore ioredis version mismatch type error
    { connection: redisConnection }
  );

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err);
  });
  
  console.log('Generation Worker started listening for jobs');
};
