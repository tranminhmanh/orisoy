import { prisma } from "@/lib/prisma";

export interface ScheduledJob {
  id: string;
  articleId: string;
  platform: string;
  scheduledAt: Date;
  status: "pending" | "processing" | "completed" | "failed";
  projectId: string;
  createdAt: Date;
  error?: string;
}

export interface QueueStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export async function schedulePublishJob(params: {
  articleId: string;
  platform: "wordpress" | "facebook" | "instagram" | "twitter";
  scheduledAt: Date;
  projectId: string;
}): Promise<string> {
  // TODO: Implement real job scheduling with a queue system (BullMQ, etc.)
  try {
    const job = await prisma.publishJob.create({
      data: {
        articleId: params.articleId,
        platform: params.platform,
        scheduledAt: params.scheduledAt,
        status: "pending",
        projectId: params.projectId,
      },
    });

    return job.id;
  } catch (error) {
    console.error("schedulePublishJob error:", error);
    throw new Error(
      `Failed to schedule publish job: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function getQueueStatus(): Promise<QueueStatus> {
  // TODO: Implement real queue status check
  try {
    const [pending, processing, completed, failed] = await Promise.all([
      prisma.publishJob.count({ where: { status: "pending" } }),
      prisma.publishJob.count({ where: { status: "processing" } }),
      prisma.publishJob.count({ where: { status: "published" } }),
      prisma.publishJob.count({ where: { status: "failed" } }),
    ]);

    return { pending, processing, completed, failed };
  } catch (error) {
    console.error("getQueueStatus error:", error);
    throw new Error(
      `Failed to get queue status: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function processNextJob(): Promise<void> {
  // TODO: Implement real job processing with platform-specific publishing
  try {
    // Find the next pending job that's due
    const job = await prisma.publishJob.findFirst({
      where: {
        status: "pending",
        scheduledAt: { lte: new Date() },
      },
      orderBy: { scheduledAt: "asc" },
      include: { article: true },
    });

    if (!job) {
      return; // No jobs to process
    }

    // Mark as processing
    await prisma.publishJob.update({
      where: { id: job.id },
      data: { status: "processing" },
    });

    try {
      // TODO: Dispatch to the appropriate platform publisher
      switch (job.platform) {
        case "wordpress": {
          // const { WordPressClient } = await import("./wordpress");
          // TODO: Get WP config from project settings and publish
          break;
        }
        case "facebook": {
          // const { publishToFacebook } = await import("./facebook");
          // TODO: Publish to Facebook
          break;
        }
        case "instagram": {
          // const { publishToInstagram } = await import("./instagram");
          // TODO: Publish to Instagram
          break;
        }
        case "twitter": {
          // const { publishToTwitter } = await import("./twitter");
          // TODO: Publish to Twitter
          break;
        }
        default:
          throw new Error(`Unsupported platform: ${job.platform}`);
      }

      // Mark as completed
      await prisma.publishJob.update({
        where: { id: job.id },
        data: {
          status: "published",
          publishedAt: new Date(),
        },
      });
    } catch (publishError) {
      // Mark as failed
      await prisma.publishJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          error: publishError instanceof Error ? publishError.message : "Unknown error",
        },
      });
    }
  } catch (error) {
    console.error("processNextJob error:", error);
    throw new Error(
      `Failed to process next job: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
