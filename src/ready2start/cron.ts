import cron from 'node-cron';
import { g_DataSource } from './database';
import AWS from 'aws-sdk';
import { Brackets, In } from 'typeorm';
import { dayjsTz } from './dayjs.timezone';
const timezone = {
  schedule: true,
  timezone: 'Asia/Seoul',
};
export const cronInit = {
  cronRunning: async (schedule) => {
    cron.schedule(schedule, async () => {
      console.log('cron is running fine....');
    });
  },
  fileRemove: async (schedule) => {
    cron.schedule(
      schedule,
      async () => {
        try {
          console.log('fileRemove cron file remove....');
          AWS.config.update({
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_KEY,
            },
            region: 'us-east-1',
          });

          const keyLists = new Array();

          const keys = await g_DataSource
            .getRepository('file')
            .createQueryBuilder('file')
            .withDeleted()
            .select('file.id', 'id')
            .addSelect('file.path', 'path')
            .addSelect('file.ext', 'ext')
            .where('file.deletedAt is NOT NULL')
            .orWhere(
              new Brackets((qb) => {
                qb.where('file.in_used = :status', {
                  status: 'F',
                }).andWhere('file.updatedAt <=:date', {
                  date: dayjsTz(new Date(), 'Asia/Seoul')
                    .subtract(2, 'day')
                    .toDate(),
                });
              })
            )
            .getRawMany();

          keys.forEach(async (v) => {
            try {
              new AWS.S3().deleteObject(
                {
                  Bucket: 'img.humanb.kr',
                  Key: v.path + '/' + v.id + '.' + v.ext,
                },
                (err, data) => {
                  if (err) throw err;
                  console.log(data);
                }
              );
            } catch (error) {
              console.log(error);
            }

            keyLists.push(v.id);
          });
          // for (const file of await fs.readdir('public/bucket/resized')) {
          //   try {
          //     await fs.unlink(path.join('public/bucket/resized', file));
          //   } catch (error) {
          //     console.log(error);
          //   }
          // }
          const result = await g_DataSource
            .getRepository('file')
            .createQueryBuilder()
            .delete()
            .from('file')
            .where({
              id: In(keyLists),
            })
            .execute();
        } catch (error) {
          console.log(error);
        }
      },
      timezone
    );
  },
};
